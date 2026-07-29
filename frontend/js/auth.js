// Login Form Handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = document.getElementById('login-btn');

        try {
            btn.disabled = true;
            btn.innerHTML = 'Logging in...';

            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await apiPost('/auth/login', formData, true);

            if (response && response.access_token) {
                localStorage.setItem('access_token', response.access_token);
                window.location.href = 'dashboard.html';
            } else {
                throw new Error('Invalid response from server');
            }

        } catch (error) {
            showAlert(error.message, 'error');
            btn.disabled = false;
            btn.innerHTML = 'Login';
        }
    });
}