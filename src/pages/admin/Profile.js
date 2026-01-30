import React, { useState } from 'react';
import './Profile.css';

const AdminProfile = () => {
  // بيانات المدير
  const [adminData, setAdminData] = useState({
    id: 'ADM001',
    name: 'أحمد محمود',
    email: 'ahmed.admin@university.edu',
    phone: '+966 50 123 4567',
    department: 'الإدارة العامة',
    position: 'مدير النظام',
    joinDate: '2020-01-15',
    status: 'نشط',
    bio: 'مدير النظام الجامعي المسؤول عن إدارة المستخدمين والمقررات والتقارير في المنصة.',
    avatar: null
  });

  // بيانات الحساب
  const [accountInfo, setAccountInfo] = useState({
    username: 'admin_ahmed',
    lastLogin: '2024-01-30 14:30:00',
    loginCount: 1245,
    permissions: ['إدارة المستخدمين', 'إدارة المقررات', 'عرض التقارير', 'إدارة النظام']
  });

  // حالة التعديل
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({...adminData});
  const [activeTab, setActiveTab] = useState('info');

  const handleEdit = () => {
    setEditData({...adminData});
    setIsEditing(true);
  };

  const handleSave = () => {
    setAdminData({...editData});
    setIsEditing(false);
    alert('تم حفظ التغييرات بنجاح!');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({...editData, avatar: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = () => {
    const oldPassword = prompt('أدخل كلمة المرور الحالية:');
    const newPassword = prompt('أدخل كلمة المرور الجديدة:');
    const confirmPassword = prompt('أكد كلمة المرور الجديدة:');
    
    if (newPassword === confirmPassword) {
      alert('تم تغيير كلمة المرور بنجاح!');
    } else {
      alert('كلمة المرور غير متطابقة!');
    }
  };

  // بيانات الأنشطة الحديثة
  const recentActivities = [
    { id: 1, action: 'إضافة مستخدم جديد', date: '2024-01-30 10:15', type: 'user' },
    { id: 2, action: 'تعديل مقرر دراسي', date: '2024-01-29 14:30', type: 'course' },
    { id: 3, action: 'إنشاء تقرير شهري', date: '2024-01-28 09:45', type: 'report' },
    { id: 4, action: 'تعطيل حساب مستخدم', date: '2024-01-27 16:20', type: 'user' },
    { id: 5, action: 'تحديث بيانات النظام', date: '2024-01-26 11:10', type: 'system' },
  ];

  // الإحصائيات
  const adminStats = {
    totalActions: 1245,
    usersManaged: 85,
    coursesManaged: 25,
    reportsGenerated: 42,
    activeSessions: 3
  };

  return (
    <div className="admin-profile-container">
      {/* رأس الصفحة */}
      <div className="profile-header">
        <div className="header-content">
          <h1>👨‍💼 الملف الشخصي للمدير</h1>
          <p>إدارة معلومات حسابك الشخصي وإعدادات النظام</p>
        </div>
        
        <div className="header-actions">
          <button 
            onClick={isEditing ? handleSave : handleEdit}
            className={`btn ${isEditing ? 'btn-success' : 'btn-primary'}`}
          >
            {isEditing ? '💾 حفظ التغييرات' : '✏️ تعديل الملف'}
          </button>
          
          {isEditing && (
            <button onClick={handleCancel} className="btn btn-secondary">
              ❌ إلغاء
            </button>
          )}
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="profile-content">
        {/* الشريط الجانبي */}
        <div className="profile-sidebar">
          <div className="avatar-section">
            <div className="avatar-container">
              {editData.avatar ? (
                <img src={editData.avatar} alt="Avatar" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  {adminData.name.charAt(0)}
                </div>
              )}
              
              {isEditing && (
                <div className="avatar-upload">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="avatar-upload" className="upload-btn">
                    📷 تغيير الصورة
                  </label>
                </div>
              )}
            </div>
            
            <div className="admin-info">
              <h3>{adminData.name}</h3>
              <p className="admin-position">{adminData.position}</p>
              <p className="admin-department">{adminData.department}</p>
              <p className="admin-id">ID: {adminData.id}</p>
            </div>
          </div>

          {/* قائمة التبويبات */}
          <div className="sidebar-tabs">
            <button 
              className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              👤 المعلومات الشخصية
            </button>
            
            <button 
              className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              🔐 معلومات الحساب
            </button>
            
            <button 
              className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              🛡️ الأمان
            </button>
            
            <button 
              className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              📋 الأنشطة
            </button>
            
            <button 
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ الإعدادات
            </button>
          </div>

          {/* الإحصائيات */}
          <div className="sidebar-stats">
            <h4>📊 إحصائيات المدير</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{adminStats.totalActions}</span>
                <span className="stat-label">إجمالي الإجراءات</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-number">{adminStats.usersManaged}</span>
                <span className="stat-label">مستخدم تم إدارته</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-number">{adminStats.coursesManaged}</span>
                <span className="stat-label">مقرر تم إدارته</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-number">{adminStats.reportsGenerated}</span>
                <span className="stat-label">تقرير تم إنشاؤه</span>
              </div>
            </div>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="profile-main">
          {/* تبويب المعلومات الشخصية */}
          {activeTab === 'info' && (
            <div className="tab-content">
              <div className="section-header">
                <h3>👤 المعلومات الشخصية</h3>
                <p>إدارة معلوماتك الشخصية والاتصال</p>
              </div>
              
              <div className="info-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>الاسم الكامل *</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{adminData.name}</p>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>البريد الإلكتروني *</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{adminData.email}</p>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>رقم الهاتف</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{adminData.phone}</p>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>القسم</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.department}
                        onChange={(e) => setEditData({...editData, department: e.target.value})}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{adminData.department}</p>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>المنصب الوظيفي</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.position}
                        onChange={(e) => setEditData({...editData, position: e.target.value})}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{adminData.position}</p>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>تاريخ الانضمام</label>
                    <p className="form-value">{adminData.joinDate}</p>
                  </div>
                  
                  <div className="form-group">
                    <label>حالة الحساب</label>
                    <span className={`status-badge ${adminData.status === 'نشط' ? 'active' : 'inactive'}`}>
                      {adminData.status}
                    </span>
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label>نبذة عن المدير</label>
                  {isEditing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
                      className="form-textarea"
                      rows="4"
                    />
                  ) : (
                    <p className="form-value bio-text">{adminData.bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* تبويب معلومات الحساب */}
          {activeTab === 'account' && (
            <div className="tab-content">
              <div className="section-header">
                <h3>🔐 معلومات الحساب</h3>
                <p>إدارة إعدادات الحساب والمعلومات</p>
              </div>
              
              <div className="account-info">
                <div className="info-grid">
                  <div className="info-item">
                    <label>اسم المستخدم</label>
                    <p className="info-value">{accountInfo.username}</p>
                  </div>
                  
                  <div className="info-item">
                    <label>آخر تسجيل دخول</label>
                    <p className="info-value">{accountInfo.lastLogin}</p>
                  </div>
                  
                  <div className="info-item">
                    <label>عدد مرات التسجيل</label>
                    <p className="info-value">{accountInfo.loginCount}</p>
                  </div>
                  
                  <div className="info-item">
                    <label>الجلسات النشطة</label>
                    <p className="info-value">{adminStats.activeSessions} جلسة</p>
                  </div>
                </div>
                
                <div className="permissions-section">
                  <h4>🛡️ صلاحيات المدير</h4>
                  <div className="permissions-grid">
                    {accountInfo.permissions.map((permission, index) => (
                      <div key={index} className="permission-item">
                        <span className="permission-icon">✅</span>
                        <span>{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* تبويب الأمان */}
          {activeTab === 'security' && (
            <div className="tab-content">
              <div className="section-header">
                <h3>🛡️ الأمان</h3>
                <p>إدارة إعدادات الأمان وكلمة المرور</p>
              </div>
              
              <div className="security-settings">
                <div className="security-card">
                  <h4>🔐 كلمة المرور</h4>
                  <p>قم بتغيير كلمة المرور الخاصة بك بانتظام للحفاظ على أمان حسابك</p>
                  <button onClick={handleChangePassword} className="btn btn-primary">
                    🔄 تغيير كلمة المرور
                  </button>
                </div>
                
                <div className="security-card">
                  <h4>🔒 المصادقة الثنائية</h4>
                  <p>إضافة طبقة إضافية من الأمان لحسابك</p>
                  <div className="toggle-section">
                    <span>تمكين المصادقة الثنائية</span>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="security-card">
                  <h4>📧 تنبيهات الأمان</h4>
                  <p>تلقي تنبيهات عند حدوث نشاط غير معتاد</p>
                  <div className="notifications-list">
                    <div className="notification-item">
                      <label>تسجيل دخول جديد</label>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="notification-item">
                      <label>تغيير كلمة المرور</label>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="notification-item">
                      <label>أنشطة غير معتادة</label>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="security-card">
                  <h4>🌐 جلسات تسجيل الدخول</h4>
                  <p>إدارة الجلسات النشطة على حسابك</p>
                  <div className="sessions-list">
                    <div className="session-item">
                      <div className="session-info">
                        <strong>متصفح Chrome - Windows</strong>
                        <small>IP: 192.168.1.100 - نشط الآن</small>
                      </div>
                      <button className="btn btn-danger btn-sm">تسجيل الخروج</button>
                    </div>
                  </div>
                  <button className="btn btn-secondary">تسجيل الخروج من جميع الأجهزة</button>
                </div>
              </div>
            </div>
          )}

          {/* تبويب الأنشطة */}
          {activeTab === 'activity' && (
            <div className="tab-content">
              <div className="section-header">
                <h3>📋 الأنشطة الحديثة</h3>
                <p>سجل أنشطتك وإجراءاتك في النظام</p>
              </div>
              
              <div className="activity-list">
                <div className="table-responsive">
                  <table className="activity-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>الإجراء</th>
                        <th>التاريخ والوقت</th>
                        <th>النوع</th>
                        <th>الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.map((activity) => (
                        <tr key={activity.id}>
                          <td>{activity.id}</td>
                          <td>
                            <div className="activity-action">
                              <span className={`activity-icon ${activity.type}`}>
                                {activity.type === 'user' ? '👤' : 
                                 activity.type === 'course' ? '📚' : 
                                 activity.type === 'report' ? '📊' : '⚙️'}
                              </span>
                              {activity.action}
                            </div>
                          </td>
                          <td>{activity.date}</td>
                          <td>
                            <span className={`type-badge ${activity.type}`}>
                              {activity.type === 'user' ? 'مستخدم' : 
                               activity.type === 'course' ? 'مقرر' : 
                               activity.type === 'report' ? 'تقرير' : 'نظام'}
                            </span>
                          </td>
                          <td>
                            <span className="status-badge completed">مكتمل</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="activity-stats">
                  <div className="stat-card">
                    <h5>إجمالي الإجراءات اليوم</h5>
                    <p className="stat-number">12</p>
                  </div>
                  
                  <div className="stat-card">
                    <h5>إجمالي الإجراءات الأسبوعية</h5>
                    <p className="stat-number">85</p>
                  </div>
                  
                  <div className="stat-card">
                    <h5>إجمالي الإجراءات الشهرية</h5>
                    <p className="stat-number">324</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* تبويب الإعدادات */}
          {activeTab === 'settings' && (
            <div className="tab-content">
              <div className="section-header">
                <h3>⚙️ إعدادات النظام</h3>
                <p>تخصيص إعدادات النظام حسب تفضيلاتك</p>
              </div>
              
              <div className="settings-grid">
                <div className="settings-card">
                  <h4>🎨 المظهر</h4>
                  <div className="theme-options">
                    <button className="theme-option active">
                      <div className="theme-preview light"></div>
                      <span>فاتح</span>
                    </button>
                    <button className="theme-option">
                      <div className="theme-preview dark"></div>
                      <span>داكن</span>
                    </button>
                    <button className="theme-option">
                      <div className="theme-preview auto"></div>
                      <span>تلقائي</span>
                    </button>
                  </div>
                </div>
                
                <div className="settings-card">
                  <h4>🔔 الإشعارات</h4>
                  <div className="settings-list">
                    <div className="setting-item">
                      <label>إشعارات البريد الإلكتروني</label>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="setting-item">
                      <label>إشعارات النظام</label>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="setting-item">
                      <label>إشعارات الهاتف</label>
                      <input type="checkbox" />
                    </div>
                  </div>
                </div>
                
                <div className="settings-card">
                  <h4>🌐 اللغة</h4>
                  <select className="language-select">
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div className="settings-card">
                  <h4>📅 التوقيت</h4>
                  <select className="timezone-select">
                    <option value="+3">توقيت الرياض (UTC+3)</option>
                    <option value="+0">توقيت غرينتش (UTC+0)</option>
                  </select>
                </div>
                
                <div className="settings-card">
                  <h4>📁 البيانات</h4>
                  <div className="data-options">
                    <button className="btn btn-secondary">📥 تصدير البيانات</button>
                    <button className="btn btn-secondary">🗑️ حذف البيانات المؤقتة</button>
                  </div>
                </div>
                
                <div className="settings-card">
                  <h4>⚠️ إعدادات متقدمة</h4>
                  <div className="advanced-settings">
                    <button className="btn btn-danger">إعادة تعيين الإعدادات</button>
                    <button className="btn btn-danger">تعطيل الحساب</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;