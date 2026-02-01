// backend/models/Registration.js
const { query, beginTransaction, commitTransaction, rollbackTransaction } = require('../config/database');

class Registration {
    // تسجيل مقرر جديد
    static async create(registrationData) {
        const connection = await beginTransaction();
        
        try {
            // 1. تسجيل المقرر
            const sql = `
                INSERT INTO registrations (
                    student_id, course_id, semester, academic_year, status
                ) VALUES (?, ?, ?, ?, ?)
            `;
            
            const params = [
                registrationData.student_id,
                registrationData.course_id,
                registrationData.semester,
                registrationData.academic_year,
                registrationData.status || 'مسجل'
            ];
            
            const [result] = await connection.execute(sql, params);
            const registrationId = result.insertId;
            
            // 2. تحديث عدد الطلاب في المقرر
            await connection.execute(
                `UPDATE courses 
                 SET current_students = current_students + 1 
                 WHERE course_id = ?`,
                [registrationData.course_id]
            );
            
            // 3. تسجيل في التاريخ
            await connection.execute(
                `INSERT INTO registration_history 
                 (student_id, course_id, semester, academic_year, 
                  registration_type, action_by, status_before, status_after) 
                 VALUES (?, ?, ?, ?, 'initial', 'student', NULL, ?)`,
                [
                    registrationData.student_id,
                    registrationData.course_id,
                    registrationData.semester,
                    registrationData.academic_year,
                    registrationData.status || 'مسجل'
                ]
            );
            
            await commitTransaction(connection);
            
            return {
                registration_id: registrationId,
                ...registrationData
            };
            
        } catch (error) {
            await rollbackTransaction(connection);
            throw error;
        }
    }

    // إلغاء التسجيل
    static async cancel(registrationId, studentId) {
        const connection = await beginTransaction();
        
        try {
            // 1. الحصول على بيانات التسجيل
            const [registrations] = await connection.execute(
                'SELECT * FROM registrations WHERE registration_id = ? AND student_id = ?',
                [registrationId, studentId]
            );
            
            if (registrations.length === 0) {
                throw new Error('التسجيل غير موجود أو لا ينتمي للطالب');
            }
            
            const registration = registrations[0];
            
            // 2. تحديث حالة التسجيل
            await connection.execute(
                'UPDATE registrations SET status = "ملغي" WHERE registration_id = ?',
                [registrationId]
            );
            
            // 3. تحديث عدد الطلاب في المقرر
            await connection.execute(
                `UPDATE courses 
                 SET current_students = GREATEST(0, current_students - 1) 
                 WHERE course_id = ?`,
                [registration.course_id]
            );
            
            // 4. تسجيل في التاريخ
            await connection.execute(
                `INSERT INTO registration_history 
                 (student_id, course_id, semester, academic_year, 
                  registration_type, action_by, status_before, status_after) 
                 VALUES (?, ?, ?, ?, 'cancel', 'student', ?, 'ملغي')`,
                [
                    registration.student_id,
                    registration.course_id,
                    registration.semester,
                    registration.academic_year,
                    registration.status
                ]
            );
            
            await commitTransaction(connection);
            
            return {
                success: true,
                message: 'تم إلغاء التسجيل بنجاح'
            };
            
        } catch (error) {
            await rollbackTransaction(connection);
            throw error;
        }
    }

    // الحصول على التسجيلات حسب الطالب
    static async findByStudent(studentId, semester, academicYear) {
        const sql = `
            SELECT 
                r.*,
                c.course_code, c.course_name_ar, c.course_name_en, 
                c.credit_hours, c.department,
                i.full_name_ar as instructor_name,
                g.grade, g.grade_points, g.status as grade_status
            FROM registrations r
            JOIN courses c ON r.course_id = c.course_id
            LEFT JOIN instructors i ON c.instructor_id = i.instructor_id
            LEFT JOIN grades g ON r.registration_id = g.registration_id
            WHERE r.student_id = ?
            AND r.semester = ?
            AND r.academic_year = ?
            ORDER BY c.course_code
        `;
        
        return await query(sql, [studentId, semester, academicYear]);
    }

    // الحصول على التسجيلات حسب المقرر
    static async findByCourse(courseId, semester, academicYear) {
        const sql = `
            SELECT 
                r.*,
                s.student_id, s.full_name_ar, s.full_name_en, s.email,
                s.major, s.academic_year as student_year,
                g.grade, g.grade_points, g.status as grade_status
            FROM registrations r
            JOIN students s ON r.student_id = s.student_id
            LEFT JOIN grades g ON r.registration_id = g.registration_id
            WHERE r.course_id = ?
            AND r.semester = ?
            AND r.academic_year = ?
            AND r.status IN ('مسجل', 'معتمد')
            ORDER BY s.full_name_ar
        `;
        
        return await query(sql, [courseId, semester, academicYear]);
    }

    // التحقق من وجود تسجيل مسبق
    static async checkDuplicate(studentId, courseId, semester, academicYear) {
        const sql = `
            SELECT * FROM registrations 
            WHERE student_id = ? 
            AND course_id = ? 
            AND semester = ? 
            AND academic_year = ?
            AND status IN ('مسجل', 'معتمد')
        `;
        
        const results = await query(sql, [studentId, courseId, semester, academicYear]);
        return results.length > 0;
    }

    // الحصول على عدد الساعات المسجلة
    static async getTotalHours(studentId, semester, academicYear) {
        const sql = `
            SELECT SUM(c.credit_hours) as total_hours
            FROM registrations r
            JOIN courses c ON r.course_id = c.course_id
            WHERE r.student_id = ?
            AND r.semester = ?
            AND r.academic_year = ?
            AND r.status IN ('مسجل', 'معتمد')
        `;
        
        const results = await query(sql, [studentId, semester, academicYear]);
        return results[0].total_hours || 0;
    }

    // سحب مقرر (Withdraw)
    static async withdraw(registrationId, studentId, reason = '') {
        const connection = await beginTransaction();
        
        try {
            // 1. الحصول على بيانات التسجيل
            const [registrations] = await connection.execute(
                'SELECT * FROM registrations WHERE registration_id = ? AND student_id = ?',
                [registrationId, studentId]
            );
            
            if (registrations.length === 0) {
                throw new Error('التسجيل غير موجود أو لا ينتمي للطالب');
            }
            
            const registration = registrations[0];
            
            // 2. التحقق من أن المقرر يمكن سحبه (قبل تاريخ معين)
            const currentDate = new Date();
            const withdrawDeadline = new Date(registration.academic_year, 
                registration.semester === 'الأول' ? 8 : 1, 15); // مثال: 15 سبتمبر للفصل الأول
            
            if (currentDate > withdrawDeadline) {
                throw new Error('انتهت فترة السحب لهذا المقرر');
            }
            
            // 3. تحديث حالة التسجيل
            await connection.execute(
                'UPDATE registrations SET status = "سحب" WHERE registration_id = ?',
                [registrationId]
            );
            
            // 4. تحديث عدد الطلاب في المقرر
            await connection.execute(
                `UPDATE courses 
                 SET current_students = GREATEST(0, current_students - 1) 
                 WHERE course_id = ?`,
                [registration.course_id]
            );
            
            // 5. تسجيل في التاريخ
            await connection.execute(
                `INSERT INTO registration_history 
                 (student_id, course_id, semester, academic_year, 
                  registration_type, action_by, status_before, status_after, notes) 
                 VALUES (?, ?, ?, ?, 'withdraw', 'student', ?, 'سحب', ?)`,
                [
                    registration.student_id,
                    registration.course_id,
                    registration.semester,
                    registration.academic_year,
                    registration.status,
                    reason
                ]
            );
            
            await commitTransaction(connection);
            
            return {
                success: true,
                message: 'تم سحب المقرر بنجاح'
            };
            
        } catch (error) {
            await rollbackTransaction(connection);
            throw error;
        }
    }

    // تغيير حالة التسجيل (للإداريين)
    static async updateStatus(registrationId, newStatus, updatedBy) {
        const connection = await beginTransaction();
        
        try {
            // 1. الحصول على الحالة الحالية
            const [registrations] = await connection.execute(
                'SELECT * FROM registrations WHERE registration_id = ?',
                [registrationId]
            );
            
            if (registrations.length === 0) {
                throw new Error('التسجيل غير موجود');
            }
            
            const registration = registrations[0];
            const oldStatus = registration.status;
            
            // 2. تحديث حالة التسجيل
            await connection.execute(
                'UPDATE registrations SET status = ? WHERE registration_id = ?',
                [newStatus, registrationId]
            );
            
            // 3. إذا كانت الحالة الجديدة "ملغي" أو "سحب"، نقص عدد الطلاب
            if ((oldStatus === 'مسجل' || oldStatus === 'معتمد') && 
                (newStatus === 'ملغي' || newStatus === 'سحب')) {
                await connection.execute(
                    `UPDATE courses 
                     SET current_students = GREATEST(0, current_students - 1) 
                     WHERE course_id = ?`,
                    [registration.course_id]
                );
            }
            
            // 4. إذا كانت الحالة القديمة "ملغي" أو "سحب" والحالة الجديدة "مسجل" أو "معتمد"، نزيد عدد الطلاب
            if ((oldStatus === 'ملغي' || oldStatus === 'سحب') && 
                (newStatus === 'مسجل' || newStatus === 'معتمد')) {
                await connection.execute(
                    `UPDATE courses 
                     SET current_students = current_students + 1 
                     WHERE course_id = ?`,
                    [registration.course_id]
                );
            }
            
            // 5. تسجيل في التاريخ
            await connection.execute(
                `INSERT INTO registration_history 
                 (student_id, course_id, semester, academic_year, 
                  registration_type, action_by, status_before, status_after) 
                 VALUES (?, ?, ?, ?, 'status_change', ?, ?, ?)`,
                [
                    registration.student_id,
                    registration.course_id,
                    registration.semester,
                    registration.academic_year,
                    updatedBy,
                    oldStatus,
                    newStatus
                ]
            );
            
            await commitTransaction(connection);
            
            return {
                success: true,
                message: `تم تغيير حالة التسجيل من "${oldStatus}" إلى "${newStatus}"`
            };
            
        } catch (error) {
            await rollbackTransaction(connection);
            throw error;
        }
    }

    // الحصول على السجل التاريخي للتسجيلات
    static async getHistory(studentId, limit = 50) {
        const sql = `
            SELECT * FROM registration_history
            WHERE student_id = ?
            ORDER BY action_date DESC
            LIMIT ?
        `;
        
        return await query(sql, [studentId, limit]);
    }

    // الحصول على الإحصائيات
    static async getStats(semester, academicYear) {
        const sql = `
            SELECT 
                COUNT(*) as total_registrations,
                SUM(CASE WHEN status = 'مسجل' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'معتمد' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'ملغي' THEN 1 ELSE 0 END) as cancelled,
                SUM(CASE WHEN status = 'سحب' THEN 1 ELSE 0 END) as withdrawn,
                COUNT(DISTINCT student_id) as unique_students,
                COUNT(DISTINCT course_id) as unique_courses
            FROM registrations
            WHERE semester = ? AND academic_year = ?
        `;
        
        const results = await query(sql, [semester, academicYear]);
        return results[0];
    }
}

module.exports = Registration;