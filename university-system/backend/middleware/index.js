// backend/middleware/index.js
const authMiddleware = require('./auth');
const validationMiddleware = require('./validation');

// تصدير جميع middleware من ملف واحد
module.exports = {
    ...authMiddleware,
    ...validationMiddleware
};