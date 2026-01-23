class LoginPage {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupEventListeners();
            this.restoreRememberedEmail();
        }
    }

    setupEventListeners() {
        this.form.email.addEventListener('blur', () => this.validarEmail());
        this.form.password.addEventListener('blur', () => this.validarContrasenya());

        this.form.email.addEventListener('input', () => this.clearError('email'));
        this.form.password.addEventListener('input', () => this.clearError('password'));

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        const toggleBtn = document.querySelector('[data-toggle-password]');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.togglePassword());
        }
    }

    validarEmail() {
        const email = this.form.email.value.trim();

        if (!email) {
            this.showError('email', 'El email es requerido');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('email', 'Email inválido');
            return false;
        }

        this.clearError('email');
        return true;
    }

    validarContrasenya() {
        const password = this.form.password.value;

        if (!password) {
            this.showError('password', 'La contraseña es requerida');
            return false;
        }

        if (password.length < 6) {
            this.showError('password', 'Mínimo 6 caracteres');
            return false;
        }

        this.clearError('password');
        return true;
    }

    validarFormulario() {
        const isEmailValid = this.validarEmail();
        const isPasswordValid = this.validarContrasenya();

        return isEmailValid && isPasswordValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validarFormulario()) {
            this.showNotification('Por favor, corrige los errores', 'error');
            return;
        }

        const formData = new FormData(this.form);
        const data = {
            usuario: formData.get('email').trim(),
            password: formData.get('password'),
        };


        this.showLoading(true);

        try {
            const response = await this.sendLoginRequest(data);

            if (response.status === 200) {
                this.showNotification('Inicio de sesión exitoso', 'success');

                let respuesta = await response.json();
                localStorage.setItem('usuario', JSON.stringify(respuesta));

                setTimeout(() => {
                    if (respuesta.tipoUsuario === 'user') {
                        window.location.href = 'verTodos.html';
                    } else {
                        window.location.href = 'panelAdmin.html';
                    }
                }, 1500);
            } else {
                this.showNotification(error.message || 'Error en el inicio de sesión', 'error');
            }
        } catch (error) {
            this.showNotification(error.message || 'Error en el inicio de sesión', 'error');
            console.error('Login error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async sendLoginRequest(data) {
        return fetch(`http://localhost:8080/VanPlannerBack/LoginServlet?usuario=${data.usuario}&password=${data.password}`);
    }

    async simulateLogin(data) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const validCredentials = {
            email: 'test@test.com',
            password: '123456'
        };

        if (data.email !== validCredentials.email || data.password !== validCredentials.password) {
            throw new Error('Credenciales incorrectas');
        }

        return { success: true, user: { name: 'Usuario Test', email: data.email } };
    }

    togglePassword() {
        const passwordInput = this.form.password;
        const toggleBtn = document.querySelector('[data-toggle-password]');
        const icon = toggleBtn.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
            toggleBtn.setAttribute('aria-label', 'Ocultar contraseña');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
            toggleBtn.setAttribute('aria-label', 'Mostrar contraseña');
        }
    }

    restoreRememberedEmail() {
        const rememberedEmail = localStorage.getItem('vanplanner-remembered-email');
        if (rememberedEmail && this.form.email) {
            this.form.email.value = rememberedEmail;
            this.form.remember.checked = true;
        }
    }

    showError(field, message) {
        const input = this.form[field];
        let errorElement = document.getElementById(`${field}Error`);

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = `${field}Error`;
            errorElement.className = 'form-error mt-1 text-sm text-van-alerta';
            input.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
        input.classList.add('border-van-alerta');
        input.classList.remove('border-van-neutro-2');
    }

    clearError(field) {
        const input = this.form[field];
        const errorElement = document.getElementById(`${field}Error`);

        if (errorElement) {
            errorElement.remove();
        }

        input.classList.remove('border-van-alerta');
        input.classList.add('border-van-neutro-2');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300 ${type === 'success' ? 'bg-van-correcto text-white' :
            type === 'error' ? 'bg-van-alerta text-white' :
                'bg-van-primario-v2 text-white'
            }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showLoading(show) {
        const submitBtn = this.form.querySelector('button[type="submit"]');

        if (show) {
            submitBtn.innerHTML = `
                <span class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Procesando...
            `;
            submitBtn.disabled = true;
        } else {
            submitBtn.innerHTML = 'Iniciar sesión';
            submitBtn.disabled = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('loginForm')) {
        window.loginPage = new LoginPage();
    }
});