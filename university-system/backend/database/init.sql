-- database/init.sql
-- تهيئة قاعدة البيانات لنظام كلية الهندسة بشبرا

-- إنشاء قاعدة البيانات
DROP DATABASE IF EXISTS engineering_shubra;
CREATE DATABASE engineering_shubra;
USE engineering_shubra;

-- ===== الجداول الأساسية =====

-- جدول الطلاب
CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY,
    national_id VARCHAR(14) UNIQUE NOT NULL,
    full_name_ar VARCHAR(100) NOT NULL,
    full_name_en VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    birth_date DATE NOT NULL,
    gender ENUM('ذكر', 'أنثى') NOT NULL,
    address TEXT NOT NULL,
    high_school_name VARCHAR(150) NOT NULL,
    high_school_year YEAR NOT NULL,
    high_school_grade DECIMAL(5,2) NOT NULL,
    major ENUM('اتصالات', 'حاسبات') NOT NULL,
    academic_year YEAR NOT NULL,
    semester ENUM('الأول', 'الثاني', 'الصيفي') NOT NULL,
    total_hours INT DEFAULT 0,
    completed_hours INT DEFAULT 0,
    gpa DECIMAL(3,2) DEFAULT 0.00,
    academic_status ENUM('منتظم', 'مستمر', 'محذر', 'مفصول') DEFAULT 'منتظم',
    account_status ENUM('مفعل', 'غير مفعل', 'موقوف') DEFAULT 'غير مفعل',
    personal_email VARCHAR(100),
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(100),
    verification_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_student_email (email),
    INDEX idx_student_national_id (national_id),
    INDEX idx_student_major (major),
    INDEX idx_student_year (academic_year)
);

-- جدول المدرسين
CREATE TABLE instructors (
    instructor_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    full_name_ar VARCHAR(100) NOT NULL,
    full_name_en VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    department ENUM('اتصالات', 'حاسبات', 'عام') NOT NULL,
    rank ENUM('أستاذ', 'أستاذ مساعد', 'مدرس', 'مدرس مساعد') NOT NULL,
    account_status ENUM('مفعل', 'غير مفعل', 'موقوف') DEFAULT 'مفعل',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_instructor_email (email),
    INDEX idx_instructor_department (department)
);

-- جدول المقررات
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(10) UNIQUE NOT NULL,
    course_name_ar VARCHAR(100) NOT NULL,
    course_name_en VARCHAR(100) NOT NULL,
    credit_hours INT NOT NULL,
    semester ENUM('الأول', 'الثاني', 'الصيفي') NOT NULL,
    academic_year INT NOT NULL,
    department ENUM('اتصالات', 'حاسبات', 'عام') NOT NULL,
    prerequisites TEXT,
    max_students INT DEFAULT 40,
    current_students INT DEFAULT 0,
    instructor_id INT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id),
    INDEX idx_course_code (course_code),
    INDEX idx_course_semester (semester, academic_year),
    INDEX idx_course_department (department),
    INDEX idx_course_instructor (instructor_id)
);

-- جدول التسجيلات
CREATE TABLE registrations (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20),
    course_id INT,
    semester ENUM('الأول', 'الثاني', 'الصيفي') NOT NULL,
    academic_year YEAR NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('مسجل', 'معتمد', 'ملغي', 'سحب') DEFAULT 'مسجل',
    grade VARCHAR(2),
    grade_points DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (student_id, course_id, semester, academic_year),
    INDEX idx_registration_student (student_id),
    INDEX idx_registration_course (course_id),
    INDEX idx_registration_semester (semester, academic_year)
);

-- جدول الدرجات
CREATE TABLE grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registration_id INT NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    course_id INT NOT NULL,
    semester ENUM('الأول', 'الثاني', 'الصيفي') NOT NULL,
    academic_year YEAR NOT NULL,
    grade_letter VARCHAR(2) NOT NULL,
    grade_points DECIMAL(3,2) NOT NULL,
    status ENUM('passed', 'failed', 'in_progress') DEFAULT 'in_progress',
    added_by VARCHAR(50),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_course_grade (student_id, course_id, semester, academic_year),
    INDEX idx_grade_student (student_id),
    INDEX idx_grade_course (course_id),
    INDEX idx_grade_semester (semester, academic_year)
);

-- جدول الجدول الدراسي
CREATE TABLE schedules (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    day_of_week ENUM('السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    classroom VARCHAR(50),
    instructor_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id),
    INDEX idx_schedule_course (course_id),
    INDEX idx_schedule_day (day_of_week),
    INDEX idx_schedule_instructor (instructor_id)
);

-- ===== الجداول الإضافية =====

-- جدول الإداريين
CREATE TABLE admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    full_name_ar VARCHAR(100) NOT NULL,
    full_name_en VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    role ENUM('super_admin', 'academic_admin', 'financial_admin', 'student_affairs') NOT NULL,
    account_status ENUM('مفعل', 'غير مفعل', 'موقوف') DEFAULT 'مفعل',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول إعادة تعيين كلمات المرور
CREATE TABLE password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    user_type ENUM('student', 'instructor', 'admin') NOT NULL,
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reset_token_hash (token_hash),
    INDEX idx_reset_token_user (user_id, user_type)
);

-- جدول الإشعارات
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    user_type ENUM('student', 'instructor', 'admin') NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notification_user (user_id, user_type),
    INDEX idx_notification_read (is_read)
);

-- جدول سجل التسجيلات
CREATE TABLE registration_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL,
    course_id INT NOT NULL,
    semester ENUM('الأول', 'الثاني', 'الصيفي') NOT NULL,
    academic_year YEAR NOT NULL,
    registration_type ENUM('initial', 'add', 'drop', 'withdraw', 'cancel', 'status_change') NOT NULL,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action_by VARCHAR(100),
    status_before VARCHAR(50),
    status_after VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    INDEX idx_history_student (student_id),
    INDEX idx_history_date (action_date)
);

-- جدول الحضور
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL,
    course_id INT NOT NULL,
    semester ENUM('الأول', 'الثاني', 'الصيفي') NOT NULL,
    academic_year YEAR NOT NULL,
    date DATE NOT NULL,
    status ENUM('حاضر', 'غائب', 'معتذر') DEFAULT 'غائب',
    notes TEXT,
    marked_by VARCHAR(50),
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE KEY unique_attendance (student_id, course_id, date),
    INDEX idx_attendance_student (student_id, course_id),
    INDEX idx_attendance_date (date)
);

-- جدول الملاحظات على الطلاب
CREATE TABLE student_notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL,
    course_id INT,
    instructor_id INT,
    note TEXT NOT NULL,
    type ENUM('academic', 'behavioral', 'other') DEFAULT 'academic',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id),
    INDEX idx_notes_student (student_id),
    INDEX idx_notes_instructor (instructor_id)
);

-- جدول إعدادات النظام
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT,
    description VARCHAR(200),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===== إدخال البيانات الأساسية =====

-- إدخال الإعدادات
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('university_name', 'كلية الهندسة بشبرا - جامعة عين شمس', 'اسم الجامعة'),
('college_name', 'كلية الهندسة بشبرا', 'اسم الكلية'),
('max_hours_per_semester', '18', 'الحد الأقصى للساعات في الفصل'),
('min_gpa_for_graduation', '2.0', 'أقل معدل تراكمي للتخرج'),
('registration_period_days', '14', 'فترة التسجيل بالأيام'),
('withdrawal_deadline_days', '21', 'آخر موعد للسحب'),
('current_semester', 'الأول', 'الفصل الدراسي الحالي'),
('current_academic_year', YEAR(CURDATE()), 'السنة الأكاديمية الحالية'),
('registration_open', 'true', 'حالة فتح باب التسجيل'),
('email_verification_required', 'true', 'تفعيل البريد الإلكتروني مطلوب');

-- إدخال مدير افتراضي (كلمة المرور: Admin123)
INSERT INTO admins (employee_id, full_name_ar, full_name_en, email, password, phone, role) VALUES
('ADM001', 'مدير النظام', 'System Administrator', 'admin@eng.shubra.edu.eg', '$2a$10$YourHashedPasswordHere', '01000000000', 'super_admin');

-- ===== الإجراءات المخزنة =====

-- إجراء لتحديث المعدل التراكمي للطالب
DELIMITER //
CREATE PROCEDURE UpdateStudentGPA(IN student_id_param VARCHAR(20))
BEGIN
    DECLARE total_points DECIMAL(10,2);
    DECLARE total_credits INT;
    DECLARE new_gpa DECIMAL(3,2);
    
    -- حساب مجموع النقاط والساعات
    SELECT 
        SUM(g.grade_points * c.credit_hours),
        SUM(c.credit_hours)
    INTO total_points, total_credits
    FROM grades g
    JOIN courses c ON g.course_id = c.course_id
    WHERE g.student_id = student_id_param 
    AND g.status = 'passed';
    
    -- حساب المعدل التراكمي
    IF total_credits > 0 THEN
        SET new_gpa = total_points / total_credits;
    ELSE
        SET new_gpa = 0.00;
    END IF;
    
    -- تحديث المعدل التراكمي للطالب
    UPDATE students 
    SET gpa = ROUND(new_gpa, 2),
        completed_hours = total_credits
    WHERE student_id = student_id_param;
    
    -- تحديث الحالة الأكاديمي
    UPDATE students 
    SET academic_status = CASE 
        WHEN new_gpa >= 2.0 THEN 'منتظم'
        WHEN new_gpa >= 1.5 THEN 'مستمر'
        WHEN new_gpa >= 1.0 THEN 'محذر'
        ELSE 'مفصول'
    END
    WHERE student_id = student_id_param;
END//
DELIMITER ;

-- ===== المشغلات (Triggers) =====

-- مشغل لتحديث عدد الطلاب في المقرر عند التسجيل
DELIMITER //
CREATE TRIGGER AfterRegistrationInsert
AFTER INSERT ON registrations
FOR EACH ROW
BEGIN
    IF NEW.status IN ('مسجل', 'معتمد') THEN
        UPDATE courses 
        SET current_students = current_students + 1 
        WHERE course_id = NEW.course_id;
    END IF;
END//
DELIMITER ;

-- مشغل لتحديث عدد الطلاب في المقرر عند إلغاء التسجيل
DELIMITER //
CREATE TRIGGER AfterRegistrationUpdate
AFTER UPDATE ON registrations
FOR EACH ROW
BEGIN
    -- إذا تغيرت الحالة من نشطة إلى غير نشطة
    IF (OLD.status IN ('مسجل', 'معتمد') AND NEW.status IN ('ملغي', 'سحب')) THEN
        UPDATE courses 
        SET current_students = GREATEST(0, current_students - 1) 
        WHERE course_id = NEW.course_id;
    
    -- إذا تغيرت الحالة من غير نشطة إلى نشطة
    ELSEIF (OLD.status IN ('ملغي', 'سحب') AND NEW.status IN ('مسجل', 'معتمد')) THEN
        UPDATE courses 
        SET current_students = current_students + 1 
        WHERE course_id = NEW.course_id;
    END IF;
END//
DELIMITER ;

-- مشغل لتسجيل تاريخ التسجيل
DELIMITER //
CREATE TRIGGER BeforeRegistrationInsert
BEFORE INSERT ON registrations
FOR EACH ROW
BEGIN
    -- تعيين تاريخ التسجيل إذا لم يكن محدداً
    IF NEW.registration_date IS NULL THEN
        SET NEW.registration_date = NOW();
    END IF;
END//
DELIMITER ;

-- ===== الفهارس الإضافية =====

-- إضافة فهارس لتحسين الأداء
CREATE INDEX idx_student_academic_status ON students(academic_status);
CREATE INDEX idx_course_active ON courses(is_active);
CREATE INDEX idx_registration_status ON registrations(status);
CREATE INDEX idx_grade_status ON grades(status);

-- ===== رسالة النجاح =====
SELECT '✅ تم إنشاء قاعدة البيانات والجداول بنجاح' as message;