import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // بيانات افتراضية للمستخدم
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    studentId: '',
    phone: '',
    address: '',
    department: 'علوم الحاسب',
    level: 'المستوى الثالث',
    gpa: '3.75',
    bio: '',
    joinDate: 'سبتمبر 2023',
    status: 'نشط'
  });

  // تحميل بيانات المستخدم عند فتح الصفحة
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || 'طالب جامعي',
        email: user.email || 'student@example.com',
        studentId: user.id || '20230001'
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setLoading(true);
    // محاكاة حفظ البيانات في السيرفر
    setTimeout(() => {
      setIsEditing(false);
      setLoading(false);
      alert('تم حفظ التعديلات بنجاح!');
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 text-right">الملف الشخصي</h1>
          <p className="text-gray-600 mt-3 text-right">إدارة معلومات حسابك الشخصي والتفاصيل الأكاديمية</p>
          
          {/* شريط الحالة */}
          <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${profileData.status === 'نشط' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-700">الحالة: <span className="font-bold">{profileData.status}</span></span>
            </div>
            <div className="text-gray-600">
              رقم الطالب: <span className="font-bold text-blue-700">{profileData.studentId}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* العمود الأيسر: بطاقة الطالب */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <div className="flex flex-col items-center text-center">
                {/* صورة الملف الشخصي */}
                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-5xl font-bold">
                      {profileData.name.charAt(0) || 'ط'}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* المعلومات الأساسية */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{profileData.name}</h2>
                <p className="text-blue-600 font-medium mb-1">{profileData.department}</p>
                <p className="text-gray-500 mb-6">{profileData.level}</p>
                
                {/* المعدل التراكمي */}
                <div className="w-full mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">المعدل التراكمي</span>
                    <span className="text-3xl font-bold text-green-600">{profileData.gpa}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full" 
                      style={{ width: `${(parseFloat(profileData.gpa) / 4) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-left mt-1">من 4.0</p>
                </div>
                
                {/* أزرار إضافية */}
                <div className="w-full space-y-3">
                  <button className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 py-3 rounded-xl font-medium transition-colors">
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      السجل الأكاديمي
                    </div>
                  </button>
                  <button className="w-full bg-gray-50 text-gray-700 hover:bg-gray-100 py-3 rounded-xl font-medium transition-colors">
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      الأمان والخصوصية
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* العمود الأيمن: معلومات الطالب */}
          <div className="lg:col-span-2">
            {/* معلومات الشخصية */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-bold text-gray-800">المعلومات الشخصية</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={loading}
                  className={`px-6 py-3 rounded-xl font-medium flex items-center ${
                    isEditing 
                      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900'
                  } transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      جاري الحفظ...
                    </>
                  ) : isEditing ? (
                    <>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      إلغاء التعديل
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      تعديل الملف
                    </>
                  )}
                </button>
              </div>

              {/* نموذج المعلومات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* الاسم الكامل */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-right">الاسم الكامل</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right transition-all"
                      placeholder="أدخل الاسم الكامل"
                    />
                  ) : (
                    <div className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="font-medium text-gray-800 text-right">{profileData.name}</p>
                    </div>
                  )}
                </div>

                {/* البريد الإلكتروني */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-right">البريد الإلكتروني</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right transition-all"
                      placeholder="example@university.edu"
                    />
                  ) : (
                    <div className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="font-medium text-gray-800 text-right">{profileData.email}</p>
                    </div>
                  )}
                </div>

                {/* رقم الهاتف */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-right">رقم الهاتف</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right transition-all"
                      placeholder="+20 123 456 7890"
                    />
                  ) : (
                    <div className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="font-medium text-gray-800 text-right">{profileData.phone || 'لم يتم إضافة رقم هاتف'}</p>
                    </div>
                  )}
                </div>

                {/* العنوان */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-right">العنوان</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right transition-all"
                      placeholder="المدينة، العنوان التفصيلي"
                    />
                  ) : (
                    <div className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="font-medium text-gray-800 text-right">{profileData.address || 'لم يتم إضافة عنوان'}</p>
                    </div>
                  )}
                </div>

                {/* القسم */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-right">القسم</label>
                  <div className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent">
                    <p className="font-medium text-gray-800 text-right">{profileData.department}</p>
                  </div>
                </div>

                {/* المستوى الدراسي */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-right">المستوى الدراسي</label>
                  <div className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent">
                    <p className="font-medium text-gray-800 text-right">{profileData.level}</p>
                  </div>
                </div>
              </div>

              {/* النبذة الشخصية */}
              <div className="mt-10">
                <label className="block text-sm font-medium text-gray-700 mb-3 text-right">نبذة عني</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right transition-all"
                    placeholder="أخبرنا عن نفسك، اهتماماتك، إنجازاتك..."
                  />
                ) : (
                  <div className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent">
                    <p className="text-gray-800 leading-relaxed text-right whitespace-pre-line">
                      {profileData.bio || 'لم يتم إضافة نبذة شخصية بعد. يمكنك إضافتها عن طريق النقر على زر "تعديل الملف".'}
                    </p>
                  </div>
                )}
              </div>

              {/* زر الحفظ إذا كان في وضع التعديل */}
              {isEditing && (
                <div className="mt-10 pt-8 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        جاري حفظ التعديلات...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        حفظ التعديلات
                      </>
                    )}
                  </button>
                  <p className="text-center text-gray-500 text-sm mt-4">
                    سيتم حفظ جميع التعديلات التي أجريتها على ملفك الشخصي
                  </p>
                </div>
              )}
            </div>

            {/* معلومات إضافية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* تاريخ التسجيل */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">تاريخ التسجيل</h4>
                    <p className="text-gray-600 text-sm">الانضمام للجامعة</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-800">{profileData.joinDate}</p>
              </div>

              {/* الحالة الأكاديمية */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">الحالة الأكاديمية</h4>
                    <p className="text-gray-600 text-sm">مستوى التقدم</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-800">{profileData.status}</p>
              </div>

              {/* عدد المقررات */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">المقررات المسجلة</h4>
                    <p className="text-gray-600 text-sm">الفصل الحالي</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-purple-800">6 مقررات</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;