// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تحقق من استيراد الـ routes
try {
    const authRoutes = require('./routes/authRoutes');
    console.log('✅ تم تحميل authRoutes بنجاح');
    
    const studentRoutes = require('./routes/studentRoutes');
    console.log('✅ تم تحميل studentRoutes بنجاح');
    
    const courseRoutes = require('./routes/courseRoutes');
    console.log('✅ تم تحميل courseRoutes بنجاح');
    
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/students', studentRoutes);
    app.use('/api/courses', courseRoutes);
    
} catch (error) {
    console.error('❌ خطأ في تحميل الـ routes:', error.message);
    console.error('Stack trace:', error.stack);
}

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: '✅ النظام يعمل',
        timestamp: new Date().toLocaleString('ar-EG'),
        college: 'كلية الهندسة بشبرا - اتصالات وحاسبات'
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'حدث خطأ في الخادم',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`);
    console.log(`🏫 كلية الهندسة بشبرا - نظام الإدارة الأكاديمية`);
});