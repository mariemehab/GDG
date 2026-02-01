// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Student = require('../models/Student');
const Instructor = require('../models/Instructor');
const { query } = require('../config/database');

// إنشاء موصل البريد الإلكتروني
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// 1. تسجيل طالب جديد
exports.registerStudent = async (req, res) => {
    try {
        const {
            national_id, full_name_ar, full_name_en,
            phone, birth_date, gender, address,
            high_school_name, high_school_year, high_school_grade,
            major, password
        } = req.body;

        // التحقق من عدم التسجيل المسبق
        const existingByNationalId = await Student.findByNationalId(national_id);
        const existingByPhone = await query(
            'SELECT * FROM students WHERE phone = ?',
            [phone]
        );

        if (existingByNationalId) {
            return res.status(400).json({
                success: false,
                message: 'الرقم القومي مسجل بالفعل'
            });
        }

        if (existingByPhone.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'رقم الهاتف مسجل بالفعل'
            });
        }

        // توليد رقم جامعي
        const currentYear = new Date().getFullYear();
        const [lastStudent] = await query(
            'SELECT student_id FROM students WHERE student_id LIKE ? ORDER BY student_id DESC LIMIT 1',
            [`${currentYear}%`]
        );

        let studentNumber = 1;
        if (lastStudent.length > 0) {
            studentNumber = parseInt(lastStudent[0].student_id.slice(-4)) + 1;
        }

        const studentId = `${currentYear}${studentNumber.toString().padStart(4, '0')}`;

        // إنشاء بريد جامعي
        const names = full_name_en.toLowerCase().split(' ');
        const firstName = names[0].replace(/[^a-z]/g, '');
        const lastName = names[names.length - 1].replace(/[^a-z]/g, '');
        
        let universityEmail = `${firstName}.${lastName}${currentYear}@eng.shubra.edu.eg`;
        
        // التحقق من عدم تكرار البريد
        let counter = 1;
        let existingEmail = await Student.findByEmail(universityEmail);
        while (existingEmail) {
            universityEmail = `${firstName}.${lastName}${currentYear}${counter}@eng.shubra.edu.eg`;
            existingEmail = await Student.findByEmail(universityEmail);
            counter++;
        }

        // تشفير كلمة المرور
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // إدخال الطالب في قاعدة البيانات
        await Student.create({
            student_id: studentId,
            national_id,
            full_name_ar,
            full_name_en,
            email: universityEmail,
            password: hashedPassword,
            phone,
            birth_date,
            gender,
            address,
            high_school_name,
            high_school_year,
            high_school_grade,
            major,
            academic_year: currentYear,
            semester: 'الأول',
            account_status: 'غير مفعل'
        });

        // إنشاء توكن التفعيل
        const verificationToken = jwt.sign(
            { studentId, email: universityEmail, type: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // إرسال بريد التفعيل
        await sendVerificationEmail(universityEmail, studentId, verificationToken);

        res.status(201).json({
            success: true,
            message: 'تم تسجيل الطالب بنجاح',
            data: {
                student_id: studentId,
                email: universityEmail,
                verification_sent: true,
                instructions: 'يرجى تفعيل الحساب عبر الرابط المرسل إلى بريدك الجامعي'
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء التسجيل',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// 2. تسجيل الدخول
exports.login = async (req, res) => {
    try {
        const { email, password, user_type } = req.body;

        let user, tableName, idField, nameField;

        switch (user_type) {
            case 'student':
                user = await Student.findByEmail(email);
                tableName = 'students';
                idField = 'student_id';
                nameField = 'full_name_ar';
                break;
                
            case 'instructor':
                user = await Instructor.findByEmail(email);
                tableName = 'instructors';
                idField = 'employee_id';
                nameField = 'full_name_ar';
                break;
                
            case 'admin':
                const [admins] = await query(
                    'SELECT * FROM admins WHERE email = ?',
                    [email]
                );
                user = admins[0] || null;
                tableName = 'admins';
                idField = 'admin_id';
                nameField = 'full_name_ar';
                break;
                
            default:
                return res.status(400).json({
                    success: false,
                    message: 'نوع المستخدم غير صالح'
                });
        }

        // التحقق من وجود المستخدم
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            });
        }

        // التحقق من كلمة المرور
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            });
        }

        // التحقق من حالة الحساب
        if (user.account_status && user.account_status !== 'مفعل') {
            return res.status(403).json({
                success: false,
                message: 'الحساب غير مفعل. يرجى تفعيل الحساب أولاً'
            });
        }

        // إنشاء توكن JWT
        const token = jwt.sign(
            {
                id: user[idField],
                name: user[nameField],
                email: user.email,
                type: user_type
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        // إزالة كلمة المرور من البيانات المرجعة
        delete user.password;

        res.json({
            success: true,
            token,
            user: {
                id: user[idField],
                name: user[nameField],
                email: user.email,
                type: user_type,
                major: user.major || null,
                department: user.department || null
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تسجيل الدخول'
        });
    }
};

// 3. تفعيل الحساب
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'توكن التفعيل مطلوب'
            });
        }

        // التحقق من التوكن
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== 'student') {
            return res.status(400).json({
                success: false,
                message: 'توكن غير صالح'
            });
        }

        // تفعيل حساب الطالب
        await Student.activateAccount(decoded.studentId);

        res.json({
            success: true,
            message: 'تم تفعيل حسابك بنجاح',
            data: {
                student_id: decoded.studentId,
                email: decoded.email
            }
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({
                success: false,
                message: 'توكن التفعيل غير صالح'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({
                success: false,
                message: 'انتهت صلاحية رابط التفعيل. يرجى طلب رابط جديد'
            });
        }

        console.error('Verification error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تفعيل الحساب'
        });
    }
};

// 4. استعادة كلمة المرور
exports.forgotPassword = async (req, res) => {
    try {
        const { email, user_type } = req.body;

        let user, idField, nameField;

        switch (user_type) {
            case 'student':
                user = await Student.findByEmail(email);
                idField = 'student_id';
                nameField = 'full_name_ar';
                break;
                
            case 'instructor':
                user = await Instructor.findByEmail(email);
                idField = 'employee_id';
                nameField = 'full_name_ar';
                break;
                
            case 'admin':
                const [admins] = await query(
                    'SELECT * FROM admins WHERE email = ?',
                    [email]
                );
                user = admins[0] || null;
                idField = 'admin_id';
                nameField = 'full_name_ar';
                break;
                
            default:
                return res.status(400).json({
                    success: false,
                    message: 'نوع المستخدم غير صالح'
                });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني'
            });
        }

        // إنشاء توكن استعادة كلمة المرور
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // حساب وقت انتهاء الصلاحية (ساعة واحدة)
        const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

        // حفظ التوكن في قاعدة البيانات
        await query(
            `INSERT INTO password_reset_tokens 
             (user_id, user_type, token_hash, expires_at) 
             VALUES (?, ?, ?, ?)`,
            [user[idField], user_type, resetTokenHash, resetTokenExpires]
        );

        // إرسال بريد استعادة كلمة المرور
        await sendPasswordResetEmail(email, user[nameField], resetToken, user_type);

        res.json({
            success: true,
            message: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني',
            expires_in: '60 دقيقة'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء عملية استعادة كلمة المرور'
        });
    }
};

// 5. إعادة تعيين كلمة المرور
exports.resetPassword = async (req, res) => {
    try {
        const { token, new_password, user_type } = req.body;

        if (!token || !new_password) {
            return res.status(400).json({
                success: false,
                message: 'التوكن وكلمة المرور الجديدة مطلوبان'
            });
        }

        // حساب هاش التوكن
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // التحقق من صحة التوكن
        const [tokens] = await query(
            `SELECT * FROM password_reset_tokens 
             WHERE token_hash = ? 
             AND user_type = ? 
             AND used = FALSE 
             AND expires_at > NOW()`,
            [resetTokenHash, user_type]
        );

        if (tokens.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'توكن استعادة كلمة المرور غير صالح أو منتهي الصلاحية'
            });
        }

        const resetToken = tokens[0];

        // تحديث كلمة المرور
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        let updateQuery, params;
        switch (user_type) {
            case 'student':
                updateQuery = 'UPDATE students SET password = ? WHERE student_id = ?';
                params = [hashedPassword, resetToken.user_id];
                break;
                
            case 'instructor':
                updateQuery = 'UPDATE instructors SET password = ? WHERE employee_id = ?';
                params = [hashedPassword, resetToken.user_id];
                break;
                
            case 'admin':
                updateQuery = 'UPDATE admins SET password = ? WHERE admin_id = ?';
                params = [hashedPassword, resetToken.user_id];
                break;
        }

        await query(updateQuery, params);

        // تعليم التوكن كمستخدم
        await query(
            'UPDATE password_reset_tokens SET used = TRUE WHERE id = ?',
            [resetToken.id]
        );

        res.json({
            success: true,
            message: 'تم إعادة تعيين كلمة المرور بنجاح'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إعادة تعيين كلمة المرور'
        });
    }
};

// 6. التحقق من الرقم القومي
exports.checkNationalId = async (req, res) => {
    try {
        const { national_id } = req.body;

        if (!national_id || national_id.length !== 14) {
            return res.status(400).json({
                success: false,
                message: 'الرقم القومي يجب أن يكون 14 رقم'
            });
        }

        const existing = await Student.findByNationalId(national_id);

        if (existing) {
            return res.json({
                success: false,
                message: 'الرقم القومي مسجل بالفعل',
                exists: true
            });
        }

        res.json({
            success: true,
            message: 'الرقم القومي متاح للتسجيل',
            exists: false
        });

    } catch (error) {
        console.error('Check national ID error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء التحقق من الرقم القومي'
        });
    }
};

// 7. إنشاء بريد جامعي
exports.generateUniversityEmail = async (req, res) => {
    try {
        const { full_name_en, year } = req.body;

        if (!full_name_en) {
            return res.status(400).json({
                success: false,
                message: 'الاسم بالإنجليزية مطلوب'
            });
        }

        const names = full_name_en.toLowerCase().split(' ');
        const firstName = names[0].replace(/[^a-z]/g, '');
        const lastName = names[names.length - 1].replace(/[^a-z]/g, '');
        
        const currentYear = year || new Date().getFullYear();
        let universityEmail = `${firstName}.${lastName}${currentYear}@eng.shubra.edu.eg`;
        
        // التحقق من عدم تكرار البريد
        let counter = 1;
        let existingEmail = await Student.findByEmail(universityEmail);
        while (existingEmail) {
            universityEmail = `${firstName}.${lastName}${currentYear}${counter}@eng.shubra.edu.eg`;
            existingEmail = await Student.findByEmail(universityEmail);
            counter++;
        }

        res.json({
            success: true,
            email: universityEmail,
            format: 'first.last@eng.shubra.edu.eg'
        });

    } catch (error) {
        console.error('Generate email error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إنشاء البريد الجامعي'
        });
    }
};

// 8. التحقق من حالة الحساب
exports.checkAccountStatus = async (req, res) => {
    try {
        const { email, user_type } = req.body;

        if (!email || !user_type) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني ونوع المستخدم مطلوبان'
            });
        }

        let user;
        switch (user_type) {
            case 'student':
                user = await Student.findByEmail(email);
                break;
            case 'instructor':
                user = await Instructor.findByEmail(email);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'نوع المستخدم غير صالح'
                });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'الحساب غير موجود'
            });
        }

        res.json({
            success: true,
            data: {
                status: user.account_status || 'غير معروف',
                is_active: user.account_status === 'مفعل',
                email: user.email,
                name: user.full_name_ar || user.full_name_en
            }
        });

    } catch (error) {
        console.error('Check account status error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في التحقق من حالة الحساب'
        });
    }
};

// ===== الدوال المساعدة =====

// دالة إرسال بريد التفعيل
async function sendVerificationEmail(toEmail, studentId, token) {
    try {
        const transporter = createTransporter();
        
        const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

        const mailOptions = {
            from: `"كلية الهندسة بشبرا" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'تفعيل حسابك - كلية الهندسة بشبرا',
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #007bff; text-align: center;">مرحباً بك في كلية الهندسة بشبرا</h2>
                        
                        <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <p style="font-size: 16px;">شكراً لتسجيلك في النظام الأكاديمي لكلية الهندسة بشبرا - قسم الاتصالات والحاسبات</p>
                            
                            <div style="background-color: #f1f8ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
                                <p style="margin: 5px 0;"><strong>📝 رقمك الجامعي:</strong> ${studentId}</p>
                                <p style="margin: 5px 0;"><strong>📧 بريدك الجامعي:</strong> ${toEmail}</p>
                            </div>
                            
                            <p style="font-size: 14px; color: #666;">يرجى تفعيل حسابك بالضغط على الزر التالي:</p>
                            
                            <div style="text-align: center; margin: 25px 0;">
                                <a href="${verificationLink}" style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                    🔗 تفعيل الحساب
                                </a>
                            </div>
                            
                            <p style="font-size: 12px; color: #999; text-align: center;">
                                أو انسخ الرابط التالي:<br>
                                <code style="background-color: #f8f9fa; padding: 5px; border-radius: 3px;">${verificationLink}</code>
                            </p>
                        </div>
                        
                        <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px;">
                            <p style="font-size: 12px; color: #666; text-align: center;">
                                <strong>ملاحظة:</strong> رابط التفعيل صالح لمدة 24 ساعة فقط.<br>
                                إذا لم تطلب هذا البريد، يرجى تجاهله.
                            </p>
                        </div>
                        
                        <hr style="border: none; border-top: 2px solid #007bff; margin: 20px 0;">
                        
                        <footer style="text-align: center; color: #666; font-size: 12px;">
                            <p>كلية الهندسة بشبرا - جامعة عين شمس</p>
                            <p>قسم الاتصالات والحاسبات</p>
                            <p>© ${new Date().getFullYear()} جميع الحقوق محفوظة</p>
                        </footer>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ تم إرسال بريد التفعيل إلى: ${toEmail}`);
        
    } catch (error) {
        console.error('❌ فشل إرسال بريد التفعيل:', error);
        throw error;
    }
}

// دالة إرسال بريد استعادة كلمة المرور
async function sendPasswordResetEmail(toEmail, userName, token, userType) {
    try {
        const transporter = createTransporter();
        
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}&type=${userType}`;

        const mailOptions = {
            from: `"كلية الهندسة بشبرا" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'استعادة كلمة المرور - كلية الهندسة بشبرا',
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #dc3545; text-align: center;">استعادة كلمة المرور</h2>
                        
                        <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <p style="font-size: 16px;">مرحباً ${userName},</p>
                            <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في النظام الأكاديمي لكلية الهندسة بشبرا.</p>
                            
                            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #ffeaa7;">
                                <p style="color: #856404; margin: 5px 0;">
                                    ⏰ رابط إعادة التعيين صالح لمدة <strong>ساعة واحدة</strong> فقط.
                                </p>
                            </div>
                            
                            <div style="text-align: center; margin: 25px 0;">
                                <a href="${resetLink}" style="display: inline-block; padding: 12px 30px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                    🔑 إعادة تعيين كلمة المرور
                                </a>
                            </div>
                            
                            <p style="font-size: 12px; color: #999; text-align: center;">
                                أو انسخ الرابط التالي:<br>
                                <code style="background-color: #f8f9fa; padding: 5px; border-radius: 3px;">${resetLink}</code>
                            </p>
                            
                            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
                                <p style="font-size: 14px; color: #666; margin: 0;">
                                    <strong>⚠️ ملاحظة:</strong> إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد.
                                </p>
                            </div>
                        </div>
                        
                        <hr style="border: none; border-top: 2px solid #dc3545; margin: 20px 0;">
                        
                        <footer style="text-align: center; color: #666; font-size: 12px;">
                            <p>كلية الهندسة بشبرا - جامعة عين شمس</p>
                            <p>© ${new Date().getFullYear()} جميع الحقوق محفوظة</p>
                        </footer>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ تم إرسال بريد استعادة كلمة المرور إلى: ${toEmail}`);
        
    } catch (error) {
        console.error('❌ فشل إرسال بريد استعادة كلمة المرور:', error);
        throw error;
    }
}