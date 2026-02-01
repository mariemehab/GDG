// backend/models/Course.js
const { query } = require('../config/database');

class Course {
    // إنشاء مقرر جديد
    static async create(courseData) {
        const sql = `
            INSERT INTO courses (
                course_code, course_name_ar, course_name_en, 
                credit_hours, semester, academic_year, department,
                prerequisites, max_students, instructor_id, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            courseData.course_code,
            courseData.course_name_ar,
            courseData.course_name_en,
            courseData.credit_hours,
            courseData.semester,
            courseData.academic_year,
            courseData.department,
            courseData.prerequisites || null,
            courseData.max_students || 40,
            courseData.instructor_id || null,
            courseData.description || null
        ];
        
        return await query(sql, params);
    }

    // البحث عن مقرر بالكود
    static async findByCode(courseCode) {
        const sql = 'SELECT * FROM courses WHERE course_code = ?';
        const results = await query(sql, [courseCode]);
        return results[0] || null;
    }

    // البحث عن مقرر بالرقم
    static async findById(courseId) {
        const sql = 'SELECT * FROM courses WHERE course_id = ?';
        const results = await query(sql, [courseId]);
        return results[0] || null;
    }

    // الحصول على جميع المقررات
    static async findAll(filters = {}) {
        let sql = `
            SELECT c.*, 
                   i.full_name_ar as instructor_name,
                   COUNT(DISTINCT r.registration_id) as registered_students
            FROM courses c
            LEFT JOIN instructors i ON c.instructor_id = i.instructor_id
            LEFT JOIN registrations r ON c.course_id = r.course_id 
                AND r.status IN ('مسجل', 'معتمد')
            WHERE 1=1
        `;
        
        const params = [];
        
        if (filters.semester) {
            sql += ' AND c.semester = ?';
            params.push(filters.semester);
        }
        
        if (filters.academic_year) {
            sql += ' AND c.academic_year = ?';
            params.push(filters.academic_year);
        }
        
        if (filters.department) {
            sql += ' AND c.department = ?';
            params.push(filters.department);
        }
        
        if (filters.instructor_id) {
            sql += ' AND c.instructor_id = ?';
            params.push(filters.instructor_id);
        }
        
        if (filters.is_active !== undefined) {
            sql += ' AND c.is_active = ?';
            params.push(filters.is_active);
        }
        
        if (filters.search) {
            sql += ' AND (c.course_code LIKE ? OR c.course_name_ar LIKE ? OR c.course_name_en LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }
        
        sql += ' GROUP BY c.course_id ORDER BY c.department, c.course_code';
        
        return await query(sql, params);
    }

    // تحديث بيانات المقرر
    static async update(courseId, updateData) {
        const allowedFields = [
            'course_name_ar', 'course_name_en', 'credit_hours',
            'prerequisites', 'max_students', 'instructor_id',
            'description', 'is_active'
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
        
        values.push(courseId);
        const sql = `UPDATE courses SET ${updates.join(', ')} WHERE course_id = ?`;
        
        await query(sql, values);
        return this.findById(courseId);
    }

    // تحديث عدد الطلاب المسجلين
    static async updateStudentCount(courseId) {
        const sql = `
            UPDATE courses c
            SET c.current_students = (
                SELECT COUNT(*) 
                FROM registrations r 
                WHERE r.course_id = ? 
                AND r.status IN ('مسجل', 'معتمد')
            )
            WHERE c.course_id = ?
        `;
        
        await query(sql, [courseId, courseId]);
        return this.findById(courseId);
    }

    // الحصول على الطلاب المسجلين في المقرر
    static async getRegisteredStudents(courseId, semester, academicYear) {
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

    // الحصول على الجدول الدراسي للمقرر
    static async getSchedule(courseId) {
        const sql = `
            SELECT s.*, i.full_name_ar as instructor_name
            FROM schedules s
            LEFT JOIN instructors i ON s.instructor_id = i.instructor_id
            WHERE s.course_id = ?
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
        
        return await query(sql, [courseId]);
    }

    // إضافة جدول دراسي للمقرر
    static async addSchedule(courseId, scheduleData) {
        const sql = `
            INSERT INTO schedules (
                course_id, day_of_week, start_time, end_time,
                classroom, instructor_id
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            courseId,
            scheduleData.day_of_week,
            scheduleData.start_time,
            scheduleData.end_time,
            scheduleData.classroom,
            scheduleData.instructor_id || null
        ];
        
        return await query(sql, params);
    }

    // الحصول على المقررات التي يدرسها مدرس معين
    static async getInstructorCourses(instructorId, semester, academicYear) {
        const sql = `
            SELECT c.*, 
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

    // الحصول على المقررات حسب التخصص
    static async getCoursesByMajor(major, semester, academicYear) {
        const sql = `
            SELECT c.*
            FROM courses c
            WHERE c.department = ?
            AND c.semester = ?
            AND c.academic_year = ?
            AND c.is_active = TRUE
            ORDER BY c.course_code
        `;
        
        return await query(sql, [major, semester, academicYear]);
    }

    // التحقق من وجود تعارض في الجدول الدراسي
    static async checkScheduleConflict(studentId, courseId) {
        const sql = `
            SELECT 
                c2.course_code as conflicting_course,
                s2.day_of_week,
                s2.start_time,
                s2.end_time,
                s2.classroom
            FROM schedules s1
            JOIN courses c1 ON s1.course_id = c1.course_id
            JOIN schedules s2 ON s1.day_of_week = s2.day_of_week
                AND (
                    (s1.start_time BETWEEN s2.start_time AND s2.end_time) OR
                    (s1.end_time BETWEEN s2.start_time AND s2.end_time) OR
                    (s2.start_time BETWEEN s1.start_time AND s1.end_time)
                )
                AND s1.course_id != s2.course_id
            JOIN courses c2 ON s2.course_id = c2.course_id
            JOIN registrations r ON c2.course_id = r.course_id
            WHERE c1.course_id = ?
            AND r.student_id = ?
            AND r.status IN ('مسجل', 'معتمد')
        `;
        
        return await query(sql, [courseId, studentId]);
    }
}

module.exports = Course;