// src/pages/Student/CourseRegistration.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from "../../components/layout/Card";
import Modal from "../../components/common/Modal";

const CourseRegistration = () => {
  const [courses, setCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState({
    maxCredits: 18,
    currentCredits: 6,
    remainingCredits: 12
  });
  
  const navigate = useNavigate();

  // بيانات تجريبية للمقررات
  const mockCourses = [
    {
      id: 1,
      code: 'CS301',
      name: 'قواعد البيانات',
      description: 'مقدمة في أنظمة قواعد البيانات وتصميمها',
      credits: 3,
      prerequisites: ['CS201'],
      schedule: 'الإثنين 10:00 - 12:00',
      instructor: 'د. محمد أحمد',
      capacity: 40,
      enrolled: 32,
      location: 'مبنى العلوم - قاعة 201'
    },
    {
      id: 2,
      code: 'CS302',
      name: 'هندسة البرمجيات',
      description: 'مبادئ هندسة البرمجيات ودورة حياة المشروع',
      credits: 3,
      prerequisites: ['CS202'],
      schedule: 'الثلاثاء 8:00 - 10:00',
      instructor: 'د. سارة خالد',
      capacity: 35,
      enrolled: 30,
      location: 'مبنى العلوم - قاعة 105'
    },
    {
      id: 3,
      code: 'CS303',
      name: 'الشبكات الحاسوبية',
      description: 'مقدمة في أساسيات الشبكات والاتصالات',
      credits: 4,
      prerequisites: ['CS203'],
      schedule: 'الأربعاء 14:00 - 16:00',
      instructor: 'د. خالد سعيد',
      capacity: 45,
      enrolled: 28,
      location: 'مبنى الهندسة - قاعة 302'
    },
    {
      id: 4,
      code: 'CS304',
      name: 'الذكاء الاصطناعي',
      description: 'مقدمة في الذكاء الاصطناعي وتعلم الآلة',
      credits: 3,
      prerequisites: ['CS204', 'MATH201'],
      schedule: 'الأحد 10:00 - 12:00',
      instructor: 'د. أحمد فارس',
      capacity: 30,
      enrolled: 25,
      location: 'مبنى العلوم - قاعة 205'
    }
  ];

  useEffect(() => {
    // محاكاة جلب البيانات من API
    setTimeout(() => {
      setCourses(mockCourses);
      setRegisteredCourses(mockCourses.slice(0, 2)); // افتراض تسجيل مقررين
      setLoading(false);
    }, 1500);
  }, []);

  const handleRegisterCourse = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const confirmRegistration = () => {
    if (selectedCourse) {
      // التحقق من توفر الساعات
      if (registrationStatus.currentCredits + selectedCourse.credits > registrationStatus.maxCredits) {
        alert('تجاوز الحد الأقصى للساعات المسموح بها');
        return;
      }

      // إضافة المقرر للمسجلة
      setRegisteredCourses([...registeredCourses, selectedCourse]);
      
      // تحديث الساعات
      setRegistrationStatus({
        ...registrationStatus,
        currentCredits: registrationStatus.currentCredits + selectedCourse.credits,
        remainingCredits: registrationStatus.remainingCredits - selectedCourse.credits
      });

      setShowModal(false);
      alert(`تم تسجيل مقرر ${selectedCourse.name} بنجاح`);
    }
  };

  const handleDropCourse = (courseId) => {
    const courseToDrop = registeredCourses.find(c => c.id === courseId);
    if (courseToDrop && window.confirm('هل أنت متأكد من حذف هذا المقرر؟')) {
      // إزالة المقرر
      const updatedRegisteredCourses = registeredCourses.filter(c => c.id !== courseId);
      setRegisteredCourses(updatedRegisteredCourses);
      
      // تحديث الساعات
      setRegistrationStatus({
        ...registrationStatus,
        currentCredits: registrationStatus.currentCredits - courseToDrop.credits,
        remainingCredits: registrationStatus.remainingCredits + courseToDrop.credits
      });
      
      alert('تم حذف المقرر بنجاح');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* رأس الصفحة */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">تسجيل المقررات</h1>
        <p className="text-gray-600 mt-2">الفصل الدراسي الأول 2024</p>
      </div>

      {/* معلومات التسجيل */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          title="الساعات المسجلة"
          value={registrationStatus.currentCredits}
          subtitle={`من ${registrationStatus.maxCredits}`}
          icon="📊"
          color={registrationStatus.currentCredits >= registrationStatus.maxCredits ? 'red' : 'blue'}
        />
        <Card
          title="الساعات المتبقية"
          value={registrationStatus.remainingCredits}
          subtitle="ساعة"
          icon="⏳"
          color="green"
        />
        <Card
          title="المقررات المسجلة"
          value={registeredCourses.length}
          subtitle="مقرر"
          icon="📚"
          color="purple"
        />
      </div>

      {/* قسمين رئيسيين */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* المقررات المتاحة */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">المقررات المتاحة للتسجيل</h2>
          <div className="space-y-4">
            {courses.map((course) => {
              const isRegistered = registeredCourses.some(rc => rc.id === course.id);
              const isFull = course.enrolled >= course.capacity;
              
              return (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {course.code} - {course.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{course.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {course.credits} ساعات
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {course.instructor}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          {course.schedule}
                        </span>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        <span>السعة: {course.enrolled}/{course.capacity}</span>
                        <span className="mx-2">•</span>
                        <span>{course.location}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {isRegistered ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                        >
                          مسجل
                        </button>
                      ) : isFull ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg cursor-not-allowed"
                        >
                          ممتلئ
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegisterCourse(course)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                        >
                          تسجيل
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* المقررات المسجلة */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">المقررات المسجلة</h2>
            <span className="text-sm text-gray-600">
              {registeredCourses.length} من {courses.length} مقرر
            </span>
          </div>
          
          {registeredCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📚</div>
              <p>لا توجد مقررات مسجلة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {registeredCourses.map((course) => (
                <div
                  key={course.id}
                  className="border border-green-200 bg-green-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {course.code} - {course.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {course.instructor} • {course.schedule}
                      </p>
                      <div className="mt-2">
                        <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">
                          {course.credits} ساعات
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDropCourse(course.id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded text-sm transition-colors duration-200"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ملخص التسجيل */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-bold text-gray-700 mb-4">ملخص التسجيل</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">إجمالي الساعات المسجلة:</span>
                <span className="font-bold">{registrationStatus.currentCredits} ساعة</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">الحد الأقصى المسموح:</span>
                <span className="font-bold">{registrationStatus.maxCredits} ساعة</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الساعات المتبقية:</span>
                <span className="font-bold text-green-600">{registrationStatus.remainingCredits} ساعة</span>
              </div>
              
              <button
                onClick={() => navigate('/student/schedule')}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                عرض الجدول الدراسي
              </button>
              
              <button
                onClick={() => {
                  if (registeredCourses.length > 0) {
                    alert('تم تأكيد التسجيل بنجاح');
                  } else {
                    alert('يرجى تسجيل مقررات أولاً');
                  }
                }}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                disabled={registeredCourses.length === 0}
              >
                تأكيد التسجيل النهائي
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal لتأكيد التسجيل */}
      {selectedCourse && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="تأكيد تسجيل المقرر"
        >
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">{selectedCourse.code} - {selectedCourse.name}</h3>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">المدرس:</span> {selectedCourse.instructor}</p>
              <p><span className="font-medium">الوقت:</span> {selectedCourse.schedule}</p>
              <p><span className="font-medium">الساعات المعتمدة:</span> {selectedCourse.credits}</p>
              <p><span className="font-medium">المكان:</span> {selectedCourse.location}</p>
              <p><span className="font-medium">المتطلبات السابقة:</span> {selectedCourse.prerequisites.join(', ')}</p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                إلغاء
              </button>
              <button
                onClick={confirmRegistration}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                تأكيد التسجيل
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CourseRegistration;