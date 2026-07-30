import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout — prevents UI hanging if backend is down
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studentos_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('studentos_token');
      // If we are not already on the login page, we can redirect or let the context handle it
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/google', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const attendanceAPI = {
  getAll: () => api.get('/attendance'),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
  log: (id, status) => api.post(`/attendance/${id}/log`, { status }),
};

export const cgpaAPI = {
  getAll: () => api.get('/cgpa'),
  create: (data) => api.post('/cgpa', data),
  update: (id, data) => api.put(`/cgpa/${id}`, data),
  delete: (id) => api.delete(`/cgpa/${id}`),
};

export const plannerAPI = {
  getTasks: () => api.get('/planner/tasks'),
  createTask: (data) => api.post('/planner/tasks', data),
  updateTask: (id, data) => api.put(`/planner/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/planner/tasks/${id}`),
  logSession: (data) => api.post('/planner/sessions', data),
  getAnalytics: () => api.get('/planner/analytics'),
};

export const analyticsAPI = {
  getDashboardOverview: () => api.get('/analytics/dashboard'),
};

export const codingAPI = {
  getProfile: () => api.get('/coding'),
  updateProfile: (data) => api.put('/coding', data),
};

export const placementAPI = {
  getPrep: () => api.get('/placement'),
  updatePrep: (data) => api.put('/placement', data),
};

export const goalsAPI = {
  getAll: () => api.get('/goals'),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const feedbackAPI = {
  submit: (data) => api.post('/feedback', data),
  getAll: () => api.get('/feedback'),
};

export const adminAPI = {
  getUsers: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/admin/users?${params}`);
  },
  bulkUploadUsers: (data) => api.post('/admin/users/bulk', data),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getDashboardStats: () => api.get('/admin/stats'),
};

export const facultyAPI = {
  getDashboardStats: () => api.get('/faculty/stats'),
};

export const academicAPI = {
  // Subjects
  getSubjects: () => api.get('/academic/subjects'),
  createSubject: (data) => api.post('/academic/subjects', data),
  updateSubject: (id, data) => api.put(`/academic/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/academic/subjects/${id}`),
  
  // Notices
  getNotices: () => api.get('/academic/notices'),
  createNotice: (data) => api.post('/academic/notices', data),
  deleteNotice: (id) => api.delete(`/academic/notices/${id}`),

  // Attendance
  getAttendance: () => api.get('/academic/attendance'),
  markAttendance: (data) => api.post('/academic/attendance', data),

  // Marks
  getMarks: () => api.get('/academic/marks'),
  uploadMark: (data) => api.post('/academic/marks', data),

  // Timetable
  getTimetable: () => api.get('/academic/timetable'),
  createTimetable: (data) => api.post('/academic/timetable', data),

  // Assignments
  getAssignments: () => api.get('/academic/assignments'),
  createAssignment: (data) => api.post('/academic/assignments', data),
  submitAssignment: (id, data) => api.post(`/academic/assignments/${id}/submit`, data),
  getSubmissions: (id) => api.get(`/academic/assignments/${id}/submissions`),

  // Results
  getResults: () => api.get('/academic/results'),
  calculateResult: (data) => api.post('/academic/results/calculate', data),
};

export const departmentAPI = {
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data) => api.post('/admin/departments', data),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),
};

export const courseAPI = {
  getCourses: () => api.get('/admin/courses'),
  createCourse: (data) => api.post('/admin/courses', data),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),
};

export const calendarAPI = {
  getEvents: () => api.get('/admin/calendar'),
  createEvent: (data) => api.post('/admin/calendar', data),
  deleteEvent: (id) => api.delete(`/admin/calendar/${id}`),
};

export const reportAPI = {
  getAttendanceReport: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/admin/reports/attendance?${params}`);
  },
  getMarksReport: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/admin/reports/marks?${params}`);
  },
};

export const feeAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/fees?${params}`);
  },
  create: (data) => api.post('/fees', data),
  pay: (id, data) => api.put(`/fees/${id}/pay`, data),
  delete: (id) => api.delete(`/fees/${id}`),
  getStats: () => api.get('/fees/stats'),
};

export const examAPI = {
  getAll: () => api.get('/exams'),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`),
};

export const uploadAPI = {
  uploadAvatar: (formData) => api.post('/upload/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadDocument: (formData) => api.post('/upload/document', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
};

export default api;
