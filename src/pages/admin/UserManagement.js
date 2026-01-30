import React, { useState, useEffect } from 'react';
import './UserManagement.css'; // ستحتاج لإنشاء هذا الملف للتنسيق

const UserManagement = () => {
  // بيانات وهمية للمستخدمين
  const initialUsers = [
    { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', role: 'طالب', status: 'نشط' },
    { id: 2, name: 'سارة عبدالله', email: 'sara@example.com', role: 'مدرس', status: 'نشط' },
    { id: 3, name: 'محمد خالد', email: 'mohammed@example.com', role: 'مسؤول', status: 'نشط' },
    { id: 4, name: 'فاطمة علي', email: 'fatima@example.com', role: 'طالب', status: 'غير نشط' },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('الكل');
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'طالب' });

  // تصفية المستخدمين بناءً على البحث والدور
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'الكل' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSaveEdit = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setEditingUser(null);
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const userToAdd = {
        id: users.length + 1,
        ...newUser,
        status: 'نشط'
      };
      setUsers([...users, userToAdd]);
      setNewUser({ name: '', email: '', role: 'طالب' });
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'نشط' ? 'غير نشط' : 'نشط' }
        : user
    ));
  };

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1>إدارة المستخدمين</h1>
        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="ابحث عن مستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value)}
            className="role-filter"
          >
            <option value="الكل">الكل</option>
            <option value="طالب">طالب</option>
            <option value="مدرس">مدرس</option>
            <option value="مسؤول">مسؤول</option>
          </select>
        </div>
      </div>

      {/* نموذج إضافة مستخدم جديد */}
      <div className="add-user-form">
        <h3>إضافة مستخدم جديد</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="الاسم الكامل"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
          >
            <option value="طالب">طالب</option>
            <option value="مدرس">مدرس</option>
            <option value="مسؤول">مسؤول</option>
          </select>
          <button onClick={handleAddUser} className="btn-add">
            إضافة مستخدم
          </button>
        </div>
      </div>

      {/* جدول المستخدمين */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>الدور</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>
                  {editingUser?.id === user.id ? (
                    <input
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUser?.id === user.id ? (
                    <input
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser?.id === user.id ? (
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    >
                      <option value="طالب">طالب</option>
                      <option value="مدرس">مدرس</option>
                      <option value="مسؤول">مسؤول</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  <span className={`status-badge ${user.status === 'نشط' ? 'active' : 'inactive'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="actions">
                  {editingUser?.id === user.id ? (
                    <>
                      <button onClick={handleSaveEdit} className="btn-save">💾 حفظ</button>
                      <button onClick={() => setEditingUser(null)} className="btn-cancel">❌ إلغاء</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(user)} className="btn-edit">✏️ تعديل</button>
                      <button onClick={() => toggleUserStatus(user.id)} className="btn-toggle">
                        {user.status === 'نشط' ? '❌ تعطيل' : '✅ تفعيل'}
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="btn-delete">🗑️ حذف</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="no-users">
            <p>لا يوجد مستخدمين مطابقين للبحث</p>
          </div>
        )}
      </div>

      <div className="stats">
        <div className="stat-card">
          <h4>إجمالي المستخدمين</h4>
          <p>{users.length}</p>
        </div>
        <div className="stat-card">
          <h4>الطلاب</h4>
          <p>{users.filter(u => u.role === 'طالب').length}</p>
        </div>
        <div className="stat-card">
          <h4>المدرسون</h4>
          <p>{users.filter(u => u.role === 'مدرس').length}</p>
        </div>
        <div className="stat-card">
          <h4>النشطين</h4>
          <p>{users.filter(u => u.status === 'نشط').length}</p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;