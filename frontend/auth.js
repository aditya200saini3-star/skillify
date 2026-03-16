const API_BASE = 'https://skillify-backend-b442.onrender.com'; // Update this URL after deploying your backend to Render
const TOKEN_KEY = 'skillify_token';
const USER_KEY = 'skillify_user';

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

    updateNavbar() {
        const user = this.getCurrentUser();
        const navUl = document.querySelector('.navbar ul');
        if (!navUl) return;

        // Clear existing auth links
        document.querySelectorAll('.auth-link').forEach(el => el.remove());

        if (user) {
            const liUser = document.createElement('li');
            liUser.className = 'auth-link';
            const firstName = user.name ? user.name.split(' ')[0] : 'User';
            liUser.innerHTML = `<a href="#"><i class="fas fa-user-circle"></i> Hi, ${firstName}</a>`;

            const liLogout = document.createElement('li');
            liLogout.className = 'auth-link';
            liLogout.innerHTML = `<a href="#" onclick="auth.logout(); auth.updateNavbar(); window.location.reload();"><i class="fas fa-sign-out-alt"></i> Logout</a>`;

            navUl.appendChild(liUser);
            navUl.appendChild(liLogout);
        } else {
            const liLogin = document.createElement('li');
            liLogin.className = 'auth-link';
            liLogin.innerHTML = `<a href="login.html"><i class="fas fa-sign-in-alt"></i> Login</a>`;
            navUl.appendChild(liLogin);
        }
    },

    async protectPage() {
        const token = this.getToken();
        const path = window.location.pathname;
        const isPublicPage = path === '/' || path.includes('index.html') || path.includes('login.html');

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
            }
            .navbar ul li.auth-link a:hover {
                opacity: 1;
                transform: translateY(-3px);
                color: #ffc14d !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Update navbar immediately based on local storage so UI doesn't hang
    auth.updateNavbar();

    // Protect page and refresh user data (may take time if backend is asleep)
    await auth.protectPage();

    // Update navbar again in case user data changed
    auth.updateNavbar();
});

// Global logout handler
window.logout = () => auth.logout();

