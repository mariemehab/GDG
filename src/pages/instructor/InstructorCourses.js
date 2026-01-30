import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const InstructorCourses = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('current');

  // بيانات المقررات
  const courses = {
    current: [
      {
        id: 1,
        code: 'CS101',
        name: 'مقدمة في البرمجة',
        semester: 'الفصل الثاني 2024',
        students: 45,
        schedule: 'الاثنين، الأربعاء 10:00-12:00',
        room: 'مبنى 4 - قاعة 302',
        status: 'جاري',
        color: 'blue'
      },
      {
        id: 2,
        code: 'CS201',
        name: 'قواعد البيانات',
        semester: 'الفصل الثاني 2024',
        students: 38,
        schedule: 'الثلاثاء، الخميس 09:00-11:00',
        room: 'مبنى 4 - معمل 401',
        status: 'جاري',
        color: 'green'
      },
      {
        id: 3,
        code: 'CS301',
        name: 'هندسة البرمجيات',
        semester: 'الفصل الثاني 2024',
        students: 32,
        schedule: 'الأحد، الثلاثاء 14:00-16:00',
        room: 'مبنى 3 - قاعة 203',
        status: 'جاري',
        color: 'purple'
      },
    ],
    previous: [
      {
        id: 4,
        code: 'IT101',
        name: 'أساسيات تكنولوجيا المعلومات',
        semester: 'الفصل الأول 2024',
        students: 50,
        schedule: 'مكتمل',
        room: 'مبنى 2 - قاعة 105',
        status: 'مكتمل',
        color: 'gray'
      },
      {
        id: 5,
        code: 'CS202',
        name: 'هياكل البيانات',
        semester: 'الفصل الأول 2024',
        students: 40,
        schedule: 'مكتمل',
        room: 'مبنى 4 - قاعة 304',
        status: 'مكتمل',
        color: 'gray'
      },
    ],
    upcoming: [
      {
        id: 6,
        code: 'CS401',
        name: 'الذكاء الاصطناعي',
        semester: 'الفصل الصيفي 2024',
        students: 35,
        schedule: 'سيتم الإعلان',
        room: 'قيد التحديد',
        status: 'مخطط',
        color: 'yellow'
      },
    ]
  };

  // الحصول على لون المقرر
  const getCourseColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      yellow: 'from-yellow-500 to-yellow-600',
      gray: 'from-gray-500 to-gray-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">مقرراتي</h1>
              <p className="text-gray-600 mt-2">إدارة وتتبع جميع المقررات التي أقوم بتدريسها</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/instructor/courses/new"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300"
              >
                إضافة مقرر جديد
              </Link>
            </div>
          </div>

          {/* التبويبات */}
          <div className="flex space-x-4 mb-8">
            {[
              { key: 'current', label: 'المقررات الحالية', count: courses.current.length },
              { key: 'previous', label: 'المقررات السابقة', count: courses.previous.length },
              { key: 'upcoming', label: 'المقررات القادمة', count: courses.upcoming.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                {tab.label}
                <span className={`mr-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.key ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* بطاقات المقررات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses[activeTab].map(course => (
            <div key={course.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* رأس البطاقة */}
              <div className={`h-2 bg-gradient-to-r ${getCourseColor(course.color)}`}></div>
              
              <div className="p-6">
                {/* معلومات المقرر */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
                    <p className="text-gray-600">{course.code}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.status === 'جاري' ? 'bg-green-100 text-green-800' :
                    course.status === 'مكتمل' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.status}
                  </span>
                </div>

                {/* تفاصيل المقرر */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{course.semester}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a5.5 5.5 0 01-5.5 5.5" />
                    </svg>
                    <span>{course.students} طالب</span>
                  </div>
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
                </div>

                {/* أزرار الإجراءات */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/instructor/courses/${course.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl text-center font-medium transition-colors"
                  >
                    تفاصيل المقرر
                  </Link>
                  <Link
                    to={`/instructor/grades?course=${course.id}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-xl text-center font-medium transition-colors"
                  >
                    إدخال الدرجات
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* إذا لم توجد مقررات */}
        {courses[activeTab].length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700">لا توجد مقررات</h3>
            <p className="text-gray-500 mt-2">لا توجد مقررات في هذا القسم حالياً</p>
            <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
              إضافة مقرر جديد
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCourses;