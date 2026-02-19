// API Configuration
const API_URL = 'https://backend-sign-up-6usl.onrender.com'; // Change this to your Render URL after deployment

const Auth = {
    // Token management
    getToken() {
        return localStorage.getItem('token');
    },
    
    setToken(token) {
        localStorage.setItem('token', token);
    },
    
    removeToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    
    // User management
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },
    
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    // Check if logged in
    isLoggedIn() {
        return !!this.getToken();
    },
    
    // API Helper
    async apiRequest(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        // Add auth token if available
        const token = this.getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }
            
            return { success: true, data };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },
    
    // Signup
    async signup(name, email, password) {
        const result = await this.apiRequest('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
        
        if (result.success) {
            this.setToken(result.data.token);
            this.setUser(result.data.user);
        }
        
        return result;
    },
    
    // Login
    async login(email, password) {
        const result = await this.apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (result.success) {
            this.setToken(result.data.token);
            this.setUser(result.data.user);
        }
        
        return result;
    },
    
    // Logout
    async logout() {
        // Optional: Call logout endpoint to invalidate token on server
        await this.apiRequest('/auth/logout', { method: 'POST' });
        
        this.removeToken();
        window.location.href = 'login.html';
    },
    
    // Fetch protected data (example)
    async fetchProtected() {
        return await this.apiRequest('/protected');
    },
    
    // Get current user from server
    async fetchCurrentUser() {
        return await this.apiRequest('/auth/me');
    }
};
                  
