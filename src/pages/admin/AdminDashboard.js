import React, { useState } from 'react';
import './AdminDashboard.css';

// استيراد الصفحات
import CourseManagement from './CourseManagement';
import UserManagement from './UserManagement';
import Reports from './Reports';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="admin-dashboard">
      {/* ===== Header ===== */}
      <div className="dashboard-intro">
        <h1>لوحة تحكم الإدارة</h1>
        
      </div>

      {/* ===== Tabs ===== */}
      <div className="admin-tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 نظرة عامة
        </button>

        <button
          className={activeTab === 'courses' ? 'active' : ''}
          onClick={() => setActiveTab('courses')}
        >
          📚 المقررات
        </button>

        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 المستخدمين
        </button>

        <button
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          📈 التقارير
        </button>
      </div>

      {/* ===== Content ===== */}
      <div className="admin-content">
        {/* ================= DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <>
            <div className="quick-stats">
              <div
                className="stat-card"
                onClick={() => setActiveTab('courses')}
              >
                <h3>المقررات</h3>
                <div className="stat-number">📚</div>
                <p>إدارة كاملة للمقررات الدراسية</p>
              </div>

              <div
                className="stat-card"
                onClick={() => setActiveTab('users')}
              >
                <h3>المستخدمين</h3>
                <div className="stat-number">👥</div>
                <p>إضافة وتعديل الطلاب والمدرسين</p>
              </div>

              <div
                className="stat-card"
                onClick={() => setActiveTab('reports')}
              >
                <h3>التقارير</h3>
                <div className="stat-number">📊</div>
                <p>إحصائيات ورسوم بيانية</p>
              </div>

              <div className="stat-card">
                <h3>حالة النظام</h3>
                <div className="stat-number">🟢</div>
                <p>النظام يعمل بكفاءة</p>
              </div>
            </div>

            
          </>
        )}

        {/* ================= COURSES ================= */}
        {activeTab === 'courses' && <CourseManagement />}

        {/* ================= USERS ================= */}
        {activeTab === 'users' && <UserManagement />}

        {/* ================= REPORTS ================= */}
        {activeTab === 'reports' && <Reports />}
      </div>
      {/* ================= DASHBOARD ================= */}
{activeTab === 'dashboard' && (
  <>
    <div className="quick-stats">
      {/* بطاقات الإحصائيات كما كانت */}
      ...
    </div>

   

    {/* ===== قسم الأخبار ===== */}
    <div className="dashboard-news">
      <h2>آخر الأخبار والإعلانات</h2>
      <ul>
        <li>📢 بداية تسجيل الطلاب للفصل الدراسي الجديد 2026-2027</li>
        <li>📢 سيتم صيانة النظام يوم الجمعة من الساعة 10 صباحًا حتى 2 ظهرًا</li>
        <li>📢 دورة تدريبية للمدرسين حول تحديث المنهج يوم 5 فبراير</li>
      </ul>
    </div>

    {/* ===== قسم المهام القادمة ===== */}
    <div className="dashboard-tasks">
      <h2>المهام القادمة</h2>
      <ul>
        <li>📝 مراجعة المقررات وإضافة جدول الامتحانات</li>
        <li>📝 تحديث بيانات المستخدمين الجدد</li>
        <li>📝 تحليل تقارير الأداء للفصل الحالي</li>
      </ul>
    </div>
  </>
)}

      {/* ===== Footer ===== */}
      <div className="dashboard-footer">
        © 2026 University Management System – Admin Panel
      </div>
    </div>
  );
};

export default AdminDashboard;
