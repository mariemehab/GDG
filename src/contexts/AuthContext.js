// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // التحقق من وجود مستخدم مسجل في localStorage
    const storedUser = localStorage.getItem('university_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType) => {
    // محاكاة طلب API للتسجيل
    // في الواقع، هنا ستكون هناك طلبات HTTP للخادم
    
    // بيانات تجريبية
    const mockUsers = {
      student: {
        id: 1,
        name: 'أحمد محمد',
        email: 'student@university.edu',
        role: 'student',
        studentId: '202310001',
        department: 'علوم الحاسب'
      },
      instructor: {
        id: 2,
        name: 'د. محمد أحمد',
        email: 'instructor@university.edu',
        role: 'instructor',
        department: 'علوم الحاسب'
      },
      admin: {
        id: 3,
        name: 'مدير النظام',
        email: 'admin@university.edu',
        role: 'admin'
      }
    };

    // محاكاة التحقق من بيانات الدخول
    if (email && password) {
      const userData = mockUsers[userType];
      if (userData) {
        localStorage.setItem('university_user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('university_user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    localStorage.setItem('university_user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};