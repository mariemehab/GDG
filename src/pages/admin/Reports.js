import React, { useState, useEffect } from 'react';
import './Reports.css';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Reports = () => {
  // بيانات وهمية للتقارير
  const [reports, setReports] = useState({
    studentStats: [
      { name: 'يناير', طلاب: 400, مدرسون: 40 },
      { name: 'فبراير', طلاب: 450, مدرسون: 45 },
      { name: 'مارس', طلاب: 500, مدرسون: 50 },
      { name: 'أبريل', طلاب: 480, مدرسون: 48 },
      { name: 'مايو', طلاب: 520, مدرسون: 52 },
      { name: 'يونيو', طلاب: 550, مدرسون: 55 },
    ],
    courseStats: [
      { name: 'رياضيات', عدد_الطلاب: 120 },
      { name: 'فيزياء', عدد_الطلاب: 90 },
      { name: 'كيمياء', عدد_الطلاب: 85 },
      { name: 'برمجة', عدد_الطلاب: 150 },
      { name: 'قواعد بيانات', عدد_الطلاب: 70 },
      { name: 'شبكات', عدد_الطلاب: 60 },
    ],
    userDistribution: [
      { name: 'طلاب', value: 550 },
      { name: 'مدرسون', value: 55 },
      { name: 'مديرون', value: 5 },
    ],
    gradesDistribution: [
      { range: '90-100', عدد_الطلاب: 50 },
      { range: '80-89', عدد_الطلاب: 120 },
      { range: '70-79', عدد_الطلاب: 200 },
      { range: '60-69', عدد_الطلاب: 150 },
      { range: 'أقل من 60', عدد_الطلاب: 30 },
    ],
  });

  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-12-31'
  });
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // محاكاة عملية إنشاء التقرير
    setTimeout(() => {
      alert('تم إنشاء التقرير بنجاح!');
      setIsGenerating(false);
    }, 1500);
  };

  const handleExportPDF = () => {
    alert('جارٍ تصدير التقرير كملف PDF...');
  };

  const handleExportExcel = () => {
    alert('جارٍ تصدير التقرير كملف Excel...');
  };

  const stats = {
    totalStudents: 550,
    totalInstructors: 55,
    totalCourses: 25,
    activeUsers: 580,
    averageGrade: 78.5,
    completionRate: 85
  };

  return (
    <div className="reports-container">
      {/* رأس الصفحة */}
      <div className="reports-header">
        <h1>التقارير والإحصائيات</h1>
        <div className="header-controls">
          <div className="date-range-picker">
            <label>من:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
            <label>إلى:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
          
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="report-selector"
          >
            <option value="overview">نظرة عامة</option>
            <option value="students">تقارير الطلاب</option>
            <option value="courses">تقارير المقررات</option>
            <option value="grades">تقارير الدرجات</option>
            <option value="financial">تقارير مالية</option>
          </select>
        </div>
      </div>

      {/* أزرار الإجراءات */}
      <div className="action-buttons">
        <button 
          onClick={handleGenerateReport}
          className="btn-generate"
          disabled={isGenerating}
        >
          {isGenerating ? 'جارٍ الإنشاء...' : '🎯 إنشاء تقرير'}
        </button>
        <button onClick={handleExportPDF} className="btn-export">
          📄 تصدير PDF
        </button>
        <button onClick={handleExportExcel} className="btn-export">
          📊 تصدير Excel
        </button>
        <button onClick={() => window.print()} className="btn-print">
          🖨️ طباعة
        </button>
      </div>

      {/* البطاقات الإحصائية */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: '#4CAF50'}}>👨‍🎓</div>
          <div className="stat-content">
            <h3>إجمالي الطلاب</h3>
            <p className="stat-number">{stats.totalStudents}</p>
            <p className="stat-change">↑ 12% عن الشهر الماضي</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{background: '#2196F3'}}>👨‍🏫</div>
          <div className="stat-content">
            <h3>إجمالي المدرسين</h3>
            <p className="stat-number">{stats.totalInstructors}</p>
            <p className="stat-change">↑ 5% عن الشهر الماضي</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{background: '#FF9800'}}>📚</div>
          <div className="stat-content">
            <h3>إجمالي المقررات</h3>
            <p className="stat-number">{stats.totalCourses}</p>
            <p className="stat-change">↔ لا تغيير</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{background: '#9C27B0'}}>📈</div>
          <div className="stat-content">
            <h3>متوسط الدرجات</h3>
            <p className="stat-number">{stats.averageGrade}%</p>
            <p className="stat-change">↑ 2.5% عن الفصل الماضي</p>
          </div>
        </div>
      </div>

      {/* المخططات البيانية */}
      <div className="charts-grid">
        {/* مخطط الطلاب والمدرسين */}
        <div className="chart-card">
          <h3>نمو الطلاب والمدرسين</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reports.studentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="طلاب" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="مدرسون" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* توزيع المستخدمين */}
        <div className="chart-card">
          <h3>توزيع المستخدمين</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reports.userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reports.userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* توزيع الدرجات */}
        <div className="chart-card">
          <h3>توزيع الدرجات</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reports.gradesDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="عدد_الطلاب" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* المقررات الأكثر شعبية */}
        <div className="chart-card">
          <h3>المقررات الأكثر شعبية</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reports.courseStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="عدد_الطلاب" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* الجداول التفصيلية */}
      <div className="tables-section">
        <div className="table-card">
          <h3>أحدث التسجيلات</h3>
          <div className="table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>الطالب</th>
                  <th>المقرر</th>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, student: 'أحمد محمد', course: 'برمجة متقدمة', date: '2024-01-15', status: 'مكتمل' },
                  { id: 2, student: 'سارة علي', course: 'قواعد بيانات', date: '2024-01-14', status: 'مكتمل' },
                  { id: 3, student: 'محمد خالد', course: 'شبكات الحاسب', date: '2024-01-13', status: 'قيد الانتظار' },
                  { id: 4, student: 'فاطمة حسن', course: 'رياضيات متقدمة', date: '2024-01-12', status: 'مكتمل' },
                  { id: 5, student: 'عمر عبدالله', course: 'الذكاء الاصطناعي', date: '2024-01-11', status: 'ملغي' },
                ].map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.student}</td>
                    <td>{row.course}</td>
                    <td>{row.date}</td>
                    <td>
                      <span className={`status-badge ${row.status === 'مكتمل' ? 'completed' : row.status === 'قيد الانتظار' ? 'pending' : 'cancelled'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card">
          <h3>أفضل الطلاب أداءً</h3>
          <div className="table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>الطالب</th>
                  <th>المعدل</th>
                  <th>عدد المقررات</th>
                  <th>الحضور</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, student: 'أحمد محمد', gpa: 98, courses: 6, attendance: 99 },
                  { id: 2, student: 'سارة علي', gpa: 96, courses: 6, attendance: 98 },
                  { id: 3, student: 'محمد خالد', gpa: 95, courses: 5, attendance: 97 },
                  { id: 4, student: 'فاطمة حسن', gpa: 94, courses: 6, attendance: 96 },
                  { id: 5, student: 'عمر عبدالله', gpa: 92, courses: 5, attendance: 95 },
                ].map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>
                      <div className="student-info">
                        <span className="avatar">👨‍🎓</span>
                        {row.student}
                      </div>
                    </td>
                    <td>
                      <span className="gpa-badge">{row.gpa}%</span>
                    </td>
                    <td>{row.courses}</td>
                    <td>
                      <div className="attendance-bar">
                        <div 
                          className="attendance-fill" 
                          style={{width: `${row.attendance}%`}}
                        ></div>
                        <span>{row.attendance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ملخص التقرير */}
      <div className="summary-section">
        <h3>ملخص التقرير</h3>
        <div className="summary-content">
          <p>
            📊 <strong>الأداء العام:</strong> شهد النظام نمواً ملحوظاً في عدد الطلاب بنسبة 12% 
            مقارنة بالشهر الماضي.
          </p>
          <p>
            🎯 <strong>التعليم:</strong> متوسط الدرجات ارتفع بنسبة 2.5% مما يشير إلى تحسن في 
            جودة التعليم والتعلم.
          </p>
          <p>
            👥 <strong>المستخدمون:</strong> نسبة النشاط تبلغ 94% مع توازن جيد بين الطلاب 
            والمدرسين.
          </p>
          <p>
            📚 <strong>المقررات:</strong> مقرر "برمجة" هو الأكثر شعبية مع 150 طالباً مسجلاً.
          </p>
          <p className="recommendation">
            💡 <strong>التوصيات:</strong> 
            1. زيادة الدعم لمقررات قواعد البيانات لزيادة عدد المسجلين.
            2. تقديم ورش عمل للمدرسين لتحسين طرق التدريس.
            3. تطوير نظام المتابعة للطلاب ذوي الأداء المنخفض.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;