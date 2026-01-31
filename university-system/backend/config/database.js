// backend/config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// إنشاء اتصال قاعدة البيانات
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'engineering_shubra',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// اختبار الاتصال
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
        console.log(`📊 قاعدة البيانات: ${process.env.DB_NAME}`);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ فشل الاتصال بقاعدة البيانات:', error.message);
        console.log('⚠️  تأكد من:');
        console.log('   1. أن MySQL يعمل');
        console.log('   2. إعدادات قاعدة البيانات في ملف .env');
        console.log('   3. اسم المستخدم وكلمة المرور صحيحة');
        return false;
    }
};

// دالة لتنفيذ الاستعلامات
const query = async (sql, params = []) => {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('خطأ في تنفيذ الاستعلام:', error.message);
        console.error('SQL:', sql);
        console.error('Params:', params);
        throw error;
    }
};

// دالة لتنفيذ الاستعلامات مع معالجة الأخطاء
const querySafe = async (sql, params = []) => {
    try {
        const [results] = await pool.execute(sql, params);
        return { success: true, results };
    } catch (error) {
        return { 
            success: false, 
            error: error.message,
            sql,
            params 
        };
    }
};

// دالة لبدء معاملة (Transaction)
const beginTransaction = async () => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    return connection;
};

// دالة للالتزام (Commit) بالمعاملة
const commitTransaction = async (connection) => {
    await connection.commit();
    connection.release();
};

// دالة للتراجع (Rollback) عن المعاملة
const rollbackTransaction = async (connection) => {
    await connection.rollback();
    connection.release();
};

module.exports = {
    pool,
    testConnection,
    query,
    querySafe,
    beginTransaction,
    commitTransaction,
    rollbackTransaction
};