// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// تسجيل طالب جديد
router.post('/register/student', authController.registerStudent);

// تسجيل دخول
router.post('/login', authController.login);

// تفعيل الحساب
router.post('/verify-email', authController.verifyEmail);

// استعادة كلمة المرور
router.post('/forgot-password', authController.forgotPassword);

// إعادة تعيين كلمة المرور
router.post('/reset-password', authController.resetPassword);

// التحقق من الرقم القومي
router.post('/check-national-id', authController.checkNationalId);

// إنشاء بريد جامعي
router.post('/generate-email', authController.generateUniversityEmail);

// التحقق من حالة الحساب
router.post('/check-status', authController.checkAccountStatus);

module.exports = router;