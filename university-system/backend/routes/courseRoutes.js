// backend/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// مسارات عامة
router.get('/', courseController.getAllCourses);
router.get('/semester', courseController.getCoursesBySemester);
router.get('/major', courseController.getCoursesByMajor);
router.get('/search', courseController.searchCourses);
router.get('/stats', courseController.getCourseStats);

// الحصول على مقرر معين
router.get('/:course_id', courseController.getCourseById);

module.exports = router;