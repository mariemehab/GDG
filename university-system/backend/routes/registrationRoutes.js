const express = require('express');
const router = express.Router();

const RegistrationController = require('../controllers/registrationController');
const { verifyToken, checkUserType } = require('../middleware/auth');
const { validateCourseRegistration, validateRegistrationId, validateQueryParams } = require('../middleware/validation');

// لازم يكون طالب
router.use(verifyToken, checkUserType('student'));

// ✅ تسجيل مقرر
router.post('/', validateCourseRegistration, RegistrationController.registerCourse);

// ✅ إلغاء تسجيل
router.delete('/:registration_id', validateRegistrationId, RegistrationController.cancelRegistration);

// ✅ التسجيلات الحالية
router.get('/current', validateQueryParams, RegistrationController.getCurrentRegistrations);

// ✅ تاريخ التسجيلات
router.get('/history', RegistrationController.getRegistrationHistory);

// ✅ فحص الأهلية قبل التسجيل
router.post('/eligibility', validateCourseRegistration, RegistrationController.checkEligibility);

module.exports = router;