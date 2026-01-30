import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(3);
  
  const notificationsRef = useRef(null);
  const searchRef = useRef(null);

  // بيانات الإشعارات الافتراضية
  const defaultNotifications = [
    { id: 1, title: 'موعد تسجيل المقررات', message: 'تبدأ فترة التسجيل غداً', time: 'منذ ساعتين', read: false, type: 'warning' },
    { id: 2, title: 'درجة جديدة', message: 'تم رفع درجة مقرر قواعد البيانات', time: 'منذ يوم', read: false, type: 'success' },
    { id: 3, title: 'محاضرة ملغاة', message: 'محاضرة الفيزياء يوم الخميس ملغاة', time: 'منذ 3 أيام', read: true, type: 'danger' },
    { id: 4, title: 'تذكير دفع رسوم', message: 'آخر موعد لدفع الرسوم 15 يونيو', time: 'منذ أسبوع', read: true, type: 'info' },
  ];

  // عمليات البحث السريع
  const quickSearchItems = [
    { id: 1, name: 'الدرجات', path: '/student/grades', icon: '📊' },
    { id: 2, name: 'جدولي الدراسي', path: '/student/schedule', icon: '📅' },
    { id: 3, name: 'تسجيل المقررات', path: '/student/registration', icon: '📝' },
    { id: 4, name: 'الملف الشخصي', path: '/student/profile', icon: '👤' },
    { id: 5, name: 'المقررات المتاحة', path: '/student/courses', icon: '📚' },
    { id: 6, name: 'الوظائف والواجبات', path: '/student/assignments', icon: '📋' },
  ];

  useEffect(() => {
    // تحميل الإشعارات
    setNotifications(defaultNotifications);
    
    // حساب عدد الإشعارات غير المقروءة
    const unread = defaultNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);

    // إغلاق القوائم عند النقر خارجها
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    const unread = updatedNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // بحث افتراضي - في التطبيق الحقيقي هنا بيكون فيه منطق بحث
      navigate('/student');
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleQuickSearchClick = (path) => {
    navigate(path);
    setShowSearch(false);
    setSearchQuery('');
  };

  // تحديد الروست حسب نوع المستخدم
  const getNavLinks = () => {
    if (!user) return [];
    
    switch(user.role) {
      case 'student':
        return [
          { name: 'الرئيسية', path: '/student', icon: '🏠' },
          { name: 'تسجيل المقررات', path: '/student/registration', icon: '📝' },
          { name: 'جدولي الدراسي', path: '/student/schedule', icon: '📅' },
          { name: 'الدرجات', path: '/student/grades', icon: '📊' },
          { name: 'الملف الشخصي', path: '/student/profile', icon: '👤' },
        ];
      case 'instructor':
        return [
          { name: 'الرئيسية', path: '/instructor', icon: '🏠' },
          { name: 'مقرراتي', path: '/instructor/courses', icon: '📚' },
          { name: 'إدخال الدرجات', path: '/instructor/grades', icon: '📊' },
          { name: 'الملف الشخصي', path: '/instructor/profile', icon: '👤' },
        ];
      case 'admin':
        return [
          { name: 'الرئيسية', path: '/admin', icon: '🏠' },
          { name: 'إدارة المستخدمين', path: '/admin/users', icon: '👥' },
          { name: 'إدارة المقررات', path: '/admin/courses', icon: '📚' },
          { name: 'التقارير', path: '/admin/reports', icon: '📈' },
          { name: 'الملف الشخصي', path: '/admin/profile', icon: '👤' },
        ];
      default:
        return [];
    }
  };

  // الحصول على لون حسب نوع الإشعار
  const getNotificationColor = (type) => {
    switch(type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'danger': return 'bg-red-100 text-red-800 border-red-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* الشعار والبحث */}
          <div className="flex items-center space-x-4">
            {/* الشعار */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-blue-800 font-bold text-lg">U</span>
              </div>
              <Link to="/" className="text-xl font-bold hidden md:block">
                النظام الجامعي
              </Link>
            </div>

            {/* زر البحث (للشاشات الصغيرة) */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 hover:bg-blue-700 rounded-full transition-colors"
              title="بحث"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* روست التنقل (للشاشات الكبيرة) */}
          <div className="hidden md:flex items-center space-x-1">
            {getNavLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center space-x-2 px-4 py-2 hover:bg-blue-700/50 rounded-xl transition-all duration-200 group"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="font-medium">{link.name}</span>
                <div className="h-0.5 w-0 group-hover:w-full bg-white transition-all duration-300"></div>
              </Link>
            ))}
          </div>

          {/* الجزء الأيمن: أدوات المستخدم */}
          <div className="flex items-center space-x-2">
            
            {/* شريط البحث (للشاشات الكبيرة) */}
            <div className="hidden md:block relative" ref={searchRef}>
              <div className="relative">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="بحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearch(true)}
                    className="w-48 lg:w-64 px-4 py-2 pr-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />
                  <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
                
                {/* نتائج البحث السريع */}
                {showSearch && searchQuery && (
                  <div className="absolute top-full mt-2 w-64 lg:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm text-gray-600">نتائج سريعة لـ: <span className="font-bold">{searchQuery}</span></p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {quickSearchItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleQuickSearchClick(item.path)}
                          className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 text-right transition-colors"
                        >
                          <span className="text-xl">{item.icon}</span>
                          <div className="flex-grow">
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.path}</p>
                          </div>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* زر الإشعارات */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-blue-700 rounded-full transition-colors relative"
                title="الإشعارات"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                
                {/* مؤشر الإشعارات غير المقروءة */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* قائمة الإشعارات */}
              {showNotifications && (
                <div className="absolute left-0 md:right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  {/* رأس الإشعارات */}
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">الإشعارات</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        تعليم الكل كمقروء
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        الإعدادات
                      </button>
                    </div>
                  </div>

                  {/* قائمة الإشعارات */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-gray-800">{notification.title}</h4>
                                <span className={`px-2 py-1 text-xs rounded-full ${getNotificationColor(notification.type)}`}>
                                  {notification.type === 'success' && 'مهم'}
                                  {notification.type === 'warning' && 'تنبيه'}
                                  {notification.type === 'danger' && 'عاجل'}
                                  {notification.type === 'info' && 'معلومة'}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">{notification.time}</span>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500">لا توجد إشعارات جديدة</p>
                      </div>
                    )}
                  </div>

                  {/* تذييل الإشعارات */}
                  <div className="p-3 bg-gray-50 border-t border-gray-100">
                    <Link to="/notifications" className="block text-center text-blue-600 hover:text-blue-800 font-medium">
                      عرض كل الإشعارات
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* زر الملف الشخصي */}
            {user && (
              <Link
                to={
                  user.role === 'student' ? '/student/profile' :
                  user.role === 'instructor' ? '/instructor/profile' :
                  '/admin/profile'
                }
                className="p-2 hover:bg-blue-700 rounded-full transition-colors"
                title="الملف الشخصي"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-white shadow">
                  {user.name.charAt(0)}
                </div>
              </Link>
            )}

            {/* زر القائمة المنسدلة للشاشات الصغيرة */}
            <div className="md:hidden">
              <button
                onClick={() => {
                  const mobileMenu = document.getElementById('mobile-menu');
                  mobileMenu.classList.toggle('hidden');
                }}
                className="p-2 hover:bg-blue-700 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* زر تسجيل الخروج */}
            {user && (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-colors duration-200 shadow"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>تسجيل الخروج</span>
              </button>
            )}
          </div>
        </div>

        {/* شريط البحث للشاشات الصغيرة */}
        {showSearch && (
          <div className="md:hidden py-3 border-t border-blue-700">
            <form onSubmit={handleSearch} className="px-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث في النظام..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  autoFocus
                />
                <button type="submit" className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* القائمة المنسدلة للشاشات الصغيرة */}
        <div id="mobile-menu" className="md:hidden bg-blue-900/95 backdrop-blur-sm hidden">
          <div className="px-4 py-3 space-y-1">
            {getNavLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center space-x-3 py-3 px-4 hover:bg-blue-800 rounded-xl transition-colors"
                onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
            
            {user && (
              <>
                <div className="border-t border-blue-700 my-2 pt-2">
                  <Link
                    to="/notifications"
                    className="flex items-center space-x-3 py-3 px-4 hover:bg-blue-800 rounded-xl transition-colors"
                  >
                    <span className="text-xl">🔔</span>
                    <span className="font-medium">الإشعارات</span>
                    {unreadCount > 0 && (
                      <span className="w-6 h-6 bg-red-500 text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 py-3 px-4 bg-red-600 hover:bg-red-700 rounded-xl transition-colors text-right"
                >
                  <span className="text-xl">🚪</span>
                  <span className="font-medium flex-1">تسجيل الخروج</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;