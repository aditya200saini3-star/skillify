const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
const API_BASE = isLocal ? 'http://localhost:5000' : 'https://skillify-backend-b442.onrender.com';
const TOKEN_KEY = 'coursematch_token';
const USER_KEY = 'coursematch_user';

const auth = {
    async signup(name, email, password) {
        try {
            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem(TOKEN_KEY, data.token);
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    },

    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem(TOKEN_KEY, data.token);
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(USER_KEY)) || null;
        } catch {
            return null;
        }
    },

    getHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    },

    async getMe() {
        try {
            const response = await fetch(`${API_BASE}/api/auth/me`, {
                headers: this.getHeaders()
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            }
            return data;
        } catch {
            return { success: false };
        }
    },

    updateNavbar(config = {}) {
        const user = this.getCurrentUser();
        const navUl = document.querySelector('.navbar ul');
        if (!navUl) return;
        
        const { hideHome = false, hideLogout = false, showBackToHome = false } = config;

        // Clear existing auth links and any custom home/back links
        document.querySelectorAll('.auth-link, .custom-nav-link').forEach(el => el.remove());

        if (user) {
            const liUser = document.createElement('li');
            liUser.className = 'auth-link';
            const firstName = user.name ? user.name.split(' ')[0] : 'User';
            liUser.innerHTML = `<a href="#"><i class="fas fa-user-circle"></i> Hi, ${firstName}</a>`;
            navUl.appendChild(liUser);

            if (!hideLogout) {
                const liLogout = document.createElement('li');
                liLogout.className = 'auth-link';
                liLogout.innerHTML = `<a href="#" onclick="auth.logout(); auth.updateNavbar(); window.location.reload();"><i class="fas fa-sign-out-alt"></i> Logout</a>`;
                navUl.appendChild(liLogout);
            }
        } else if (!config.hideAuth) {
            const liLogin = document.createElement('li');
            liLogin.className = 'auth-link';
            liLogin.innerHTML = `<a href="login.html"><i class="fas fa-sign-in-alt"></i> Login</a>`;
            navUl.appendChild(liLogin);
        }

        if (showBackToHome) {
            const liBack = document.createElement('li');
            liBack.className = 'custom-nav-link';
            liBack.innerHTML = `<a href="index.html"><i class="fas fa-home"></i> Back to Home</a>`;
            navUl.appendChild(liBack);
        }
    },

    async protectPage() {
        const token = this.getToken();
        const path = window.location.pathname;
        const isPublicPage = path === '/' || 
                             path.includes('index') || 
                             path.includes('login') || 
                             path.includes('forgot-password') || 
                             path.includes('reset-password');

        if (!token && !isPublicPage) {
            window.location.href = 'login.html';
        } else if (token) {
            // Refresh user data
            await this.getMe();
        }
    }
};

// Auto-init
document.addEventListener('DOMContentLoaded', async () => {
    // Inject navbar styles
    if (!document.querySelector('#auth-styles')) {
        const style = document.createElement('style');
        style.id = 'auth-styles';
        style.innerHTML = `
            .navbar ul li.auth-link a {
                color: #ffffff !important;
                text-decoration: none !important;
                font-weight: 600 !important;
                font-size: 16px;
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 0;
                transition: all 0.3s ease;
                opacity: 0.9;
                white-space: nowrap;
            }
            .navbar ul li.auth-link a:hover {
                opacity: 1;
                transform: translateY(-3px);
                color: #ffc14d !important;
            }
            .navbar ul li.custom-nav-link a {
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 50px;
                padding: 10px 20px !important;
                color: #ffffff !important;
                text-decoration: none !important;
                font-weight: 700 !important;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            .navbar ul li.custom-nav-link a:hover {
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
                border-color: rgba(59, 130, 246, 0.4);
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
            }
            .navbar ul li.custom-nav-link a i {
                font-size: 16px;
                color: #60a5fa;
            }
            @media (max-width: 600px) {
                .navbar ul li.custom-nav-link a {
                    padding: 8px 12px !important;
                    font-size: 12px;
                    gap: 5px;
                }
                .navbar ul li.custom-nav-link a i {
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Update navbar immediately based on local storage so UI doesn't hang
    auth.updateNavbar(window.navbarConfig || {});

    // Protect page and refresh user data (may take time if backend is asleep)
    await auth.protectPage();

    // Update navbar again in case user data changed
    auth.updateNavbar(window.navbarConfig || {});
});

// Global logout handler
window.logout = () => auth.logout();

