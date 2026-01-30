import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Schedule = () => {
  const { user } = useContext(AuthContext);
  const [selectedDay, setSelectedDay] = useState('الاثنين');

  // أيام الأسبوع
  const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  // الجدول الدراسي
  const scheduleData = {
    'السبت': [
      { time: '08:00 - 10:00', course: 'هياكل البيانات', code: 'CS102', room: 'مبنى 4 - قاعة 302', instructor: 'د. أحمد علي' },
      { time: '10:30 - 12:30', course: 'تفاضل وتكامل', code: 'MATH201', room: 'مبنى 1 - قاعة 105', instructor: 'د. محمد سعيد' },
    ],
    'الأحد': [
      { time: '09:00 - 11:00', course: 'قواعد البيانات', code: 'CS201', room: 'مبنى 4 - معمل 401', instructor: 'د. سارة محمد' },
      { time: '12:00 - 14:00', course: 'لغة إنجليزية', code: 'ENG101', room: 'مبنى 2 - قاعة 203', instructor: 'أ. جون سميث' },
    ],
    'الاثنين': [
      { time: '08:00 - 10:00', course: 'مقدمة في البرمجة', code: 'CS101', room: 'مبنى 4 - معمل 301', instructor: 'د. خالد حسن' },
      { time: '10:30 - 12:30', course: 'فيزياء عامة', code: 'PHYS101', room: 'مبنى 3 - قاعة 304', instructor: 'د. فاطمة أحمد' },
      { time: '14:00 - 16:00', course: 'هياكل البيانات', code: 'CS102', room: 'مبنى 4 - قاعة 302', instructor: 'د. أحمد علي' },
    ],
    'الثلاثاء': [
      { time: '09:00 - 11:00', course: 'تفاضل وتكامل', code: 'MATH201', room: 'مبنى 1 - قاعة 105', instructor: 'د. محمد سعيد' },
      { time: '11:30 - 13:30', course: 'قواعد البيانات', code: 'CS201', room: 'مبنى 4 - معمل 401', instructor: 'د. سارة محمد' },
    ],
    'الأربعاء': [
      { time: '10:00 - 12:00', course: 'لغة إنجليزية', code: 'ENG101', room: 'مبنى 2 - قاعة 203', instructor: 'أ. جون سميث' },
      { time: '13:00 - 15:00', course: 'فيزياء عامة', code: 'PHYS101', room: 'مبنى 3 - قاعة 304', instructor: 'د. فاطمة أحمد' },
    ],
    'الخميس': [
      { time: '08:00 - 10:00', course: 'مقدمة في البرمجة', code: 'CS101', room: 'مبنى 4 - معمل 301', instructor: 'د. خالد حسن' },
      { time: '11:00 - 13:00', course: 'هياكل البيانات', code: 'CS102', room: 'مبنى 4 - قاعة 302', instructor: 'د. أحمد علي' },
    ],
  };

  // المقررات المسجلة
  const registeredCourses = [
    { id: 1, name: 'مقدمة في البرمجة', code: 'CS101', creditHours: 3, instructor: 'د. خالد حسن' },
    { id: 2, name: 'هياكل البيانات', code: 'CS102', creditHours: 3, instructor: 'د. أحمد علي' },
    { id: 3, name: 'تفاضل وتكامل', code: 'MATH201', creditHours: 4, instructor: 'د. محمد سعيد' },
    { id: 4, name: 'فيزياء عامة', code: 'PHYS101', creditHours: 4, instructor: 'د. فاطمة أحمد' },
    { id: 5, name: 'قواعد البيانات', code: 'CS201', creditHours: 3, instructor: 'د. سارة محمد' },
    { id: 6, name: 'لغة إنجليزية', code: 'ENG101', creditHours: 2, instructor: 'أ. جون سميث' },
  ];

  // حساب إجمالي الساعات
  const totalHours = registeredCourses.reduce((sum, course) => sum + course.creditHours, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 text-right">جدولي الدراسي</h1>
          <p className="text-gray-600 mt-3 text-right">تنظيم وتخطيط المحاضرات والجداول الدراسية</p>
          
          {/* معلومات الفصل */}
          <div className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">الفصل الدراسي الثاني 2024</h2>
                <p className="mt-2 opacity-90">من 10 فبراير إلى 15 يونيو 2024</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{totalHours}</p>
                  <p className="text-sm opacity-90">ساعة معتمدة</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{registeredCourses.length}</p>
                  <p className="text-sm opacity-90">مقرر مسجل</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">15</p>
                  <p className="text-sm opacity-90">أسبوع دراسي</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* العمود الأيسر: أيام الأسبوع والمقررات */}
          <div className="lg:col-span-2">
            {/* أيام الأسبوع */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">جدول المحاضرات الأسبوعي</h2>
              
              {/* أزرار الأيام */}
              <div className="flex flex-wrap gap-3 mb-8">
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                      selectedDay === day 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* جدول اليوم المختار */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  محاضرات يوم {selectedDay}
                </h3>

                {scheduleData[selectedDay] && scheduleData[selectedDay].length > 0 ? (
                  <div className="space-y-6">
                    {scheduleData[selectedDay].map((lecture, index) => (
                      <div key={index} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center mb-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-gray-800">{lecture.course}</h4>
                                <p className="text-gray-600">{lecture.code}</p>
                              </div>
                            </div>
                            <div className="pr-16">
                              <p className="text-gray-700">
                                <span className="font-medium">المحاضر:</span> {lecture.instructor}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:items-end space-y-4">
                            {/* الوقت */}
                            <div className="bg-blue-50 px-4 py-2 rounded-xl">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-bold text-blue-700">{lecture.time}</span>
                              </div>
                            </div>
                            
                            {/* القاعة */}
                            <div className="bg-gray-100 px-4 py-2 rounded-xl">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="font-medium text-gray-800">{lecture.room}</span>
                              </div>
                            </div>
                            
                            {/* حالة المحاضرة */}
                            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-xl text-sm font-medium">
                              محاضرة عادية
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-700">لا توجد محاضرات في هذا اليوم</h3>
                    <p className="text-gray-500 mt-2">يوم إجازة أو لا توجد محاضرات مجدولة</p>
                  </div>
                )}
              </div>
            </div>

            {/* التقويم المصغر */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">التقويم الدراسي</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">بداية الفصل الدراسي</h4>
                  <p className="text-gray-700">10 فبراير 2024</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <h4 className="font-bold text-green-800 mb-2">أسبوع المراجعة</h4>
                  <p className="text-gray-700">1 - 7 يونيو 2024</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                  <h4 className="font-bold text-yellow-800 mb-2">امتحانات منتصف الفصل</h4>
                  <p className="text-gray-700">15 - 25 مارس 2024</p>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                  <h4 className="font-bold text-red-800 mb-2">انتهاء الفصل الدراسي</h4>
                  <p className="text-gray-700">15 يونيو 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* العمود الأيمن: المقررات المسجلة */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">المقررات المسجلة</h2>
              
              <div className="space-y-4 mb-8">
                {registeredCourses.map(course => (
                  <div key={course.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">{course.name}</h4>
                        <p className="text-gray-600 text-sm">{course.code}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {course.creditHours} ساعة
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm">{course.instructor}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ملخص الساعات */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-800">إجمالي الساعات المعتمدة</span>
                  <span className="text-2xl font-bold text-purple-700">{totalHours}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${(totalHours / 21) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">الحد الأقصى المسموح: 21 ساعة</p>
              </div>

              {/* أزرار سريعة */}
              <div className="mt-8 space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  تحميل الجدول (PDF)
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  إعدادات التذكيرات
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ملاحظات */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mt-1 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold text-blue-800">نصائح للنجاح:</h3>
              <ul className="text-blue-700 mt-2 space-y-1 list-disc pr-5">
                <li>احضر جميع المحاضرات للحصول على أفضل النتائج.</li>
                <li>راجع الجدول الدراسي بانتظام لتجنب تفويت أي محاضرة.</li>
                <li>استخدم التذكيرات لتتبع المواعيد المهمة.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Schedule;