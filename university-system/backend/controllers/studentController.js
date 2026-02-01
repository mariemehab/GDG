// backend/controllers/studentController.js
const Student = require('../models/Student');
const Course = require('../models/Course');
const Registration = require('../models/Registration');
const { query } = require('../config/database');

// 1. الحصول على بيانات الطالب الشخصية
exports.getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'الطالب غير موجود'
            });
        }

        // إزالة الحقول الحساسة
        delete student.password;
        
        res.json({
            success: true,
            data: student
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب بيانات الطالب'
        });
    }
};

// 2. تحديث بيانات الطالب
exports.updateProfile = async (req, res) => {
    try {
        const allowedUpdates = ['phone', 'address', 'personal_email'];
        const updates = {};
        
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'لا توجد بيانات للتحديث'
            });
        }

        const updatedStudent = await Student.update(req.user.id, updates);
        
        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: 'فشل تحديث البيانات'
            });
        }

        res.json({
            success: true,
            message: 'تم تحديث البيانات بنجاح',
            data: updatedStudent
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في تحديث البيانات'
        });
    }
};

// 3. الحصول على المقررات المتاحة للتسجيل
exports.getAvailableCourses = async (req, res) => {
    try {
        const { semester, academic_year } = req.query;
        
        if (!semester || !academic_year) {
            return res.status(400).json({
                success: false,
                message: 'يجب تحديد الفصل الدراسي والسنة الأكاديمية'
            });
        }

        const availableCourses = await Student.getAvailableCourses(
            req.user.id, 
            semester, 
            academic_year
        );

        // التحقق من المتطلبات لكل مقرر
        const coursesWithPrerequisites = [];
        
        for (const course of availableCourses) {
            const prerequisiteCheck = await Student.checkPrerequisites(req.user.id, course.course_id);
            
            coursesWithPrerequisites.push({
                ...course,
                can_register: prerequisiteCheck.passed,
                missing_prerequisites: prerequisiteCheck.missing,
                prerequisite_check: prerequisiteCheck
            });
        }

        res.json({
            success: true,
            data: coursesWithPrerequisites,
            count: coursesWithPrerequisites.length,
            filters: { semester, academic_year }
        });

    } catch (error) {
        console.error('Get available courses error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب المقررات المتاحة'
        });
    }
};

// 4. تسجيل مقرر جديد
exports.registerCourse = async (req, res) => {
    try {
        const { course_id, semester, academic_year } = req.body;
        
        // التحقق من وجود المقرر
        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'المقرر غير موجود'
            });
        }

        // التحقق من أن المقرر نشط
        if (!course.is_active) {
            return res.status(400).json({
                success: false,
                message: 'المقرر غير متاح للتسجيل'
            });
        }

        // التحقق من أن المقرر ليس ممتلئاً
        if (course.current_students >= course.max_students) {
            return res.status(400).json({
                success: false,
                message: 'المقرر ممتلئ. لا يمكن التسجيل'
            });
        }

        // التحقق من المتطلبات السابقة
        const prerequisiteCheck = await Student.checkPrerequisites(req.user.id, course_id);
        if (!prerequisiteCheck.passed) {
            return res.status(400).json({
                success: false,
                message: 'متطلبات سابقة غير مكتملة',
                details: prerequisiteCheck
            });
        }

        // التحقق من عدم التسجيل المسبق
        const isDuplicate = await Registration.checkDuplicate(
            req.user.id, course_id, semester, academic_year
        );
        
        if (isDuplicate) {
            return res.status(400).json({
                success: false,
                message: 'مسجل بالفعل في هذا المقرر هذا الفصل'
            });
        }

        // التحقق من عدد الساعات المسجلة
        const totalHours = await Registration.getTotalHours(
            req.user.id, semester, academic_year
        );
        
        if (totalHours + course.credit_hours > 18) { // الحد الأقصى 18 ساعة
            return res.status(400).json({
                success: false,
                message: `تجاوز الحد الأقصى للساعات (${totalHours + course.credit_hours}/18)`
            });
        }

        // التحقق من التعارض في الجدول الدراسي
        const scheduleConflict = await Course.checkScheduleConflict(req.user.id, course_id);
        if (scheduleConflict.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'تعارض في الجدول الدراسي',
                conflicts: scheduleConflict
            });
        }

        // إتمام التسجيل
        const registration = await Registration.create({
            student_id: req.user.id,
            course_id,
            semester,
            academic_year,
            status: 'مسجل'
        });

        res.json({
            success: true,
            message: 'تم تسجيل المقرر بنجاح',
            data: registration
        });

    } catch (error) {
        console.error('Register course error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تسجيل المقرر',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// 5. الحصول على المقررات المسجلة حالياً
exports.getCurrentCourses = async (req, res) => {
    try {
        const { semester, academic_year } = req.query;
        
        if (!semester || !academic_year) {
            return res.status(400).json({
                success: false,
                message: 'يجب تحديد الفصل الدراسي والسنة الأكاديمية'
            });
        }

        const courses = await Registration.findByStudent(
            req.user.id, semester, academic_year
        );

        res.json({
            success: true,
            data: courses,
            count: courses.length,
            semester,
            academic_year
        });

    } catch (error) {
        console.error('Get current courses error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب المقررات المسجلة'
        });
    }
};

// 6. إلغاء تسجيل مقرر
exports.cancelRegistration = async (req, res) => {
    try {
        const { registration_id } = req.params;

        const result = await Registration.cancel(registration_id, req.user.id);

        res.json({
            success: true,
            message: result.message
        });

    } catch (error) {
        console.error('Cancel registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'حدث خطأ أثناء إلغاء التسجيل'
        });
    }
};

// 7. الحصول على السجل الأكاديمي
exports.getAcademicTranscript = async (req, res) => {
    try {
        const transcript = await Student.getAcademicTranscript(req.user.id);

        // حساب الإحصائيات
        let totalCredits = 0;
        let totalGradePoints = 0;
        let passedCourses = 0;

        transcript.forEach(course => {
            if (course.status === 'passed') {
                totalCredits += course.credit_hours;
                totalGradePoints += course.grade_points * course.credit_hours;
                passedCourses++;
            }
        });

        const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

        res.json({
            success: true,
            data: transcript,
            statistics: {
                total_courses: transcript.length,
                passed_courses: passedCourses,
                total_credits: totalCredits,
                gpa: parseFloat(gpa),
                total_grade_points: totalGradePoints.toFixed(2)
            }
        });

    } catch (error) {
        console.error('Get academic transcript error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب السجل الأكاديمي'
        });
    }
};

// 8. الحصول على التقدم الأكاديمي
exports.getAcademicProgress = async (req, res) => {
    try {
        const progress = await Student.getAcademicProgress(req.user.id);

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'لا توجد بيانات للتقدم الأكاديمي'
            });
        }

        // حساب النسبة المئوية للتقدم
        const progressPercentage = progress.total_required_courses > 0 
            ? ((progress.total_courses / progress.total_required_courses) * 100).toFixed(2)
            : 0;

        res.json({
            success: true,
            data: progress,
            progress: {
                percentage: parseFloat(progressPercentage),
                remaining_courses: Math.max(0, progress.total_required_courses - progress.total_courses),
                remaining_hours: Math.max(0, 160 - progress.total_hours) // 160 ساعة للتخرج
            }
        });

    } catch (error) {
        console.error('Get academic progress error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب التقدم الأكاديمي'
        });
    }
};

// 9. الحصول على الجدول الدراسي
exports.getSchedule = async (req, res) => {
    try {
        const { semester, academic_year } = req.query;
        
        if (!semester || !academic_year) {
            return res.status(400).json({
                success: false,
                message: 'يجب تحديد الفصل الدراسي والسنة الأكاديمية'
            });
        }

        const sql = `
            SELECT 
                s.day_of_week,
                s.start_time,
                s.end_time,
                s.classroom,
                c.course_code,
                c.course_name_ar,
                c.credit_hours,
                i.full_name_ar as instructor_name
            FROM schedules s
            JOIN courses c ON s.course_id = c.course_id
            JOIN registrations r ON c.course_id = r.course_id
            LEFT JOIN instructors i ON c.instructor_id = i.instructor_id
            WHERE r.student_id = ?
            AND r.semester = ?
            AND r.academic_year = ?
            AND r.status IN ('مسجل', 'معتمد')
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

        const schedule = await query(sql, [req.user.id, semester, academic_year]);

        // تجميع الجدول حسب الأيام
        const scheduleByDay = {};
        const daysOrder = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
        
        daysOrder.forEach(day => {
            scheduleByDay[day] = schedule.filter(item => item.day_of_week === day);
        });

        res.json({
            success: true,
            data: scheduleByDay,
            total_courses: schedule.length,
            semester,
            academic_year
        });

    } catch (error) {
        console.error('Get schedule error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب الجدول الدراسي'
        });
    }
};

// 10. الحصول على الإشعارات
exports.getNotifications = async (req, res) => {
    try {
        const sql = `
            SELECT 
                n.*,
                CASE 
                    WHEN n.priority = 'high' THEN 1
                    WHEN n.priority = 'medium' THEN 2
                    WHEN n.priority = 'low' THEN 3
                    ELSE 4
                END as priority_order
            FROM notifications n
            WHERE n.user_id = ?
            AND n.user_type = 'student'
            AND (n.expires_at IS NULL OR n.expires_at > NOW())
            ORDER BY n.created_at DESC
            LIMIT 50
        `;

        const notifications = await query(sql, [req.user.id]);

        // تحديث الإشعارات المقروءة
        if (req.query.mark_as_read === 'true') {
            await query(
                'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND user_type = ?',
                [req.user.id, 'student']
            );
        }

        res.json({
            success: true,
            data: notifications,
            unread_count: notifications.filter(n => !n.is_read).length
        });

    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب الإشعارات'
        });
    }
};

// 11. التحقق من إمكانية التسجيل في مقرر
exports.checkCourseEligibility = async (req, res) => {
    try {
        const { course_id } = req.params;
        
        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'المقرر غير موجود'
            });
        }

        // التحقق من المتطلبات
        const prerequisiteCheck = await Student.checkPrerequisites(req.user.id, course_id);
        
        // التحقق من الساعات
        const totalHours = await Registration.getTotalHours(
            req.user.id, course.semester, course.academic_year
        );
        
        const canRegisterHours = totalHours + course.credit_hours <= 18;
        
        // التحقق من التعارض في الجدول
        const scheduleConflict = await Course.checkScheduleConflict(req.user.id, course_id);
        
        // التحقق من التسجيل المسبق
        const isDuplicate = await Registration.checkDuplicate(
            req.user.id, course_id, course.semester, course.academic_year
        );

        res.json({
            success: true,
            data: {
                course: {
                    code: course.course_code,
                    name: course.course_name_ar,
                    credits: course.credit_hours,
                    semester: course.semester,
                    available_seats: course.max_students - course.current_students
                },
                eligibility: {
                    prerequisites: prerequisiteCheck,
                    hours: {
                        current: totalHours,
                        required: course.credit_hours,
                        total: totalHours + course.credit_hours,
                        max: 18,
                        can_register: canRegisterHours
                    },
                    schedule_conflict: scheduleConflict.length > 0,
                    conflicts: scheduleConflict,
                    duplicate_registration: isDuplicate,
                    can_register: prerequisiteCheck.passed && canRegisterHours && 
                                scheduleConflict.length === 0 && !isDuplicate
                }
            }
        });

    } catch (error) {
        console.error('Check course eligibility error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في التحقق من إمكانية التسجيل'
        });
    }
};

// 12. سحب مقرر
exports.withdrawCourse = async (req, res) => {
    try {
        const { registration_id } = req.params;
        const { reason } = req.body;

        const result = await Registration.withdraw(registration_id, req.user.id, reason);

        res.json({
            success: true,
            message: result.message
        });

    } catch (error) {
        console.error('Withdraw course error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'حدث خطأ أثناء سحب المقرر'
        });
    }
};