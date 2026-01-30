import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth headers if they exist in localStorage
api.interceptors.request.use((config) => {
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (role) config.headers['x-user-role'] = role;
    if (userId) config.headers['x-user-id'] = userId;

    return config;
});

export const authService = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
    },
};

export const bookService = {
    getBooks: () => api.get('/books'),
    getBook: (id) => api.get(`/books/${id}`),
    createBook: (bookData) => api.post('/books', bookData),
    updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
    deleteBook: (id) => api.delete(`/books/${id}`),
};

export const borrowService = {
    borrow: (borrowData) => api.post('/borrow', borrowData),
    getLogs: () => api.get('/borrow'),
    getMyLogs: () => api.get('/borrow/my'),
};

export default api;

