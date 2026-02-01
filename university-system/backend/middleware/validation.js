const { body, param, query, validationResult } = require('express-validator');

// قواعد تسجيل طالب جديد
const validateStudentRegistration = [
    body('national_id')
        .notEmpty().withMessage('الرقم القومي مطلوب')
        .isLength({ min: 14, max: 14 }).withMessage('الرقم القومي يجب أن يكون 14 رقم')
        .isNumeric().withMessage('الرقم القومي يجب أن يتكون من أرقام فقط'),

    body('full_name_ar')
        .notEmpty().withMessage('الاسم بالعربية مطلوب')
        .isLength({ min: 3, max: 100 }).withMessage('الاسم يجب أن يكون بين 3 و 100 حرف')
        .matches(/^[\u0600-\u06FF\s]+$/).withMessage('الاسم يجب أن يحتوي على أحرف عربية فقط'),

    body('full_name_en')
        .notEmpty().withMessage('الاسم بالإنجليزية مطلوب')
        .isLength({ min: 3, max: 100 }).withMessage('الاسم يجب أن يكون بين 3 و 100 حرف')
        .matches(/^[A-Za-z\s]+$/).withMessage('الاسم يجب أن يحتوي على أحرف إنجليزية فقط'),

    body('phone')
        .notEmpty().withMessage('رقم الهاتف مطلوب')
        .isLength({ min: 11, max: 11 }).withMessage('رقم الهاتف يجب أن يكون 11 رقم')
        .matches(/^01[0-9]{9}$/).withMessage('رقم الهاتف يجب أن يبدأ بـ 01 ويتبعه 9 أرقام'),

    body('birth_date')
        .notEmpty().withMessage('تاريخ الميلاد مطلوب')
        .isISO8601().withMessage('تاريخ الميلاد غير صالح')
        .custom(value => {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 16) throw new Error('يجب أن يكون عمر الطالب 16 سنة على الأقل');
            if (age > 25) throw new Error('يجب أن يكون عمر الطالب أقل من 25 سنة');
            return true;
        }),

    body('gender')
        .notEmpty().withMessage('النوع مطلوب')
        .isIn(['ذكر', 'أنثى']).withMessage('النوع يجب أن يكون ذكر أو أنثى'),

    body('address')
        .notEmpty().withMessage('العنوان مطلوب')
        .isLength({ min: 10, max: 500 }).withMessage('العنوان يجب أن يكون بين 10 و 500 حرف'),

    body('high_school_name')
        .notEmpty().withMessage('اسم المدرسة الثانوية مطلوب')
        .isLength({ min: 3, max: 150 }).withMessage('اسم المدرسة يجب أن يكون بين 3 و 150 حرف'),

    body('high_school_year')
        .notEmpty().withMessage('سنة التخرج مطلوبة')
        .isInt({ min: 2010, max: new Date().getFullYear() }).withMessage('سنة التخرج غير صالحة'),

    body('high_school_grade')
        .notEmpty().withMessage('النسبة المئوية مطلوبة')
        .isFloat({ min: 70, max: 100 }).withMessage('النسبة المئوية يجب أن تكون بين 70 و 100'),

    body('major')
        .notEmpty().withMessage('التخصص مطلوب')
        .isIn(['اتصالات', 'حاسبات']).withMessage('التخصص يجب أن يكون اتصالات أو حاسبات'),

    body('password')
        .notEmpty().withMessage('كلمة المرور مطلوبة')
        .isLength({ min: 8 }).withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، ورقم'),

    body('confirm_password')
        .notEmpty().withMessage('تأكيد كلمة المرور مطلوب')
        .custom((value, { req }) => {
            if (value !== req.body.password) throw new Error('كلمتا المرور غير متطابقتين');
            return true;
        })
];

// تسجيل الدخول
const validateLogin = [
    body('email').notEmpty().withMessage('البريد الإلكتروني مطلوب').isEmail().withMessage('البريد الإلكتروني غير صالح').normalizeEmail(),
    body('password').notEmpty().withMessage('كلمة المرور مطلوبة'),
    body('user_type').notEmpty().withMessage('نوع المستخدم مطلوب').isIn(['student', 'instructor', 'admin']).withMessage('نوع المستخدم غير صالح')
];

// تسجيل المقررات
const validateCourseRegistration = [
    body('course_id').notEmpty().withMessage('رقم المقرر مطلوب').isInt().withMessage('رقم المقرر يجب أن يكون رقم'),
    body('semester').notEmpty().withMessage('الفصل الدراسي مطلوب').isIn(['الأول', 'الثاني', 'الصيفي']).withMessage('الفصل الدراسي غير صالح'),
    body('academic_year').notEmpty().withMessage('السنة الأكاديمية مطلوبة').isInt({ min: 2020, max: 2030 }).withMessage('السنة الأكاديمية غير صالحة')
];

// تحديث بيانات الطالب
const validateStudentUpdate = [
    body('phone').optional().isLength({ min: 11, max: 11 }).withMessage('رقم الهاتف يجب أن يكون 11 رقم')
        .matches(/^01[0-9]{9}$/).withMessage('رقم الهاتف يجب أن يبدأ بـ 01 ويتبعه 9 أرقام'),
    body('address').optional().isLength({ min: 10, max: 500 }).withMessage('العنوان يجب أن يكون بين 10 و 500 حرف'),
    body('personal_email').optional().isEmail().withMessage('البريد الإلكتروني الشخصي غير صالح').normalizeEmail()
];

// معالجة الأخطاء
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => ({ field: err.path, message: err.msg, value: err.value }));
        return res.status(400).json({ success: false, message: 'أخطاء في التحقق من البيانات', errors: errorMessages });
    }
    next();
};

module.exports = {
    validateStudentRegistration,
    validateLogin,
    validateCourseRegistration,
    validateStudentUpdate,
    handleValidationErrors
};
