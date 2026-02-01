// backend/models/Instructor.js
const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class Instructor {
    // إنشاء مدرس جديد
    static async create(instructorData) {
        // تشفير كلمة المرور
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(instructorData.password, salt);
        
        const sql = `
            INSERT INTO instructors (
                employee_id, full_name_ar, full_name_en, email,
                password, phone, department, rank
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            instructorData.employee_id,
            instructorData.full_name_ar,
            instructorData.full_name_en,
            instructorData.email,
            hashedPassword,
            instructorData.phone,
            instructorData.department,
            instructorData.rank
        ];
        
        return await query(sql, params);
    }

    // البحث عن مدرس بالبريد الإلكتروني
    static async findByEmail(email) {
        const sql = 'SELECT * FROM instructors WHERE email = ?';
        const results = await query(sql, [email]);
        return results[0] || null;
    }

    // البحث عن مدرس برقم الموظف
    static async findByEmployeeId(employeeId) {
        const sql = 'SELECT * FROM instructors WHERE employee_id = ?';
        const results = await query(sql, [employeeId]);
        return results[0] || null;
    }

    // البحث عن مدرس بالرقم
    static async findById(instructorId) {
        const sql = 'SELECT * FROM instructors WHERE instructor_id = ?';
        const results = await query(sql, [instructorId]);
        return results[0] || null;
    }

    // التحقق من كلمة المرور
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // تحديث بيانات المدرس
    static async update(instructorId, updateData) {
        const allowedFields = [
            'phone', 'department', 'rank', 'account_status'
        ];
        
        const updates = [];
        const values = [];
        
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key) && updateData[key] !== undefined) {
                updates.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });
        
        // إذا كان هناك تحديث لكلمة المرور
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(updateData.password, salt);
            updates.push('password = ?');
            values.push(hashedPassword);
        }
        
        if (updates.length === 0) {
            return null;
        }
        
        values.push(instructorId);
        const sql = `UPDATE instructors SET ${updates.join(', ')} WHERE instructor_id = ?`;
        
        await query(sql, values);
        return this.findById(instructorId);
    }

    // الحصول على جميع المدرسين
    static async findAll(filters = {}) {
        let sql = 'SELECT * FROM instructors WHERE 1=1';
        const params = [];
        
        if (filters.department) {
            sql += ' AND department = ?';
            params.push(filters.department);
        }
        
        if (filters.rank) {
            sql += ' AND rank = ?';
            params.push(filters.rank);
        }
        
        if (filters.is_active !== undefined) {
            sql += ' AND is_active = ?';
            params.push(filters.is_active);
        }
        
        if (filters.search) {
            sql += ' AND (full_name_ar LIKE ? OR full_name_en LIKE ? OR employee_id LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }
        
        sql += ' ORDER BY department, rank, full_name_ar';
        
        return await query(sql, params);
    }

    // الحصول على المقررات التي يدرسها المدرس
    static async getAssignedCourses(instructorId, semester, academicYear) {
        const sql = `
            SELECT 
                c.*,
                COUNT(DISTINCT r.registration_id) as total_students
            FROM courses c
            LEFT JOIN registrations r ON c.course_id = r.course_id
                AND r.semester = ?
                AND r.academic_year = ?
                AND r.status IN ('مسجل', 'معتمد')
            WHERE c.instructor_id = ?
            AND c.semester = ?
            AND c.academic_year = ?
            GROUP BY c.course_id
            ORDER BY c.course_code
        `;
        
        return await query(sql, [
            semester, academicYear,
            instructorId, semester, academicYear
        ]);
    }

    // الحصول على الجدول الدراسي للمدرس
    static async getSchedule(instructorId, semester, academicYear) {
        const sql = `
            SELECT 
                s.*,
                c.course_code, c.course_name_ar, c.credit_hours,
                c.department,
                COUNT(DISTINCT r.registration_id) as total_students
            FROM schedules s
            JOIN courses c ON s.course_id = c.course_id
            LEFT JOIN registrations r ON c.course_id = r.course_id
                AND r.semester = ?
                AND r.academic_year = ?
                AND r.status IN ('مسجل', 'معتمد')
            WHERE s.instructor_id = ?
            AND c.semester = ?
            AND c.academic_year = ?
            GROUP BY s.schedule_id
            ORDER BY 
                CASE s.day_of_week
                    WHEN 'السبت' THEN 1
                    WHEN 'الأحد' THEN 2
                    WHEN 'الإثنين' THEN 3
                    WHEN 'الثلاثاء' THEN 4
                    WHEN 'الأربعاء' THEN 5
                    WHEN 'الخميس' THEN 6
                END,
                s.start_time
        `;
        
        return await query(sql, [
            semester, academicYear,
            instructorId, semester, academicYear
        ]);
    }

    // إضافة درجة للطالب
    static async addGrade(registrationId, gradeData) {
        const sql = `
            INSERT INTO grades (
                registration_id, grade, grade_points, status,
                semester, academic_year, added_by, added_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        const gradePoints = this.calculateGradePoints(gradeData.grade);
        const status = gradeData.grade === 'F' ? 'failed' : 'passed';
        
        const params = [
            registrationId,
            gradeData.grade,
            gradePoints,
            status,
            gradeData.semester,
            gradeData.academic_year,
            gradeData.added_by || 'instructor'
        ];
        
        return await query(sql, params);
    }

    // حساب نقاط الدرجة
    static calculateGradePoints(grade) {
        const gradeMap = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'F': 0.0
        };
        
        return gradeMap[grade] || 0;
    }

    // الحصول على طلاب المقرر لتقييمهم
    static async getCourseStudents(courseId, semester, academicYear) {
        const sql = `
            SELECT 
                r.registration_id,
                s.student_id, s.full_name_ar, s.full_name_en,
                s.email, s.major, s.academic_year as student_year,
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

    // تحديث درجة الطالب
    static async updateGrade(gradeId, gradeData) {
        const sql = `
            UPDATE grades 
            SET grade = ?, 
                grade_points = ?,
                status = ?,
                updated_at = NOW()
            WHERE id = ?
        `;
        
        const gradePoints = this.calculateGradePoints(gradeData.grade);
        const status = gradeData.grade === 'F' ? 'failed' : 'passed';
        
        const params = [
            gradeData.grade,
            gradePoints,
            status,
            gradeId
        ];
        
        await query(sql, params);
        
        // تحديث المعدل التراكمي للطالب
        const [grade] = await query('SELECT registration_id FROM grades WHERE id = ?', [gradeId]);
        if (grade) {
            const [registration] = await query(
                'SELECT student_id FROM registrations WHERE registration_id = ?',
                [grade.registration_id]
            );
            if (registration) {
                // هنا يمكن استدعاء دالة تحديث المعدل
                // await Student.updateGPA(registration.student_id);
            }
        }
        
        return gradeId;
    }
}

module.exports = Instructor;