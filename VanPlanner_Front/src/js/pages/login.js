class LoginPage {
        showAccountInactiveModal() {
            // Elimina cualquier modal anterior
            const oldModal = document.getElementById('modalCuentaInactiva');
            if (oldModal) oldModal.remove();

            const modal = document.createElement('div');
            modal.id = 'modalCuentaInactiva';
                modal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50';
            modal.innerHTML = `
                    <div class="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-van-alerta animate-fade-in">
                        <button id="cerrarModalCuentaInactiva" aria-label="Cerrar" class="absolute top-3 right-3 text-van-alerta hover:text-red-700 text-2xl font-bold focus:outline-none">&times;</button>
                        <div class="flex flex-col items-center">
                            <div class="bg-van-alerta/10 rounded-full p-4 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-van-alerta" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
                            </div>
                            <h2 class="text-2xl font-bold mb-2 text-van-alerta">Cuenta desactivada</h2>
                            <p class="mb-6 text-gray-700">Tu cuenta no está activa.<br>Contacta con administración para más información.</p>
                            <button id="cerrarModalCuentaInactivaBtn" class="bg-van-alerta text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-van-alerta">Cerrar</button>
                        </div>
                    </div>
                    <style>
                        @keyframes fade-in { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
                        .animate-fade-in { animation: fade-in 0.25s ease; }
                    </style>
            `;
            document.body.appendChild(modal);
            document.getElementById('cerrarModalCuentaInactiva').onclick = () => modal.remove();
                document.getElementById('cerrarModalCuentaInactivaBtn').onclick = () => modal.remove();
        }
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
                localStorage.setItem('usuarioId', respuesta.id_usuario);
                setTimeout(() => {
                    if (respuesta.tipoUsuario === 'user') {
                        window.location.href = 'verTodos.html';
                    } else {
                        window.location.href = 'panelAdmin.html';
                    }
                }, 1500);
            } else {
                // Leer el error detallado del backend, aunque la respuesta no sea JSON
                let errorMsg = 'Error en el inicio de sesión';
                let isInactive = false;
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        if (errorData && errorData.error === 'inactivo') {
                            isInactive = true;
                        } else if (errorData && errorData.mensaje) {
                            errorMsg = errorData.mensaje;
                        }
                    } else {
                        const text = await response.text();
                        if (text.includes('inactiva') || text.includes('no está activa')) {
                            isInactive = true;
                        }
                    }
                } catch (err) {}
                // No guardar nada en localStorage si está inactivo o error
                localStorage.removeItem('usuario');
                localStorage.removeItem('usuarioId');
                if (isInactive) {
                    this.showAccountInactiveModal();
                    return;
                }
                this.showNotification(errorMsg, 'error');
            }
        } catch (error) {
            this.showNotification(error.message || 'Error en el inicio de sesión', 'error');
            console.error('Login error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async sendLoginRequest(data) {
        return fetch(`http://back.vanplanner.duckdns.org/LoginServlet?usuario=${data.usuario}&password=${data.password}`);
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
    
    // Funcionalidad para recuperar contraseña
    inicializarRecuperarPassword();
});

// Funcionalidad de recuperar contraseña
function inicializarRecuperarPassword() {
    const linkRecuperar = document.getElementById('linkRecuperarPassword');
    const modalRecuperar = document.getElementById('modalRecuperarPassword');
    const modalConfirmacion = document.getElementById('modalConfirmacion');
    const formRecuperar = document.getElementById('formRecuperarPassword');
    const btnCancelar = document.getElementById('btnCancelarRecuperar');
    const btnCerrarConfirmacion = document.getElementById('btnCerrarConfirmacion');

    // Abrir modal de recuperar contraseña
    if (linkRecuperar) {
        linkRecuperar.addEventListener('click', (e) => {
            e.preventDefault();
            modalRecuperar.style.display = 'flex';
        });
    }

    // Cerrar modal al hacer clic en cancelar
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            modalRecuperar.style.display = 'none';
            formRecuperar.reset();
        });
    }

    // Cerrar modal al hacer clic fuera
    if (modalRecuperar) {
        modalRecuperar.addEventListener('click', (e) => {
            if (e.target === modalRecuperar) {
                modalRecuperar.style.display = 'none';
                formRecuperar.reset();
            }
        });
    }

    // Enviar formulario de recuperación
    if (formRecuperar) {
        formRecuperar.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('emailRecuperar').value;

            console.log('Enviando correo de recuperación a:', email);
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            modalRecuperar.style.display = 'none';
            
            modalConfirmacion.style.display = 'flex';
            
            formRecuperar.reset();
        });
    }

    if (btnCerrarConfirmacion) {
        btnCerrarConfirmacion.addEventListener('click', () => {
            modalConfirmacion.style.display = 'none';
        });
    }

    if (modalConfirmacion) {
        modalConfirmacion.addEventListener('click', (e) => {
            if (e.target === modalConfirmacion) {
                modalConfirmacion.style.display = 'none';
            }
        });
    }
}