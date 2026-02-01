// backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// ملف الطالب الشخصي
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);

// المقررات المتاحة
router.get('/courses/available', studentController.getAvailableCourses);

// تسجيل المقررات
router.post('/courses/register', studentController.registerCourse);

// المقررات المسجلة
router.get('/courses/current', studentController.getCurrentCourses);

// إلغاء تسجيل مقرر
router.delete('/courses/cancel/:registration_id', studentController.cancelRegistration);

// سحب مقرر
router.post('/courses/withdraw/:registration_id', studentController.withdrawCourse);

// السجل الأكاديمي
router.get('/transcript', studentController.getAcademicTranscript);

// التقدم الأكاديمي
router.get('/progress', studentController.getAcademicProgress);

// الجدول الدراسي
router.get('/schedule', studentController.getSchedule);

// الإشعارات
router.get('/notifications', studentController.getNotifications);

// التحقق من إمكانية التسجيل
router.get('/courses/check/:course_id', studentController.checkCourseEligibility);

module.exports = router;