-- database/sample-data.sql
-- بيانات تجريبية لنظام كلية الهندسة بشبرا

USE engineering_shubra;

-- ===== بيانات المدرسين =====

-- إدخال مدرسين (كلمة المرور: Test123)
INSERT INTO instructors (employee_id, full_name_ar, full_name_en, email, password, phone, department, rank) VALUES
('INS001', 'د. أحمد محمود', 'Dr. Ahmed Mahmoud', 'ahmed.mahmoud@eng.shubra.edu.eg', '$2a$10$TestHashedPassword1', '01001234567', 'اتصالات', 'أستاذ'),
('INS002', 'د. مريم علي', 'Dr. Mariam Ali', 'mariam.ali@eng.shubra.edu.eg', '$2a$10$TestHashedPassword2', '01007654321', 'حاسبات', 'أستاذ مساعد'),
('INS003', 'د. خالد حسن', 'Dr. Khaled Hassan', 'khaled.hassan@eng.shubra.edu.eg', '$2a$10$TestHashedPassword3', '01001112233', 'اتصالات', 'مدرس'),
('INS004', 'د. سارة عبد الله', 'Dr. Sara Abdullah', 'sara.abdullah@eng.shubra.edu.eg', '$2a$10$TestHashedPassword4', '01002223344', 'حاسبات', 'مدرس مساعد'),
('INS005', 'د. محمد صبري', 'Dr. Mohamed Sabry', 'mohamed.sabry@eng.shubra.edu.eg', '$2a$10$TestHashedPassword5', '01003334455', 'عام', 'أستاذ');

-- ===== بيانات المقررات =====

-- مقررات اتصالات (الفصل الأول)
INSERT INTO courses (course_code, course_name_ar, course_name_en, credit_hours, semester, academic_year, department, prerequisites, instructor_id) VALUES
('ELE101', 'مقدمة في الهندسة الكهربائية', 'Introduction to Electrical Engineering', 3, 'الأول', 2024, 'اتصالات', NULL, 1),
('ELE102', 'دوائر كهربائية (1)', 'Electrical Circuits (1)', 3, 'الأول', 2024, 'اتصالات', NULL, 1),
('ELE103', 'إلكترونيات (1)', 'Electronics (1)', 3, 'الأول', 2024, 'اتصالات', NULL, 3),
('BAS101', 'رياضيات (1)', 'Mathematics (1)', 3, 'الأول', 2024, 'عام', NULL, 5),
('BAS102', 'فيزياء (1)', 'Physics (1)', 3, 'الأول', 2024, 'عام', NULL, 5),
('GEN101', 'مهارات التواصل', 'Communication Skills', 2, 'الأول', 2024, 'عام', NULL, 5);

-- مقررات اتصالات (الفصل الثاني)
INSERT INTO courses (course_code, course_name_ar, course_name_en, credit_hours, semester, academic_year, department, prerequisites, instructor_id) VALUES
('ELE201', 'دوائر كهربائية (2)', 'Electrical Circuits (2)', 3, 'الثاني', 2024, 'اتصالات', 'ELE102', 1),
('ELE202', 'إلكترونيات (2)', 'Electronics (2)', 3, 'الثاني', 2024, 'اتصالات', 'ELE103', 3),
('ELE203', 'كهرومغناطيسية', 'Electromagnetics', 3, 'الثاني', 2024, 'اتصالات', 'BAS102', 1),
('BAS201', 'رياضيات (2)', 'Mathematics (2)', 3, 'الثاني', 2024, 'عام', 'BAS101', 5),
('BAS202', 'فيزياء (2)', 'Physics (2)', 3, 'الثاني', 2024, 'عام', 'BAS102', 5),
('GEN201', 'ريادة الأعمال', 'Entrepreneurship', 2, 'الثاني', 2024, 'عام', NULL, 5);

-- مقررات حاسبات (الفصل الأول)
INSERT INTO courses (course_code, course_name_ar, course_name_en, credit_hours, semester, academic_year, department, prerequisites, instructor_id) VALUES
('CSE101', 'مقدمة في الحاسبات', 'Introduction to Computing', 3, 'الأول', 2024, 'حاسبات', NULL, 2),
('CSE102', 'برمجة (1)', 'Programming (1)', 3, 'الأول', 2024, 'حاسبات', NULL, 2),
('CSE103', 'هندسة البرمجيات', 'Software Engineering', 3, 'الأول', 2024, 'حاسبات', NULL, 4),
('BAS111', 'رياضيات متقطعة', 'Discrete Mathematics', 3, 'الأول', 2024, 'عام', NULL, 5),
('GEN111', 'مهارات تقنية', 'Technical Skills', 2, 'الأول', 2024, 'عام', NULL, 5);

-- مقررات حاسبات (الفصل الثاني)
INSERT INTO courses (course_code, course_name_ar, course_name_en, credit_hours, semester, academic_year, department, prerequisites, instructor_id) VALUES
('CSE201', 'هياكل البيانات', 'Data Structures', 3, 'الثاني', 2024, 'حاسبات', 'CSE102', 2),
('CSE202', 'خوارزميات', 'Algorithms', 3, 'الثاني', 2024, 'حاسبات', 'CSE201,BAS111', 4),
('CSE203', 'قواعد البيانات', 'Databases', 3, 'الثاني', 2024, 'حاسبات', 'CSE102', 4),
('CSE204', 'شبكات الحاسوب', 'Computer Networks', 3, 'الثاني', 2024, 'حاسبات', 'CSE101', 2),
('BAS211', 'إحصاء وهندسة', 'Statistics and Engineering', 3, 'الثاني', 2024, 'عام', 'BAS101', 5);

-- مقررات متقدمة
INSERT INTO courses (course_code, course_name_ar, course_name_en, credit_hours, semester, academic_year, department, prerequisites, instructor_id) VALUES
('ELE301', 'أنظمة اتصالات', 'Communication Systems', 3, 'الأول', 2024, 'اتصالات', 'ELE201,ELE202', 1),
('ELE302', 'معالجة الإشارات الرقمية', 'Digital Signal Processing', 3, 'الأول', 2024, 'اتصالات', 'ELE203', 3),
('CSE301', 'الذكاء الاصطناعي', 'Artificial Intelligence', 3, 'الأول', 2024, 'حاسبات', 'CSE202,BAS211', 4),
('CSE302', 'تعلم الآلة', 'Machine Learning', 3, 'الأول', 2024, 'حاسبات', 'CSE301', 2),
('ELE401', 'اتصالات لاسلكية', 'Wireless Communications', 3, 'الثاني', 2024, 'اتصالات', 'ELE301', 1),
('CSE401', 'أمن الحاسوب', 'Computer Security', 3, 'الثاني', 2024, 'حاسبات', 'CSE204', 4);

-- ===== بيانات الجداول الدراسية =====

-- جداول مقررات اتصالات
INSERT INTO schedules (course_id, day_of_week, start_time, end_time, classroom, instructor_id) VALUES
(1, 'السبت', '09:00:00', '10:30:00', 'قاعة 101', 1),
(1, 'الإثنين', '11:00:00', '12:30:00', 'معمل 201', 1),
(2, 'الأحد', '09:00:00', '10:30:00', 'قاعة 102', 1),
(2, 'الثلاثاء', '11:00:00', '12:30:00', 'معمل 202', 1),
(3, 'السبت', '11:00:00', '12:30:00', 'قاعة 103', 3),
(3, 'الأربعاء', '09:00:00', '10:30:00', 'معمل 203', 3);

-- جداول مقررات حاسبات
INSERT INTO schedules (course_id, day_of_week, start_time, end_time, classroom, instructor_id) VALUES
(7, 'السبت', '13:00:00', '14:30:00', 'قاعة 104', 2),
(7, 'الإثنين', '15:00:00', '16:30:00', 'معمل 301', 2),
(8, 'الأحد', '13:00:00', '14:30:00', 'قاعة 105', 4),
(8, 'الثلاثاء', '15:00:00', '16:30:00', 'معمل 302', 4),
(9, 'الأربعاء', '13:00:00', '14:30:00', 'قاعة 106', 4),
(9, 'الخميس', '09:00:00', '10:30:00', 'معمل 303', 4);

-- جداول مقررات عامة
INSERT INTO schedules (course_id, day_of_week, start_time, end_time, classroom, instructor_id) VALUES
(4, 'السبت', '15:00:00', '16:30:00', 'قاعة 201', 5),
(4, 'الثلاثاء', '09:00:00', '10:30:00', 'قاعة 201', 5),
(5, 'الأحد', '15:00:00', '16:30:00', 'قاعة 202', 5),
(5, 'الأربعاء', '11:00:00', '12:30:00', 'قاعة 202', 5),
(6, 'الخميس', '11:00:00', '12:30:00', 'قاعة 203', 5);

-- ===== بيانات إشعارات =====

INSERT INTO notifications (user_id, user_type, title, message, type, priority) VALUES
('all', 'student', 'مرحباً بكم في الفصل الدراسي الجديد', 'يسرنا أن نرحب بكم في الفصل الدراسي الأول 2024. نتمنى لكم عاماً دراسياً موفقاً.', 'info', 'medium'),
('all', 'student', 'فترة التسجيل مفتوحة', 'فترة تسجيل المقررات للفصل الأول 2024 مفتوحة حتى 15 سبتمبر.', 'success', 'high'),
('all', 'student', 'ورش عمل مجانية', 'تعلن الكلية عن سلسلة ورش عمل مجانية في مهارات البرمجة.', 'info', 'medium');

-- ===== رسالة النجاح =====
SELECT '✅ تم إدخال البيانات التجريبية بنجاح' as message;
SELECT '📊 عدد المدرسين: ' || COUNT(*) as message FROM instructors;
SELECT '📚 عدد المقررات: ' || COUNT(*) as message FROM courses;
SELECT '📅 عدد الجداول الدراسية: ' || COUNT(*) as message FROM schedules;