import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Grades = () => {
  const { user } = useContext(AuthContext);
  const [selectedSemester, setSelectedSemester] = useState('الفصل الأول 2024');

  // بيانات المقررات والدرجات
  const courses = [
    { 
      id: 1, 
      code: 'CS101', 
      name: 'مقدمة في البرمجة', 
      creditHours: 3, 
      grade: 'A+', 
      points: 4.0,
      semester: 'الفصل الأول 2024'
    },
    { 
      id: 2, 
      code: 'MATH201', 
      name: 'تفاضل وتكامل', 
      creditHours: 4, 
      grade: 'B+', 
      points: 3.3,
      semester: 'الفصل الأول 2024'
    },
    { 
      id: 3, 
      code: 'CS102', 
      name: 'هياكل البيانات', 
      creditHours: 3, 
      grade: 'A', 
      points: 4.0,
      semester: 'الفصل الأول 2024'
    },
    { 
      id: 4, 
      code: 'PHYS101', 
      name: 'فيزياء عامة', 
      creditHours: 4, 
      grade: 'B', 
      points: 3.0,
      semester: 'الفصل الثاني 2024'
    },
    { 
      id: 5, 
      code: 'CS201', 
      name: 'قواعد البيانات', 
      creditHours: 3, 
      grade: 'A-', 
      points: 3.7,
      semester: 'الفصل الثاني 2024'
    },
    { 
      id: 6, 
      code: 'ENG101', 
      name: 'لغة إنجليزية', 
      creditHours: 2, 
      grade: 'A+', 
      points: 4.0,
      semester: 'الفصل الثاني 2024'
    },
  ];

  // الفصول الدراسية المتاحة
  const semesters = ['الفصل الأول 2024', 'الفصل الثاني 2024', 'الفصل الصيفي 2024'];

  // تصفية المقررات حسب الفصل المختار
  const filteredCourses = courses.filter(course => course.semester === selectedSemester);

  // حساب المعدل التراكمي للفصل
  const calculateSemesterGPA = () => {
    let totalPoints = 0;
    let totalCreditHours = 0;
    
    filteredCourses.forEach(course => {
      totalPoints += course.points * course.creditHours;
      totalCreditHours += course.creditHours;
    });
    
    return totalCreditHours > 0 ? (totalPoints / totalCreditHours).toFixed(2) : '0.00';
  };

  // حساب المعدل التراكمي العام
  const calculateOverallGPA = () => {
    let totalPoints = 0;
    let totalCreditHours = 0;
    
    courses.forEach(course => {
      totalPoints += course.points * course.creditHours;
      totalCreditHours += course.creditHours;
    });
    
    return (totalPoints / totalCreditHours).toFixed(2);
  };

  // تحديد لون الدرجة
  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+': case 'A': return 'text-green-600 bg-green-50';
      case 'A-': case 'B+': return 'text-blue-600 bg-blue-50';
      case 'B': case 'B-': return 'text-yellow-600 bg-yellow-50';
      case 'C+': case 'C': return 'text-orange-600 bg-orange-50';
      default: return 'text-red-600 bg-red-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 text-right">الدرجات الأكاديمية</h1>
          <p className="text-gray-600 mt-3 text-right">عرض وتتبع أدائك الأكاديمي في جميع المقررات</p>
        </div>

        {/* بطاقات الإحصاءات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* المعدل التراكمي العام */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">المعدل التراكمي</h3>
                <p className="text-3xl font-bold mt-2">{calculateOverallGPA()}<span className="text-xl">/4.0</span></p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* مجموع الساعات */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">الساعات المعتمدة</h3>
                <p className="text-3xl font-bold mt-2">19<span className="text-xl"> ساعة</span></p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* المقررات المكتملة */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">المقررات المكتملة</h3>
                <p className="text-3xl font-bold mt-2">6<span className="text-xl"> مقرر</span></p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* قسم الفصول الدراسية */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">الفصول الدراسية</h2>
            
            {/* اختيار الفصل الدراسي */}
            <div className="flex space-x-4">
              {semesters.map(semester => (
                <button
                  key={semester}
                  onClick={() => setSelectedSemester(semester)}
                  className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedSemester === semester 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {semester}
                </button>
              ))}
            </div>
          </div>

          {/* معدل الفصل الحالي */}
          <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">معدل الفصل: {selectedSemester}</h3>
                <p className="text-gray-600">متوسط الأداء في هذا الفصل الدراسي</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-blue-700">{calculateSemesterGPA()}</p>
                <p className="text-gray-600">من 4.0</p>
              </div>
            </div>
          </div>

          {/* جدول الدرجات */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-right font-bold text-gray-700">رمز المقرر</th>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">اسم المقرر</th>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">الساعات</th>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">الدرجة</th>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">النقاط</th>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-blue-700">{course.code}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-800">{course.name}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 bg-gray-100 rounded-full">{course.creditHours}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-4 py-2 rounded-full font-bold ${getGradeColor(course.grade)}`}>
                        {course.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-bold text-gray-800">{course.points.toFixed(1)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        مكتمل
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* توزيع الدرجات */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">توزيع الدرجات</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 border-2 border-green-200 rounded-xl bg-green-50">
              <p className="text-4xl font-bold text-green-700">3</p>
              <p className="text-gray-700 mt-2">مقررات بدرجة ممتاز</p>
            </div>
            <div className="text-center p-6 border-2 border-blue-200 rounded-xl bg-blue-50">
              <p className="text-4xl font-bold text-blue-700">2</p>
              <p className="text-gray-700 mt-2">مقررات بدرجة جيد جداً</p>
            </div>
            <div className="text-center p-6 border-2 border-yellow-200 rounded-xl bg-yellow-50">
              <p className="text-4xl font-bold text-yellow-700">1</p>
              <p className="text-gray-700 mt-2">مقررات بدرجة جيد</p>
            </div>
            <div className="text-center p-6 border-2 border-gray-200 rounded-xl bg-gray-50">
              <p className="text-4xl font-bold text-gray-700">0</p>
              <p className="text-gray-700 mt-2">مقررات تحتاج إعادة</p>
            </div>
          </div>
        </div>

        {/* ملاحظات */}
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-yellow-600 mt-1 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold text-yellow-800">ملاحظات هامة:</h3>
              <ul className="text-yellow-700 mt-2 space-y-1 list-disc pr-5">
                <li>يمكنك الاعتراض على الدرجة خلال أسبوعين من تاريخ النشر.</li>
                <li>المعدل التراكمي يحسب بناءً على جميع المقررات المكتملة.</li>
                <li>للحصول على النتيجة النهائية، يجب استكمال جميع المتطلبات.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Grades;