// backend/models/Student.js
const { query, querySafe } = require('../config/database');

class Student {
    // إنشاء طالب جديد
    static async create(studentData) {
        const sql = `
            INSERT INTO students (
                student_id, national_id, full_name_ar, full_name_en, email,
                password, phone, birth_date, gender, address,
                high_school_name, high_school_year, high_school_grade,
                major, academic_year, semester, account_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            studentData.student_id,
            studentData.national_id,
            studentData.full_name_ar,
            studentData.full_name_en,
            studentData.email,
            studentData.password,
            studentData.phone,
            studentData.birth_date,
            studentData.gender,
            studentData.address,
            studentData.high_school_name,
            studentData.high_school_year,
            studentData.high_school_grade,
            studentData.major,
            studentData.academic_year || new Date().getFullYear(),
            studentData.semester || 'الأول',
            studentData.account_status || 'غير مفعل'
        ];
        
        return await query(sql, params);
    }

    // البحث عن طالب بالبريد الإلكتروني
    static async findByEmail(email) {
        const sql = 'SELECT * FROM students WHERE email = ?';
        const results = await query(sql, [email]);
        return results[0] || null;
    }

    // البحث عن طالب بالرقم القومي
    static async findByNationalId(nationalId) {
        const sql = 'SELECT * FROM students WHERE national_id = ?';
        const results = await query(sql, [nationalId]);
        return results[0] || null;
    }

    // البحث عن طالب بالرقم الجامعي
    static async findById(studentId) {
        const sql = 'SELECT * FROM students WHERE student_id = ?';
        const results = await query(sql, [studentId]);
        return results[0] || null;
    }

    // تحديث بيانات الطالب
    static async update(studentId, updateData) {
        const allowedFields = [
            'phone', 'address', 'personal_email', 
            'account_status', 'academic_status', 'gpa'
        ];
        
        const updates = [];
        const values = [];
        
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key) && updateData[key] !== undefined) {
                updates.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });
        
        if (updates.length === 0) {
            return null;
        }
        
        values.push(studentId);
        const sql = `UPDATE students SET ${updates.join(', ')} WHERE student_id = ?`;
        
        await query(sql, values);
        return this.findById(studentId);
    }

    // تفعيل حساب الطالب
    static async activateAccount(studentId) {
        const sql = `
            UPDATE students 
            SET account_status = 'مفعل', is_email_verified = TRUE 
            WHERE student_id = ?
        `;
        await query(sql, [studentId]);
        return this.findById(studentId);
    }

    // الحصول على جميع الطلاب (مع فلترة)
    static async findAll(filters = {}, page = 1, limit = 20) {
        let sql = 'SELECT * FROM students WHERE 1=1';
        const params = [];
        
        // تطبيق الفلاتر
        if (filters.major) {
            sql += ' AND major = ?';
            params.push(filters.major);
        }
        
        if (filters.academic_year) {
            sql += ' AND academic_year = ?';
            params.push(filters.academic_year);
        }
        
        if (filters.academic_status) {
            sql += ' AND academic_status = ?';
            params.push(filters.academic_status);
        }
        
        if (filters.account_status) {
            sql += ' AND account_status = ?';
            params.push(filters.account_status);
        }
        
        if (filters.search) {
            sql += ' AND (full_name_ar LIKE ? OR full_name_en LIKE ? OR student_id LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }
        
        // حساب إجمالي النتائج
        const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
        const [{ total }] = await query(countSql, params);
        
        // تطبيق الترقيم
        const offset = (page - 1) * limit;
        sql += ' ORDER BY student_id DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        
        const students = await query(sql, params);
        
        return {
            students,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    // الحصول على التقدم الأكاديمي للطالب
    static async getAcademicProgress(studentId) {
        const sql = `
            SELECT 
                s.*,
                COUNT(DISTINCT r.course_id) as total_courses,
                SUM(c.credit_hours) as total_hours,
                COALESCE(AVG(g.grade_points), 0) as current_gpa,
                (SELECT COUNT(*) FROM courses WHERE department = s.major) as total_required_courses
            FROM students s
            LEFT JOIN registrations r ON s.student_id = r.student_id AND r.status = 'معتمد'
            LEFT JOIN courses c ON r.course_id = c.course_id
            LEFT JOIN (
                SELECT student_id, course_id, MAX(grade_points) as grade_points
                FROM grades
                WHERE status = 'passed'
                GROUP BY student_id, course_id
            ) g ON s.student_id = g.student_id AND r.course_id = g.course_id
            WHERE s.student_id = ?
            GROUP BY s.student_id
        `;
        
        const results = await query(sql, [studentId]);
        return results[0] || null;
    }

    // الحصول على المقررات المسجلة حالياً
    static async getCurrentCourses(studentId, semester, academicYear) {
        const sql = `
            SELECT 
                r.*,
                c.course_code, c.course_name_ar, c.course_name_en, c.credit_hours,
                c.department, c.prerequisites,
                s.day_of_week, s.start_time, s.end_time, s.classroom,
                i.full_name_ar as instructor_name
            FROM registrations r
            JOIN courses c ON r.course_id = c.course_id
            LEFT JOIN schedules s ON c.course_id = s.course_id
            LEFT JOIN instructors i ON c.instructor_id = i.instructor_id
            WHERE r.student_id = ? 
            AND r.semester = ? 
            AND r.academic_year = ?
            AND r.status IN ('مسجل', 'معتمد')
            ORDER BY s.day_of_week, s.start_time
        `;
        
        return await query(sql, [studentId, semester, academicYear]);
    }

    // الحصول على السجل الأكاديمي الكامل
    static async getAcademicTranscript(studentId) {
        const sql = `
            SELECT 
                g.*,
                c.course_code, c.course_name_ar, c.course_name_en, c.credit_hours,
                c.department, c.semester as course_semester
            FROM grades g
            JOIN courses c ON g.course_id = c.course_id
            WHERE g.student_id = ?
            ORDER BY g.academic_year DESC, 
                     CASE g.semester 
                         WHEN 'الأول' THEN 1 
                         WHEN 'الثاني' THEN 2 
                         WHEN 'الصيفي' THEN 3 
                     END,
                     c.course_code
        `;
        
        return await query(sql, [studentId]);
    }

    // تحديث المعدل التراكمي للطالب
    static async updateGPA(studentId) {
        const sql = `
            UPDATE students s
            SET s.gpa = (
                SELECT COALESCE(AVG(g.grade_points), 0)
                FROM (
                    SELECT student_id, course_id, MAX(grade_points) as grade_points
                    FROM grades
                    WHERE student_id = ? AND status = 'passed'
                    GROUP BY student_id, course_id
                ) g
                WHERE g.student_id = s.student_id
            )
            WHERE s.student_id = ?
        `;
        
        await query(sql, [studentId, studentId]);
        return this.findById(studentId);
    }

    // الحصول على المقررات المتاحة للتسجيل
    static async getAvailableCourses(studentId, semester, academicYear) {
        const sql = `
            SELECT c.*
            FROM courses c
            WHERE c.semester = ?
            AND c.academic_year = ?
            AND c.is_active = TRUE
            AND c.current_students < c.max_students
            AND c.course_id NOT IN (
                SELECT course_id 
                FROM registrations 
                WHERE student_id = ? 
                AND semester = ? 
                AND academic_year = ? 
                AND status IN ('مسجل', 'معتمد')
            )
            AND c.course_id NOT IN (
                SELECT course_id 
                FROM grades 
                WHERE student_id = ? 
                AND status = 'passed'
            )
            ORDER BY c.department, c.course_code
        `;
        
        return await query(sql, [
            semester, academicYear, 
            studentId, semester, academicYear,
            studentId
        ]);
    }

    // التحقق من المتطلبات السابقة
    static async checkPrerequisites(studentId, courseId) {
        const sql = `
            SELECT c.prerequisites
            FROM courses c
            WHERE c.course_id = ?
        `;
        
        const [course] = await query(sql, [courseId]);
        
        if (!course.prerequisites) {
            return { passed: true, missing: [] };
        }
        
        const prereqCodes = course.prerequisites.split(',').map(code => code.trim());
        const missing = [];
        
        for (const prereqCode of prereqCodes) {
            const [prereqCourse] = await query(
                'SELECT course_id FROM courses WHERE course_code = ?',
                [prereqCode]
            );
            
            if (prereqCourse) {
                const [passed] = await query(
                    `SELECT 1 FROM grades 
                     WHERE student_id = ? 
                     AND course_id = ? 
                     AND status = 'passed'`,
                    [studentId, prereqCourse.course_id]
                );
                
                if (!passed) {
                    missing.push(prereqCode);
                }
            }
        }
        
        return {
            passed: missing.length === 0,
            missing,
            totalPrerequisites: prereqCodes.length,
            passedPrerequisites: prereqCodes.length - missing.length
        };
    }
}

module.exports = Student;