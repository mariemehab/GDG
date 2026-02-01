// backend/controllers/courseController.js
const Course = require('../models/Course');
const { query } = require('../config/database');

// 1. الحصول على جميع المقررات
exports.getAllCourses = async (req, res) => {
    try {
        const filters = req.query;
        const courses = await Course.findAll(filters);

        res.json({
            success: true,
            data: courses,
            count: courses.length
        });

    } catch (error) {
        console.error('Get all courses error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب المقررات'
        });
    }
};

// 2. الحصول على مقرر معين
exports.getCourseById = async (req, res) => {
    try {
        const { course_id } = req.params;
        
        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'المقرر غير موجود'
            });
        }

        // الحصول على الجدول الدراسي
        const schedule = await Course.getSchedule(course_id);
        
        // الحصول على المتطلبات التفصيلية
        let prerequisitesDetails = [];
        if (course.prerequisites) {
            const prereqCodes = course.prerequisites.split(',').map(code => code.trim());
            for (const code of prereqCodes) {
                const [prereq] = await query(
                    'SELECT course_id, course_code, course_name_ar FROM courses WHERE course_code = ?',
                    [code]
                );
                if (prereq.length > 0) {
                    prerequisitesDetails.push(prereq[0]);
                }
            }
        }

        res.json({
            success: true,
            data: {
                ...course,
                schedule,
                prerequisites_details: prerequisitesDetails
            }
        });

    } catch (error) {
        console.error('Get course by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب بيانات المقرر'
        });
    }
};

// 3. إنشاء مقرر جديد (للمدراء فقط)
exports.createCourse = async (req, res) => {
    try {
        const courseData = req.body;

        // التحقق من عدم تكرار كود المقرر
        const existingCourse = await Course.findByCode(courseData.course_code);
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: 'كود المقرر مسجل بالفعل'
            });
        }

        const newCourse = await Course.create(courseData);

        res.status(201).json({
            success: true,
            message: 'تم إنشاء المقرر بنجاح',
            data: newCourse
        });

    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إنشاء المقرر'
        });
    }
};

// 4. تحديث بيانات المقرر
exports.updateCourse = async (req, res) => {
    try {
        const { course_id } = req.params;
        const updateData = req.body;

        const updatedCourse = await Course.update(course_id, updateData);
        
        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: 'المقرر غير موجود أو لا توجد بيانات للتحديث'
            });
        }

        res.json({
            success: true,
            message: 'تم تحديث بيانات المقرر بنجاح',
            data: updatedCourse
        });

    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تحديث بيانات المقرر'
        });
    }
};

// 5. حذف مقرر (تعطيل)
exports.deleteCourse = async (req, res) => {
    try {
        const { course_id } = req.params;

        // التحقق من وجود تسجيلات نشطة في المقرر
        const [activeRegistrations] = await query(
            `SELECT COUNT(*) as count FROM registrations 
             WHERE course_id = ? 
             AND status IN ('مسجل', 'معتمد')`,
            [course_id]
        );

        if (activeRegistrations[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: 'لا يمكن حذف المقرر لأنه يحتوي على طلاب مسجلين'
            });
        }

        // تعطيل المقرر بدلاً من حذفه
        await Course.update(course_id, { is_active: false });

        res.json({
            success: true,
            message: 'تم تعطيل المقرر بنجاح'
        });

    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تعطيل المقرر'
        });
    }
};

// 6. الحصول على المقررات حسب الفصل الدراسي
exports.getCoursesBySemester = async (req, res) => {
    try {
        const { semester, academic_year, department } = req.query;
        
        if (!semester || !academic_year) {
            return res.status(400).json({
                success: false,
                message: 'يجب تحديد الفصل الدراسي والسنة الأكاديمية'
            });
        }

        const filters = {
            semester,
            academic_year,
            department,
            is_active: true
        };

        const courses = await Course.findAll(filters);

        res.json({
            success: true,
            data: courses,
            count: courses.length,
            filters
        });

    } catch (error) {
        console.error('Get courses by semester error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب المقررات'
        });
    }
};

// 7. الحصول على المقررات حسب التخصص
exports.getCoursesByMajor = async (req, res) => {
    try {
        const { major, semester, academic_year } = req.query;
        
        if (!major) {
            return res.status(400).json({
                success: false,
                message: 'يجب تحديد التخصص'
            });
        }

        const courses = await Course.getCoursesByMajor(major, semester, academic_year);

        // تجميع المقررات حسب المستوى الدراسي
        const coursesByLevel = {};
        courses.forEach(course => {
            const level = parseInt(course.course_code.substring(3, 4)) || 1;
            if (!coursesByLevel[level]) {
                coursesByLevel[level] = [];
            }
            coursesByLevel[level].push(course);
        });

        res.json({
            success: true,
            data: courses,
            by_level: coursesByLevel,
            count: courses.length,
            major,
            semester,
            academic_year
        });

    } catch (error) {
        console.error('Get courses by major error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب المقررات'
        });
    }
};

// 8. إضافة جدول دراسي للمقرر
exports.addCourseSchedule = async (req, res) => {
    try {
        const { course_id } = req.params;
        const scheduleData = req.body;

        // التحقق من وجود المقرر
        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'المقرر غير موجود'
            });
        }

        const newSchedule = await Course.addSchedule(course_id, scheduleData);

        res.status(201).json({
            success: true,
            message: 'تم إضافة الجدول الدراسي بنجاح',
            data: newSchedule
        });

    } catch (error) {
        console.error('Add course schedule error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إضافة الجدول الدراسي'
        });
    }
};

// 9. الحصول على الطلاب المسجلين في مقرر
exports.getCourseStudents = async (req, res) => {
    try {
        const { course_id } = req.params;
        const { semester, academic_year } = req.query;
        
        if (!semester || !academic_year) {
            return res.status(400).json({
                success: false,
                message: 'يجب تحديد الفصل الدراسي والسنة الأكاديمية'
            });
        }

        const students = await Course.getRegisteredStudents(course_id, semester, academic_year);

        // حساب الإحصائيات
        const stats = {
            total: students.length,
            with_grades: students.filter(s => s.grade).length,
            without_grades: students.filter(s => !s.grade).length,
            passed: students.filter(s => s.grade_status === 'passed').length,
            failed: students.filter(s => s.grade_status === 'failed').length
        };

        res.json({
            success: true,
            data: students,
            statistics: stats,
            course_id,
            semester,
            academic_year
        });

    } catch (error) {
        console.error('Get course students error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب الطلاب المسجلين'
        });
    }
};

// 10. البحث في المقررات
exports.searchCourses = async (req, res) => {
    try {
        const { q, semester, academic_year, department } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'يجب إدخال كلمة للبحث'
            });
        }

        const filters = {
            search: q,
            semester,
            academic_year,
            department,
            is_active: true
        };

        const courses = await Course.findAll(filters);

        res.json({
            success: true,
            data: courses,
            count: courses.length,
            search_query: q
        });

    } catch (error) {
        console.error('Search courses error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء البحث في المقررات'
        });
    }
};

// 11. الحصول على الإحصائيات
exports.getCourseStats = async (req, res) => {
    try {
        const { semester, academic_year } = req.query;

        // إحصائيات المقررات
        const [courseStats] = await query(
            `SELECT 
                COUNT(*) as total_courses,
                SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_courses,
                SUM(CASE WHEN department = 'اتصالات' THEN 1 ELSE 0 END) as communications_courses,
                SUM(CASE WHEN department = 'حاسبات' THEN 1 ELSE 0 END) as computing_courses,
                SUM(CASE WHEN department = 'عام' THEN 1 ELSE 0 END) as general_courses,
                AVG(current_students) as avg_students_per_course,
                SUM(max_students - current_students) as total_available_seats
             FROM courses
             WHERE semester = ? AND academic_year = ?`,
            [semester || 'الأول', academic_year || new Date().getFullYear()]
        );

        // أكثر المقررات شعبية
        const [popularCourses] = await query(
            `SELECT 
                c.course_code, c.course_name_ar, 
                c.department, c.current_students, c.max_students,
                ROUND((c.current_students * 100.0 / c.max_students), 2) as fill_percentage
             FROM courses c
             WHERE c.semester = ? AND c.academic_year = ?
             ORDER BY c.current_students DESC
             LIMIT 10`,
            [semester || 'الأول', academic_year || new Date().getFullYear()]
        );

        res.json({
            success: true,
            data: {
                statistics: courseStats[0],
                popular_courses: popularCourses
            }
        });

    } catch (error) {
        console.error('Get course stats error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب إحصائيات المقررات'
        });
    }
};

// 12. تحديث عدد الطلاب في المقرر
exports.updateStudentCount = async (req, res) => {
    try {
        const { course_id } = req.params;

        const updatedCourse = await Course.updateStudentCount(course_id);

        res.json({
            success: true,
            message: 'تم تحديث عدد الطلاب بنجاح',
            data: updatedCourse
        });

    } catch (error) {
        console.error('Update student count error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تحديث عدد الطلاب'
        });
    }
};