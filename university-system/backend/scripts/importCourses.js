// backend/scripts/importCourses.js
const mysql = require('mysql2/promise');
const xlsx = require('xlsx');
const path = require('path'); // للتعامل مع المسارات
require('dotenv').config();

async function importCourses() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        // الباث الكامل للملف
        const filePath = path.resolve('C:/Users/ahdab/Downloads/courses.xlsx');
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const coursesData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log(`📚 جاري استيراد ${coursesData.length} مقرر...`);

        for (const course of coursesData) {
            // تحديد القسم بناءً على كود المقرر
            let department = 'عام';
            if (course.course_code.startsWith('ELE')) {
                department = 'اتصالات';
            } else if (course.course_code.startsWith('BAS')) {
                department = 'عام';
            } else if (course.course_code.startsWith('GEN')) {
                department = 'عام';
            }

            await connection.execute(
                `INSERT INTO courses 
                (course_code, course_name_ar, course_name_en, credit_hours, semester, academic_year, department, prerequisites)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    course_name_ar = VALUES(course_name_ar),
                    course_name_en = VALUES(course_name_en),
                    credit_hours = VALUES(credit_hours),
                    semester = VALUES(semester),
                    academic_year = VALUES(academic_year),
                    department = VALUES(department),
                    prerequisites = VALUES(prerequisites)`,
                [
                    course.course_code,
                    course.course_name, // الاسم العربي
                    course.course_name, // الاسم الإنجليزي
                    course.credits,
                    course.semester === 'First' ? 'الأول' : 
                     course.semester === 'Second' ? 'الثاني' : 'الصيفي',
                    2024,
                    department,
                    course.prereqs || null
                ]
            );
        }

        console.log('✅ تم استيراد جميع المقررات بنجاح!');

        // إضافة بعض المقررات الإضافية
        const additionalCourses = [
            // مقررات اتصالات
            ['ELE261', 'أنظمة الاتصالات الرقمية', 'Digital Communication Systems', 3, 'الأول', 2024, 'اتصالات', 'ELE243'],
            ['ELE262', 'معالجة الإشارات الرقمية', 'Digital Signal Processing', 3, 'الثاني', 2024, 'اتصالات', 'ELE244'],
            ['ELE263', 'شبكات الحاسوب', 'Computer Networks', 3, 'الأول', 2024, 'اتصالات', 'ELE252'],
            
            // مقررات حاسبات
            ['CSE201', 'هياكل البيانات', 'Data Structures', 3, 'الأول', 2024, 'حاسبات', 'ELE153'],
            ['CSE202', 'قواعد البيانات', 'Databases', 3, 'الثاني', 2024, 'حاسبات', 'CSE201'],
            ['CSE203', 'الذكاء الاصطناعي', 'Artificial Intelligence', 3, 'الأول', 2024, 'حاسبات', 'CSE201'],
            
            // مقررات عامة
            ['GEN101', 'مهارات التواصل', 'Communication Skills', 2, 'الأول', 2024, 'عام', null],
            ['GEN201', 'ريادة الأعمال', 'Entrepreneurship', 2, 'الثاني', 2024, 'عام', null]
        ];

        for (const course of additionalCourses) {
            await connection.execute(
                `INSERT INTO courses (course_code, course_name_ar, course_name_en, credit_hours, semester, academic_year, department, prerequisites)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                    course_name_ar = VALUES(course_name_ar),
                    course_name_en = VALUES(course_name_en),
                    credit_hours = VALUES(credit_hours),
                    semester = VALUES(semester),
                    academic_year = VALUES(academic_year),
                    department = VALUES(department),
                    prerequisites = VALUES(prerequisites)`,
                course
            );
        }

        console.log('✅ تم إضافة المقررات الإضافية!');

    } catch (error) {
        console.error('❌ خطأ في استيراد المقررات:', error);
    } finally {
        await connection.end();
    }
}

importCourses();
