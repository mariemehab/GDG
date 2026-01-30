import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const InstructorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalCourses: 4,
    totalStudents: 125,
    assignmentsToGrade: 8,
    upcomingClasses: 3
  });

  // قائمة المقررات
  const courses = [
    { 
      id: 1, 
      code: 'CS101', 
      name: 'مقدمة في البرمجة', 
      students: 45, 
      schedule: 'الاثنين، الأربعاء 10:00-12:00',
      room: 'مبنى 4 - قاعة 302',
      nextClass: 'غداً 10:00 ص'
    },
    { 
      id: 2, 
      code: 'CS201', 
      name: 'قواعد البيانات', 
      students: 38, 
      schedule: 'الثلاثاء، الخميس 09:00-11:00',
      room: 'مبنى 4 - معمل 401',
      nextClass: 'اليوم 09:00 ص'
    },
    { 
      id: 3, 
      code: 'CS301', 
      name: 'هندسة البرمجيات', 
      students: 32, 
      schedule: 'الأحد، الثلاثاء 14:00-16:00',
      room: 'مبنى 3 - قاعة 203',
      nextClass: 'بعد غد 02:00 م'
    },
    { 
      id: 4, 
      code: 'IT101', 
      name: 'أساسيات تكنولوجيا المعلومات', 
      students: 50, 
      schedule: 'السبت، الإثنين 08:00-10:00',
      room: 'مبنى 2 - قاعة 105',
      nextClass: 'اليوم 08:00 ص'
    },
  ];

  // الجداول القادمة
  const upcomingClasses = [
    { id: 1, course: 'أساسيات تكنولوجيا المعلومات', time: 'اليوم 08:00 ص', room: 'مبنى 2 - قاعة 105' },
    { id: 2, course: 'قواعد البيانات', time: 'اليوم 09:00 ص', room: 'مبنى 4 - معمل 401' },
    { id: 3, course: 'مقدمة في البرمجة', time: 'غداً 10:00 ص', room: 'مبنى 4 - قاعة 302' },
  ];

  // المهام القادمة
  const upcomingTasks = [
    { id: 1, task: 'تصحيح واجب قواعد البيانات', due: 'غداً', priority: 'high' },
    { id: 2, task: 'تحضير محاضرة هندسة البرمجيات', due: 'بعد غد', priority: 'medium' },
    { id: 3, task: 'رفع درجات منتصف الفصل', due: '3 أيام', priority: 'high' },
    { id: 4, task: 'اجتماع قسم', due: 'الخميس', priority: 'low' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">لوحة تحكم المدرب</h1>
              <p className="text-gray-600 mt-2">مرحباً بك، {user?.name || 'أستاذ'}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                {user?.department || 'قسم علوم الحاسب'}
              </span>
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">المقررات</h3>
                  <p className="text-3xl font-bold mt-2">{stats.totalCourses}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">الطلاب</h3>
                  <p className="text-3xl font-bold mt-2">{stats.totalStudents}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a5.5 5.5 0 01-5.5 5.5" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">واجبات للتصحيح</h3>
                  <p className="text-3xl font-bold mt-2">{stats.assignmentsToGrade}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">محاضرات قادمة</h3>
                  <p className="text-3xl font-bold mt-2">{stats.upcomingClasses}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* المقررات */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">مقرراتي</h2>
                <Link to="/instructor/courses" className="text-blue-600 hover:text-blue-800 font-medium">
                  عرض الكل →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
                        <p className="text-gray-600">{course.code}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {course.students} طالب
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{course.schedule}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>{course.room}</span>
                      </div>
                      <div className="flex items-center text-green-600 font-medium">
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <span>المحاضرة القادمة: {course.nextClass}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Link
                        to={`/instructor/courses/${course.id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl text-center font-medium transition-colors"
                      >
                        إدارة المقرر
                      </Link>
                      <Link
                        to={`/instructor/grades?course=${course.id}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-xl text-center font-medium transition-colors"
                      >
                        إدخال الدرجات
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* التقويم */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">تقويم المحاضرات</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-right font-bold text-gray-700">المقرر</th>
                      <th className="py-3 px-4 text-right font-bold text-gray-700">الوقت</th>
                      <th className="py-3 px-4 text-right font-bold text-gray-700">القاعة</th>
                      <th className="py-3 px-4 text-right font-bold text-gray-700">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {upcomingClasses.map(cls => (
                      <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-bold text-gray-800">{cls.course}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{cls.time}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-700">{cls.room}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">قادمة</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* العمود الأيمن */}
          <div className="lg:col-span-1">
            {/* المهام القادمة */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">المهام القادمة</h2>
              <div className="space-y-4">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{task.task}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {task.priority === 'high' ? 'عالي' : task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">الموعد النهائي: {task.due}</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        إكمال
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* أزرار سريعة */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">أدوات سريعة</h3>
              <div className="space-y-3">
                <Link
                  to="/instructor/grades"
                  className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center ml-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-800">إدخال الدرجات</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to="/instructor/courses"
                  className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ml-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-800">إدارة المقررات</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to="/instructor/attendance"
                  className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center ml-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-800">تسجيل الحضور</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to="/instructor/materials"
                  className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center ml-3">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-800">المواد التعليمية</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* الإحصائيات */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">إحصائيات هذا الشهر</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">نسبة الحضور</span>
                    <span className="font-bold text-green-600">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">الواجبات المسلمة</span>
                    <span className="font-bold text-blue-600">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">الواجبات المصححة</span>
                    <span className="font-bold text-purple-600">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;