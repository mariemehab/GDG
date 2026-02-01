// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

// إنشاء اتصال قاعدة البيانات
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 1. مصادقة المستخدم عن طريق JWT Token
const authenticate = async (req, res, next) => {
    try {
        // الحصول على التوكن من Header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'يجب تسجيل الدخول أولاً'
            });
        }

        // التحقق من التوكن
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // تحديد الجدول بناءً على نوع المستخدم
        let userTable, idField, statusField;
        switch (decoded.type) {
            case 'student':
                userTable = 'students';
                idField = 'student_id';
                statusField = 'account_status';
                break;
            case 'instructor':
                userTable = 'instructors';
                idField = 'employee_id';
                statusField = 'account_status';
                break;
            case 'admin':
                userTable = 'admins';
                idField = 'admin_id';
                statusField = 'account_status';
                break;
            default:
                return res.status(401).json({
                    success: false,
                    message: 'نوع مستخدم غير صالح'
                });
        }

        // البحث عن المستخدم في قاعدة البيانات
        const [users] = await pool.execute(
            `SELECT * FROM ${userTable} WHERE ${idField} = ?`,
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'المستخدم غير موجود'
            });
        }

        const user = users[0];

        // التحقق من حالة الحساب
        if (user[statusField] && user[statusField] !== 'مفعل') {
            return res.status(403).json({
                success: false,
                message: 'الحساب غير مفعل. يرجى تفعيل حسابك أولاً'
            });
        }

        // إضافة بيانات المستخدم إلى request object
        req.user = {
            id: user[idField],
            name: user.full_name_ar || user.full_name_en,
            email: user.email,
            type: decoded.type,
            major: user.major || null,
            academic_year: user.academic_year || null
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'توكن غير صالح'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'انتهت صلاحية التوكن. يرجى تسجيل الدخول مرة أخرى'
            });
        }

        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في المصادقة'
        });
    }
};

// 2. التحقق من صلاحية الطالب فقط
const studentOnly = (req, res, next) => {
    if (req.user.type !== 'student') {
        return res.status(403).json({
            success: false,
            message: 'مسموح للطلاب فقط'
        });
    }
    next();
};

// 3. التحقق من صلاحية المدرس فقط
const instructorOnly = (req, res, next) => {
    if (req.user.type !== 'instructor') {
        return res.status(403).json({
            success: false,
            message: 'مسموح للمدرسين فقط'
        });
    }
    next();
};

// 4. التحقق من صلاحية المدير فقط
const adminOnly = (req, res, next) => {
    if (req.user.type !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'مسموح للمدراء فقط'
        });
    }
    next();
};

// 5. التحقق من أن الطالب منتظم أكاديمياً
const checkAcademicStatus = async (req, res, next) => {
    try {
        if (req.user.type !== 'student') {
            return next();
        }

        const [students] = await pool.execute(
            'SELECT academic_status FROM students WHERE student_id = ?',
            [req.user.id]
        );

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'الطالب غير موجود'
            });
        }

        const student = students[0];

        // التحقق من الحالة الأكاديمية
        if (student.academic_status !== 'منتظم') {
            const blockedActions = ['تسجيل مقررات', 'سحب مقررات', 'طباعة كشف درجات'];
            
            return res.status(403).json({
                success: false,
                message: `الحالة الأكاديمية: ${student.academic_status}`,
                blockedActions,
                instructions: 'يرجى مراجعة شئون الطلاب'
            });
        }

        next();
    } catch (error) {
        console.error('Academic status check error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في التحقق من الحالة الأكاديمية'
        });
    }
};

// 6. التحقق من أن الطالب أكمل المتطلبات السابقة
const checkPrerequisites = async (req, res, next) => {
    try {
        const { course_id } = req.body;
        
        if (!course_id) {
            return res.status(400).json({
                success: false,
                message: 'يجب تحديد رقم المقرر'
            });
        }

        const [courses] = await pool.execute(
            'SELECT prerequisites FROM courses WHERE course_id = ?',
            [course_id]
        );

        if (courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المقرر غير موجود'
            });
        }

        const course = courses[0];
        
        // إذا لم يكن هناك متطلبات سابقة
        if (!course.prerequisites) {
            return next();
        }

        // تحليل المتطلبات (مفصولة بفواصل)
        const prereqCodes = course.prerequisites.split(',').map(code => code.trim());
        
        // التحقق من كل متطلب
        const missingPrerequisites = [];
        
        for (const prereqCode of prereqCodes) {
            // الحصول على ID المقرر المطلوب
            const [prereqCourses] = await pool.execute(
                'SELECT course_id FROM courses WHERE course_code = ?',
                [prereqCode]
            );
            
            if (prereqCourses.length === 0) continue;
            
            const prereqId = prereqCourses[0].course_id;
            
            // التحقق إذا كان الطالب نجح في المقرر
            const [grades] = await pool.execute(
                `SELECT g.*, c.course_code 
                 FROM grades g
                 JOIN courses c ON g.course_id = c.course_id
                 WHERE g.student_id = ? 
                 AND g.course_id = ? 
                 AND g.status = 'passed'`,
                [req.user.id, prereqId]
            );
            
            if (grades.length === 0) {
                missingPrerequisites.push(prereqCode);
            }
        }

        if (missingPrerequisites.length > 0) {
            return res.status(403).json({
                success: false,
                message: 'لا يمكن التسجيل، متطلبات سابقة غير مكتملة',
                missingPrerequisites,
                instructions: 'يجب إكمال المقررات التالية أولاً'
            });
        }

        next();
    } catch (error) {
        console.error('Prerequisites check error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في التحقق من المتطلبات'
        });
    }
};

// 7. التحقق من الحد الأقصى للساعات
const checkMaxHours = async (req, res, next) => {
    try {
        const { course_id, semester, academic_year } = req.body;
        
        // الحصول على عدد الساعات للمقرر
        const [courses] = await pool.execute(
            'SELECT credit_hours FROM courses WHERE course_id = ?',
            [course_id]
        );
        
        if (courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المقرر غير موجود'
            });
        }
        
        const courseHours = courses[0].credit_hours;
        
        // الحصول على الساعات المسجلة حالياً
        const [registeredHours] = await pool.execute(
            `SELECT SUM(c.credit_hours) as total_hours
             FROM registrations r
             JOIN courses c ON r.course_id = c.course_id
             WHERE r.student_id = ? 
             AND r.semester = ? 
             AND r.academic_year = ?
             AND r.status IN ('مسجل', 'معتمد')`,
            [req.user.id, semester, academic_year]
        );
        
        const currentHours = registeredHours[0].total_hours || 0;
        const maxHours = 18; // الحد الأقصى للساعات في الفصل
        
        if (currentHours + courseHours > maxHours) {
            return res.status(403).json({
                success: false,
                message: `تجاوز الحد الأقصى للساعات`,
                currentHours,
                requestedHours: courseHours,
                total: currentHours + courseHours,
                maxHours,
                instructions: `يمكنك تسجيل ${maxHours - currentHours} ساعة فقط`
            });
        }
        
        next();
    } catch (error) {
        console.error('Max hours check error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في التحقق من الساعات'
        });
    }
};

// 8. التحقق من فترة التسجيل المفتوحة
const checkRegistrationPeriod = async (req, res, next) => {
    try {
        const [settings] = await pool.execute(
            'SELECT setting_value FROM system_settings WHERE setting_key = "registration_open"'
        );
        
        if (settings.length === 0 || settings[0].setting_value !== 'true') {
            return res.status(403).json({
                success: false,
                message: 'فترة التسجيل مغلقة حالياً',
                instructions: 'يرجى الانتظار حتى فتح فترة التسجيل'
            });
        }
        
        next();
    } catch (error) {
        console.error('Registration period check error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في التحقق من فترة التسجيل'
        });
    }
};

// 9. التحقق من أن الطالب ليس مسجلاً بالفعل في المقرر
const checkDuplicateRegistration = async (req, res, next) => {
    try {
        const { course_id, semester, academic_year } = req.body;
        
        const [existing] = await pool.execute(
            `SELECT * FROM registrations 
             WHERE student_id = ? 
             AND course_id = ? 
             AND semester = ? 
             AND academic_year = ? 
             AND status IN ('مسجل', 'معتمد')`,
            [req.user.id, course_id, semester, academic_year]
        );
        
        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'مسجل بالفعل في هذا المقرر',
                registration: existing[0]
            });
        }
        
        next();
    } catch (error) {
        console.error('Duplicate registration check error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في التحقق من التسجيل المسبق'
        });
    }
};

module.exports = {
    authenticate,
    studentOnly,
    instructorOnly,
    adminOnly,
    checkAcademicStatus,
    checkPrerequisites,
    checkMaxHours,
    checkRegistrationPeriod,
    checkDuplicateRegistration
};