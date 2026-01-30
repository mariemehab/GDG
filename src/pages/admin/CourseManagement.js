import React, { useState, useEffect } from 'react';
import './CourseManagement.css';

const CourseManagement = () => {
  // بيانات وهمية للمقررات
  const initialCourses = [
    { 
      id: 1, 
      code: 'CS101', 
      name: 'مقدمة في البرمجة', 
      instructor: 'د. أحمد محمد', 
      credits: 3, 
      students: 120, 
      semester: 'ربيع 2024', 
      status: 'نشط',
      schedule: 'الأحد، الثلاثاء 10:00-11:30',
      department: 'علوم الحاسب'
    },
    { 
      id: 2, 
      code: 'MATH201', 
      name: 'حساب التفاضل والتكامل', 
      instructor: 'د. سارة عبدالله', 
      credits: 4, 
      students: 150, 
      semester: 'ربيع 2024', 
      status: 'نشط',
      schedule: 'الاثنين، الأربعاء 8:00-9:30',
      department: 'الرياضيات'
    },
    { 
      id: 3, 
      code: 'PHYS101', 
      name: 'فيزياء عامة', 
      instructor: 'د. خالد حسن', 
      credits: 3, 
      students: 90, 
      semester: 'ربيع 2024', 
      status: 'نشط',
      schedule: 'السبت، الاثنين 1:00-2:30',
      department: 'الفيزياء'
    },
    { 
      id: 4, 
      code: 'ENG101', 
      name: 'لغة إنجليزية', 
      instructor: 'د. فاطمة علي', 
      credits: 2, 
      students: 200, 
      semester: 'ربيع 2024', 
      status: 'غير نشط',
      schedule: 'الثلاثاء، الخميس 3:00-4:00',
      department: 'اللغة الإنجليزية'
    },
    { 
      id: 5, 
      code: 'CS301', 
      name: 'هياكل البيانات', 
      instructor: 'د. محمد خالد', 
      credits: 3, 
      students: 80, 
      semester: 'ربيع 2024', 
      status: 'نشط',
      schedule: 'الأحد، الثلاثاء 11:00-12:30',
      department: 'علوم الحاسب'
    },
  ];

  // بيانات وهمية للمدرسين
  const instructors = [
    { id: 1, name: 'د. أحمد محمد', department: 'علوم الحاسب' },
    { id: 2, name: 'د. سارة عبدالله', department: 'الرياضيات' },
    { id: 3, name: 'د. خالد حسن', department: 'الفيزياء' },
    { id: 4, name: 'د. فاطمة علي', department: 'اللغة الإنجليزية' },
    { id: 5, name: 'د. محمد خالد', department: 'علوم الحاسب' },
  ];

  // بيانات وهمية للأقسام
  const departments = [
    'علوم الحاسب',
    'الرياضيات',
    'الفيزياء',
    'الكيمياء',
    'الهندسة',
    'اللغة الإنجليزية',
    'إدارة الأعمال'
  ];

  const [courses, setCourses] = useState(initialCourses);
  const [filteredCourses, setFilteredCourses] = useState(initialCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('الكل');
  const [selectedSemester, setSelectedSemester] = useState('الكل');
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    instructor: '',
    credits: 3,
    semester: 'ربيع 2024',
    schedule: '',
    department: 'علوم الحاسب'
  });

  // الفصول الدراسية
  const semesters = [
    'الكل',
    'ربيع 2024',
    'خريف 2023',
    'ربيع 2023',
    'صيف 2024'
  ];

  // تصفية المقررات
  useEffect(() => {
    let filtered = courses;
    
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedDepartment !== 'الكل') {
      filtered = filtered.filter(course => course.department === selectedDepartment);
    }
    
    if (selectedSemester !== 'الكل') {
      filtered = filtered.filter(course => course.semester === selectedSemester);
    }
    
    setFilteredCourses(filtered);
  }, [searchTerm, selectedDepartment, selectedSemester, courses]);

  const handleEdit = (course) => {
    setEditingCourse({...course});
  };

  const handleSaveEdit = () => {
    if (editingCourse) {
      setCourses(courses.map(course => 
        course.id === editingCourse.id ? editingCourse : course
      ));
      setEditingCourse(null);
    }
  };

  const handleDelete = (courseId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقرر؟ سيتم حذف جميع بيانات المقرر.')) {
      setCourses(courses.filter(course => course.id !== courseId));
    }
  };

  const handleAddCourse = () => {
    if (newCourse.code && newCourse.name && newCourse.instructor) {
      const courseToAdd = {
        id: courses.length + 1,
        ...newCourse,
        students: 0,
        status: 'نشط'
      };
      setCourses([...courses, courseToAdd]);
      setNewCourse({
        code: '',
        name: '',
        instructor: '',
        credits: 3,
        semester: 'ربيع 2024',
        schedule: '',
        department: 'علوم الحاسب'
      });
      alert('تم إضافة المقرر بنجاح!');
    } else {
      alert('يرجى ملء جميع الحقول المطلوبة');
    }
  };

  const toggleCourseStatus = (courseId) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, status: course.status === 'نشط' ? 'غير نشط' : 'نشط' }
        : course
    ));
  };

  // إحصائيات
  const stats = {
    totalCourses: courses.length,
    activeCourses: courses.filter(c => c.status === 'نشط').length,
    totalStudents: courses.reduce((sum, course) => sum + course.students, 0),
    averageStudents: courses.length > 0 ? Math.round(courses.reduce((sum, course) => sum + course.students, 0) / courses.length) : 0
  };

  return (
    <div className="course-management">
      {/* رأس الصفحة */}
      <div className="course-header">
        <div className="header-content">
          <h1>إدارة المقررات الدراسية</h1>
          <p>إدارة وتعديل المقررات الدراسية في النظام</p>
        </div>
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-number">{stats.totalCourses}</span>
            <span className="stat-label">إجمالي المقررات</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.activeCourses}</span>
            <span className="stat-label">مقررات نشطة</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.totalStudents}</span>
            <span className="stat-label">طالب مسجل</span>
          </div>
        </div>
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="filter-controls">
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="ابحث عن مقرر، رمز، أو مدرس..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        
        <div className="filter-options">
          <div className="filter-group">
            <label>القسم:</label>
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="الكل">الكل</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>الفصل:</label>
            <select 
              value={selectedSemester} 
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              {semesters.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="btn-reset"
            onClick={() => {
              setSearchTerm('');
              setSelectedDepartment('الكل');
              setSelectedSemester('الكل');
            }}
          >
            ❌ إعادة التعيين
          </button>
        </div>
      </div>

      {/* نموذج إضافة مقرر جديد */}
      <div className="add-course-section">
        <h3>إضافة مقرر جديد</h3>
        <div className="add-course-form">
          <div className="form-grid">
            <div className="form-group">
              <label>رمز المقرر *</label>
              <input
                type="text"
                value={newCourse.code}
                onChange={(e) => setNewCourse({...newCourse, code: e.target.value.toUpperCase()})}
                placeholder="مثال: CS101"
              />
            </div>
            
            <div className="form-group">
              <label>اسم المقرر *</label>
              <input
                type="text"
                value={newCourse.name}
                onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                placeholder="اسم المقرر بالكامل"
              />
            </div>
            
            <div className="form-group">
              <label>المدرس *</label>
              <select
                value={newCourse.instructor}
                onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
              >
                <option value="">اختر المدرس</option>
                {instructors.map(instructor => (
                  <option key={instructor.id} value={instructor.name}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>الساعات المعتمدة</label>
              <select
                value={newCourse.credits}
                onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value)})}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} ساعات</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>القسم</label>
              <select
                value={newCourse.department}
                onChange={(e) => setNewCourse({...newCourse, department: e.target.value})}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>الفصل الدراسي</label>
              <select
                value={newCourse.semester}
                onChange={(e) => setNewCourse({...newCourse, semester: e.target.value})}
              >
                {semesters.filter(s => s !== 'الكل').map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>الجدول الزمني</label>
              <input
                type="text"
                value={newCourse.schedule}
                onChange={(e) => setNewCourse({...newCourse, schedule: e.target.value})}
                placeholder="مثال: الأحد، الثلاثاء 10:00-11:30"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button onClick={handleAddCourse} className="btn-add-course">
              ➕ إضافة المقرر
            </button>
          </div>
        </div>
      </div>

      {/* جدول المقررات */}
      <div className="courses-table-section">
        <div className="section-header">
          <h3>قائمة المقررات ({filteredCourses.length})</h3>
          <div className="actions">
            <button className="btn-export">
              📥 تصدير البيانات
            </button>
          </div>
        </div>
        
        <div className="table-container">
          <table className="courses-table">
            <thead>
              <tr>
                <th>#</th>
                <th>رمز المقرر</th>
                <th>اسم المقرر</th>
                <th>المدرس</th>
                <th>القسم</th>
                <th>الساعات</th>
                <th>الطلاب</th>
                <th>الفصل</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, index) => (
                <tr key={course.id}>
                  <td>{index + 1}</td>
                  <td>
                    {editingCourse?.id === course.id ? (
                      <input
                        value={editingCourse.code}
                        onChange={(e) => setEditingCourse({...editingCourse, code: e.target.value})}
                      />
                    ) : (
                      <span className="course-code">{course.code}</span>
                    )}
                  </td>
                  <td>
                    {editingCourse?.id === course.id ? (
                      <input
                        value={editingCourse.name}
                        onChange={(e) => setEditingCourse({...editingCourse, name: e.target.value})}
                      />
                    ) : (
                      <strong>{course.name}</strong>
                    )}
                  </td>
                  <td>
                    {editingCourse?.id === course.id ? (
                      <select
                        value={editingCourse.instructor}
                        onChange={(e) => setEditingCourse({...editingCourse, instructor: e.target.value})}
                      >
                        {instructors.map(instructor => (
                          <option key={instructor.id} value={instructor.name}>
                            {instructor.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      course.instructor
                    )}
                  </td>
                  <td>{course.department}</td>
                  <td>
                    {editingCourse?.id === course.id ? (
                      <select
                        value={editingCourse.credits}
                        onChange={(e) => setEditingCourse({...editingCourse, credits: parseInt(e.target.value)})}
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="credits-badge">{course.credits} ساعات</span>
                    )}
                  </td>
                  <td>
                    <div className="students-cell">
                      <span className="students-count">{course.students}</span>
                      <span className="students-label">طالب</span>
                    </div>
                  </td>
                  <td>{course.semester}</td>
                  <td>
                    <span className={`status-badge ${course.status === 'نشط' ? 'active' : 'inactive'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {editingCourse?.id === course.id ? (
                      <div className="edit-actions">
                        <button onClick={handleSaveEdit} className="btn-save">
                          💾 حفظ
                        </button>
                        <button onClick={() => setEditingCourse(null)} className="btn-cancel">
                          ❌ إلغاء
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(course)} className="btn-edit">
                          ✏️ تعديل
                        </button>
                        <button 
                          onClick={() => toggleCourseStatus(course.id)} 
                          className={`btn-toggle ${course.status === 'نشط' ? 'deactivate' : 'activate'}`}
                        >
                          {course.status === 'نشط' ? '❌ تعطيل' : '✅ تفعيل'}
                        </button>
                        <button onClick={() => handleDelete(course.id)} className="btn-delete">
                          🗑️ حذف
                        </button>
                        <button className="btn-view" title="عرض التفاصيل">
                          👁️
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCourses.length === 0 && (
            <div className="no-courses">
              <p>📭 لا توجد مقررات مطابقة للبحث</p>
            </div>
          )}
        </div>
      </div>

      {/* إحصائيات مفصلة */}
      <div className="detailed-stats">
        <div className="stats-card">
          <h4>توزيع المقررات حسب القسم</h4>
          <div className="department-stats">
            {departments.map(dept => {
              const count = courses.filter(c => c.department === dept).length;
              if (count === 0) return null;
              
              return (
                <div key={dept} className="department-item">
                  <div className="dept-name">{dept}</div>
                  <div className="dept-bar">
                    <div 
                      className="dept-fill" 
                      style={{width: `${(count / courses.length) * 100}%`}}
                    ></div>
                  </div>
                  <div className="dept-count">{count} مقرر</div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="stats-card">
          <h4>المدرسين الأكثر نشاطاً</h4>
          <div className="instructors-stats">
            {instructors.map(instructor => {
              const courseCount = courses.filter(c => c.instructor === instructor.name).length;
              if (courseCount === 0) return null;
              
              return (
                <div key={instructor.id} className="instructor-item">
                  <div className="instructor-info">
                    <span className="instructor-avatar">👨‍🏫</span>
                    <span>{instructor.name}</span>
                  </div>
                  <div className="instructor-courses">
                    <span className="course-count">{courseCount} مقرر</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ملاحظات مهمة */}
      <div className="notes-section">
        <h4>ملاحظات مهمة:</h4>
        <ul>
          <li>📌 يمكنك إضافة مقررات جديدة باستخدام النموذج أعلاه</li>
          <li>⚠️ عند حذف مقرر، سيتم حذف جميع البيانات المرتبطة به</li>
          <li>🔔 المقررات غير النشطة لن تظهر للطلاب للتسجيل</li>
          <li>📊 يمكنك تصدير بيانات المقررات باستخدام زر "تصدير البيانات"</li>
        </ul>
      </div>
    </div>
  );
};

export default CourseManagement;
