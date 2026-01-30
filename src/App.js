import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import AdminDashboard from './pages/admin/AdminDashboard'
// صفحات المصادقة
import Login from './pages/auth/login';

// صفحات الطالب
import StudentDashboard from './pages/student/Dashboard';
import CourseRegistration from './pages/student/CourseRegistration';
import Profile from './pages/student/Profile'; // تم التصحيح هنا
import Grades from './pages/student/Grades';
import Schedule from './pages/student/Schedule';
//صفحات المدرس
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorCourses from './pages/instructor/InstructorCourses';
import InstructorGrades from './pages/instructor/InstructorGrades';
// CSS
import './App.css';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';
import CourseManagement from './pages/admin/CourseManagement';
import AdminProfile from './pages/admin/Profile';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              {/* الصفحة الرئيسية */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* صفحات المصادقة */}
              <Route path="/login" element={<Login />} />

              {/* صفحات الطالب */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/student/registration"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <CourseRegistration />
                  </ProtectedRoute>
                }
              />

              {/* صفحة الملف الشخصي - تمت الإضافة */}
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              {/* صفحة جدولي الدراسي */}
              <Route
                path="/student/schedule"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Schedule />
                  </ProtectedRoute>
                }
              />

              {/* صفحة الدرجات */}
              <Route
                path="/student/grades"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Grades />
                  </ProtectedRoute>
                }
              />
              {/* صفحات المدرب */}
              <Route
                path="/instructor"
                element={
                  <ProtectedRoute allowedRoles={['instructor']}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/instructor/courses"
                element={
                  <ProtectedRoute allowedRoles={['instructor']}>
                    <InstructorCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              {/* صفحات المدير */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <CourseManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />


              <Route
                path="/instructor/grades"
                element={
                  <ProtectedRoute allowedRoles={['instructor']}>
                    <InstructorGrades />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminProfile />
                  </ProtectedRoute>
                }
              />

              {/* صفحة 404 */}
              <Route
                path="*"
                element={
                  <div className="text-center py-20">
                    <h1 className="text-4xl font-bold text-red-600">404</h1>
                    <p className="text-gray-600 mt-2">الصفحة غير موجودة</p>
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;