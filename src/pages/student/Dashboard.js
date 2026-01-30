// src/pages/Student/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from "../../components/layout/Card";
import Loader from "../../components/common/Loader";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // بيانات تجريبية
  const mockData = {
    name: 'أحمد محمد',
    studentId: '202310001',
    department: 'علوم الحاسب',
    level: 'الثالث',
    gpa: 3.75,
    totalCredits: 90,
    registeredCredits: 18,
    academicStatus: 'منتظم',
    semester: 'الفصل الدراسي الأول 2024'
  };

  const mockNotifications = [
    { id: 1, title: 'فترة التسجيل مفتوحة', message: 'يمكنك الآن تسجيل مقررات الفصل القادم', time: 'قبل ساعة', type: 'info' },
    { id: 2, title: 'موعد الاختبار النهائي', message: 'مقرر قواعد البيانات - 10 يناير', time: 'قبل يومين', type: 'warning' },
    { id: 3, title: 'درجة جديدة', message: 'تم رفع درجة مقرر البرمجة المتقدمة', time: 'قبل 3 أيام', type: 'success' },
  ];

  useEffect(() => {
    // محاكاة جلب البيانات من API
    setTimeout(() => {
      setStudentData(mockData);
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      {/* رأس الصفحة */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم الطالب</h1>
        <p className="text-gray-600 mt-2">مرحباً بك، {studentData.name}</p>
      </div>

      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="المعدل التراكمي"
          value={studentData.gpa}
          subtitle="من 4.0"
          icon="📊"
          color="blue"
        />
        <Card
          title="الساعات المسجلة"
          value={studentData.registeredCredits}
          subtitle="ساعة معتمدة"
          icon="📚"
          color="green"
        />
        <Card
          title="الحالة الأكاديمية"
          value={studentData.academicStatus}
          subtitle={studentData.level}
          icon="🎓"
          color="purple"
        />
        <Card
          title="الساعات المتبقية"
          value={studentData.totalCredits}
          subtitle="ساعة للتخرج"
          icon="⏳"
          color="yellow"
        />
      </div>

      {/* قسمين رئيسيين */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* الإشعارات */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">الإشعارات المهمة</h2>
            <Link to="/student/notifications" className="text-blue-600 hover:text-blue-800 text-sm">
              عرض الكل
            </Link>
          </div>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  notification.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  notification.type === 'success' ? 'border-green-500 bg-green-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  <span className="text-sm text-gray-500">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* الإجراءات السريعة */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/student/registration"
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-center transition-colors duration-200"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="font-semibold">تسجيل المقررات</div>
            </Link>
            <Link
              to="/student/schedule"
              className="bg-green-100 hover:bg-green-200 text-green-800 p-4 rounded-lg text-center transition-colors duration-200"
            >
              <div className="text-2xl mb-2">📅</div>
              <div className="font-semibold">الجدول الدراسي</div>
            </Link>
            <Link
              to="/student/grades"
              className="bg-purple-100 hover:bg-purple-200 text-purple-800 p-4 rounded-lg text-center transition-colors duration-200"
            >
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-semibold">الدرجات</div>
            </Link>
            <Link
              to="/student/profile"
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-4 rounded-lg text-center transition-colors duration-200"
            >
              <div className="text-2xl mb-2">👤</div>
              <div className="font-semibold">الملف الشخصي</div>
            </Link>
          </div>

          {/* الفصل الدراسي الحالي */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold text-gray-700 mb-2">الفصل الدراسي الحالي</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-lg font-bold text-blue-800">{studentData.semester}</p>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>بداية الفصل: 10 سبتمبر 2024</span>
                <span>نهاية الفصل: 20 يناير 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* المقررات الحالية */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">المقررات المسجلة</h2>
          <Link to="/student/registration" className="text-blue-600 hover:text-blue-800">
            تعديل التسجيل
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">كود المقرر</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">اسم المقرر</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">المدرس</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الوقت</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الساعات</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800">CS301</td>
                <td className="px-4 py-3 text-sm text-gray-800">قواعد البيانات</td>
                <td className="px-4 py-3 text-sm text-gray-800">د. محمد أحمد</td>
                <td className="px-4 py-3 text-sm text-gray-800">الإثنين 10:00 - 12:00</td>
                <td className="px-4 py-3 text-sm text-gray-800">3</td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    مسجل
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800">CS302</td>
                <td className="px-4 py-3 text-sm text-gray-800">هندسة البرمجيات</td>
                <td className="px-4 py-3 text-sm text-gray-800">د. سارة خالد</td>
                <td className="px-4 py-3 text-sm text-gray-800">الثلاثاء 8:00 - 10:00</td>
                <td className="px-4 py-3 text-sm text-gray-800">3</td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    مسجل
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;