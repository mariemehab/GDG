// backend/routes/instructorRoutes.js
const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const {
    authenticate,
    instructorOnly,
    handleValidationErrors
} = require('../middleware');
const {
    validateGradeSubmission,
    validateCourseId
} = require('../middleware/validation');

// جميع المسارات تتطلب مصادقة وكون المستخدم مدرس
router.use(authenticate, instructorOnly);

// ملف المدرس الشخصي
router.get('/profile', instructorController.getProfile);
router.put('/profile', instructorController.updateProfile);

// المقررات التي يدرسها المدرس
router.get('/courses', instructorController.getMyCourses);

// الجدول الدراسي للمدرس
router.get('/schedule', instructorController.getSchedule);

// طلاب مقرر معين
router.get('/courses/:course_id/students',
    validateCourseId,
    handleValidationErrors,
    instructorController.getCourseStudents
);

// إضافة درجات
router.post('/grades',
    validateGradeSubmission,
    handleValidationErrors,
    instructorController.addGrade
);

// تحديث درجة
router.put('/grades/:grade_id', instructorController.updateGrade);

// الحصول على تقرير المقرر
router.get('/courses/:course_id/report',
    validateCourseId,
    handleValidationErrors,
    instructorController.getCourseReport
);

// إضافة حضور
router.post('/attendance', instructorController.markAttendance);

// إضافة ملاحظة
router.post('/notes', instructorController.addStudentNote);

module.exports = router;