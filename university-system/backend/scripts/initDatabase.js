const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    await connection.query(`
      CREATE DATABASE IF NOT EXISTS engineering_shubra
      DEFAULT CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci;
    `);

    console.log('✅ قاعدة البيانات engineering_shubra جاهزة');

    await connection.changeUser({ database: 'engineering_shubra' });

    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        student_id VARCHAR(20) PRIMARY KEY,
        full_name_ar VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS courses (
        course_id INT AUTO_INCREMENT PRIMARY KEY,
        course_name VARCHAR(100) NOT NULL
      );
    `);

    console.log('✅ الجداول اتعملت بنجاح');
    await connection.end();

  } catch (err) {
    console.error('❌ خطأ في تهيئة قاعدة البيانات:', err);
  }
}

initDatabase();
