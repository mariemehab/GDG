import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const InstructorGrades = () => {
  const { user } = useContext(AuthContext);
  const [selectedCourse, setSelectedCourse] = useState('CS101');
  const [selectedAssignment, setSelectedAssignment] = useState('midterm');
  const [students, setStudents] = useState([
    { id: 1, name: 'أحمد محمد', studentId: '20231001', midterm: 85, final: 90, assignments: 95, total: 90, grade: 'A+' },
    { id: 2, name: 'محمد أحمد', studentId: '20231002', midterm: 78, final: 85, assignments: 88, total: 84, grade: 'B+' },
    { id: 3, name: 'سارة خالد', studentId: '20231003', midterm: 92, final: 88, assignments: 90, total: 90, grade: 'A+' },
    { id: 4, name: 'فاطمة علي', studentId: '20231004', midterm: 65, final: 70, assignments: 75, total: 70, grade: 'C' },
    { id: 5, name: 'خالد حسين', studentId: '20231005', midterm: 88, final: 92, assignments: 90, total: 90, grade: 'A+' },
    { id: 6, name: 'نورا سعيد', studentId: '20231006', midterm: 72, final: 78, assignments: 80, total: 77, grade: 'C+' },
    { id: 7, name: 'يوسف عمر', studentId: '20231007', midterm: 95, final: 94, assignments: 96, total: 95, grade: 'A+' },
    { id: 8, name: 'لينا كمال', studentId: '20231008', midterm: 60, final: 65, assignments: 70, total: 65, grade: 'D+' },
  ]);

  const courses = [
    { id: 'CS101', name: 'مقدمة في البرمجة', students: 45 },
    { id: 'CS201', name: 'قواعد البيانات', students: 38 },
    { id: 'CS301', name: 'هندسة البرمجيات', students: 32 },
  ];

  const assignments = [
    { id: 'midterm', name: 'امتحان منتصف الفصل', maxScore: 100 },
    { id: 'final', name: 'الامتحان النهائي', maxScore: 100 },
    { id: 'assignments', name: 'الواجبات', maxScore: 100 },
    { id: 'total', name: 'المجموع', maxScore: 100 },
  ];

  const handleGradeChange = (studentId, type, value) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updated = { ...student, [type]: parseInt(value) || 0 };
        
        // حساب المجموع
        if (type !== 'total') {
          const midterm = type === 'midterm' ? updated.midterm : student.midterm;
          const final = type === 'final' ? updated.final : student.final;
          const assignments = type === 'assignments' ? updated.assignments : student.assignments;
          
          updated.total = Math.round((midterm * 0.3) + (final * 0.4) + (assignments * 0.3));
          
          // تحديد الدرجة
          if (updated.total >= 90) updated.grade = 'A+';
          else if (updated.total >= 85) updated.grade = 'A';
          else if (updated.total >= 80) updated.grade = 'A-';
          else if (updated.total >= 75) updated.grade = 'B+';
          else if (updated.total >= 70) updated.grade = 'B';
          else if (updated.total >= 65) updated.grade = 'C+';
          else if (updated.total >= 60) updated.grade = 'C';
          else if (updated.total >= 55) updated.grade = 'D+';
          else if (updated.total >= 50) updated.grade = 'D';
          else updated.grade = 'F';
        }
        
        return updated;
      }
      return student;
    }));
  };

  const handleSaveGrades = () => {
    // هنا سيكون حفظ الدرجات في قاعدة البيانات
    alert('تم حفظ الدرجات بنجاح!');
  };

  const handlePublishGrades = () => {
    if (window.confirm('هل أنت متأكد من نشر الدرجات؟ سيتم إعلام جميع الطلاب.')) {
      alert('تم نشر الدرجات بنجاح!');
    }
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+': case 'A': case 'A-': return 'bg-green-100 text-green-800';
      case 'B+': case 'B': return 'bg-blue-100 text-blue-800';
      case 'C+': case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D+': case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // إحصائيات الدرجات
  const stats = {
    average: Math.round(students.reduce((sum, student) => sum + student.total, 0) / students.length),
    highest: Math.max(...students.map(s => s.total)),
    lowest: Math.min(...students.map(s => s.total)),
    passing: students.filter(s => s.total >= 60).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">إدخال الدرجات</h1>
              <p className="text-gray-600 mt-2">إدارة وتحديث درجات الطلاب</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={handleSaveGrades}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium shadow transition-colors"
              >
                حفظ التغييرات
              </button>
              <button
                onClick={handlePublishGrades}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow transition-colors"
              >
                نشر الدرجات
              </button>
            </div>
          </div>

          {/* الفلاتر */}
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* اختيار المقرر */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المقرر</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* اختيار الواجب */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع التقييم</label>
                <select
                  value={selectedAssignment}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {assignments.map(assignment => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* الإحصائيات */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">المتوسط</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.average}%</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">أعلى درجة</p>
                    <p className="text-2xl font-bold text-green-700">{stats.highest}%</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">أقل درجة</p>
                    <p className="text-2xl font-bold text-yellow-700">{stats.lowest}%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">الناجحون</p>
                    <p className="text-2xl font-bold text-purple-700">{stats.passing}/{students.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* جدول الدرجات */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">#</th>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">اسم الطالب</th>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">رقم الطالب</th>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">منتصف الفصل</th>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">الامتحان النهائي</th>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">الواجبات</th>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">المجموع</th>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">الدرجة</th>
                  <th className="py-4 px-6 text-right font-bold text-gray-700">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-center">
                      <span className="font-medium text-gray-800">{index + 1}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-800">{student.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">{student.studentId}</span>
                    </td>
                    <td className="py-4 px-6">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={student.midterm}
                        onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value)}
                        className="w-20 p-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={student.final}
                        onChange={(e) => handleGradeChange(student.id, 'final', e.target.value)}
                        className="w-20 p-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={student.assignments}
                        onChange={(e) => handleGradeChange(student.id, 'assignments', e.target.value)}
                        className="w-20 p-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-800 text-lg">{student.total}%</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full font-bold ${getGradeColor(student.grade)}`}>
                        {student.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        student.total >= 60 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.total >= 60 ? 'ناجح' : 'راسب'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* توزيع الدرجات */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">توزيع الدرجات</h3>
            <div className="space-y-4">
              {[
                { grade: 'A+', count: students.filter(s => s.grade === 'A+').length, color: 'bg-green-500' },
                { grade: 'A', count: students.filter(s => s.grade === 'A').length, color: 'bg-green-400' },
                { grade: 'A-', count: students.filter(s => s.grade === 'A-').length, color: 'bg-green-300' },
                { grade: 'B+', count: students.filter(s => s.grade === 'B+').length, color: 'bg-blue-500' },
                { grade: 'B', count: students.filter(s => s.grade === 'B').length, color: 'bg-blue-400' },
                { grade: 'C+', count: students.filter(s => s.grade === 'C+').length, color: 'bg-yellow-500' },
                { grade: 'C', count: students.filter(s => s.grade === 'C').length, color: 'bg-yellow-400' },
                { grade: 'D+', count: students.filter(s => s.grade === 'D+').length, color: 'bg-orange-500' },
                { grade: 'D', count: students.filter(s => s.grade === 'D').length, color: 'bg-orange-400' },
                { grade: 'F', count: students.filter(s => s.grade === 'F').length, color: 'bg-red-500' },
              ].map(item => (
                <div key={item.grade} className="flex items-center">
                  <span className="w-16 font-medium text-gray-700">{item.grade}</span>
                  <div className="flex-1 mx-4">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${(item.count / students.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="w-12 text-right font-bold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">ملاحظات الدرجات</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-bold text-blue-800 mb-2">توزيع الدرجات</h4>
                <p className="text-blue-700">منتصف الفصل: 30% | الامتحان النهائي: 40% | الواجبات: 30%</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-bold text-green-800 mb-2">حد النجاح</h4>
                <p className="text-green-700">الدرجة الأدنى للنجاح: 60% من المجموع الكلي</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl">
                <h4 className="font-bold text-yellow-800 mb-2">تعديل الدرجات</h4>
                <p className="text-yellow-700">يمكن تعديل الدرجات حتى تاريخ 15 يونيو 2024</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <h4 className="font-bold text-purple-800 mb-2">نشر الدرجات</h4>
                <p className="text-purple-700">سيتم إشعار الطلاب تلقائياً عند نشر الدرجات</p>
              </div>
            </div>
          </div>
        </div>

        {/* تعليمات */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mt-1 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold text-blue-800">تعليمات مهمة:</h3>
              <ul className="text-blue-700 mt-2 space-y-1 list-disc pr-5">
                <li>تأكد من إدخال جميع الدرجات قبل النشر.</li>
                <li>الدرجات من 0 إلى 100 لكل مكون.</li>
                <li>المجموع يحسب تلقائياً بناءً على التوزيع.</li>
                <li>بعد النشر، يمكن للطلاب الاطلاع على درجاتهم.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorGrades;