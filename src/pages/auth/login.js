import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // أضف Link هنا
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(formData.email, formData.password, formData.userType);
      if (success) {
        // التحويل حسب نوع المستخدم
        switch(formData.userType) {
          case 'student':
            navigate('/student');
            break;
          case 'instructor':
            navigate('/instructor');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
      } else {
        setError('بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* الرأس */}
        <div className="bg-blue-800 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
          <p className="text-blue-200 mt-2">النظام الجامعي المتكامل</p>
        </div>

        {/* نموذج الدخول */}
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            {/* نوع المستخدم */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">أدخل كـ:</label>
              <div className="flex space-x-4">
                {['student', 'instructor', 'admin'].map((type) => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value={type}
                      checked={formData.userType === type}
                      onChange={handleChange}
                      className="text-blue-600"
                    />
                    <span>
                      {type === 'student' ? 'طالب' : 
                       type === 'instructor' ? 'مدرس' : 'مدير'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="example@university.edu"
                required
              />
            </div>

            {/* كلمة المرور */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">كلمة المرور</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {/* خطأ */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* زر الدخول */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>

            {/* روابط إضافية */}
            <div className="mt-6 text-center">
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm">
                نسيت كلمة المرور؟
              </Link>
              <p className="mt-4 text-gray-600">
                ليس لديك حساب؟{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                  سجل الآن
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;