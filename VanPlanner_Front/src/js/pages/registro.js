let usuario = {};
document.addEventListener('DOMContentLoaded', inicializar);

let inputNombreElement;
let inputApellidosElement;
let inputCiudadElement;
let inputMailElement;
let inputFechaNacimientoElement;
let inputContrasenaElement;
let inputConfirmarContrasenaElement;
let inputUsernameElement;

function inicializar() {
    const formularioRegistroElemente = document.getElementById('formularioRegistro');
    formularioRegistroElemente.addEventListener('submit', registrarseClick);

    inputNombreElement = document.getElementById('nombreInput');
    inputApellidosElement = document.getElementById('apellidosInput');
    inputCiudadElement = document.getElementById('ciudadInput');
    inputMailElement = document.getElementById('emailInput');
    inputFechaNacimientoElement = document.getElementById('fechaNacimientoInput');
    inputUsernameElement = document.getElementById('usernameInput');
    inputContrasenaElement = document.getElementById('contrasenaInput');
    inputConfirmarContrasenaElement = document.getElementById('confirmarContrasenaInput');

}

// Validación de formulario
async function registrarseClick(event) {
    event.preventDefault();

    const nombreValidado = validarNombre();
    const apellidosValidado = validarApellidos();
    const ciudadValidada = validarCiudad();
    const fechaNacimientoValidada = validarFechaNacimiento();
    const emailValidado = validarEmail();
    const contrasenaValidada = validarContrasena();
    const confirmacionContrasenaValidada = validarConfirmacionContrasena();
    const usernameValidado = validarUserName();
    const terminosAceptados = validarTerminos();
    const sexoSeleccionado = validarSexo();

    if (nombreValidado && apellidosValidado && ciudadValidada &&
        fechaNacimientoValidada && usernameValidado && contrasenaValidada &&
        confirmacionContrasenaValidada && emailValidado && terminosAceptados && sexoSeleccionado) {

        console.log('Registro validado correctamente');

        const response = await sendRegistroRequest(usuario);

        if (response.status === 200) {
            showNotification('Registro exitoso', 'success');

            setTimeout(() => {
                window.location.href = 'inicioSesion.html';
            }, 1500);

        } else {
            alert('Registro ha fallado');
        }

    } else {
        console.log('Hay errores en el formulario');
    }
}

async function sendRegistroRequest(data) {
    return fetch(`http://localhost:8080/VanPlannerBack/RegistroServlet`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

function validarNombre() {
    const errorNombreElement = document.getElementById('errorNombre');
    const nombre = inputNombreElement.value.trim();
    let resultado = false;

    const expresion = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (nombre === '') {
        errorNombreElement.innerHTML = 'El nombre es obligatorio';
    } else if (nombre.length < 2) {
        errorNombreElement.innerHTML = 'El nombre debe tener al menos 2 caracteres';
    } else if (!expresion.test(nombre)) {
        errorNombreElement.innerHTML = 'Solo se permiten letras y espacios';
    } else {
        errorNombreElement.innerHTML = '';
        usuario.nombre = nombre;
        resultado = true;
    }

    return resultado;
}

function validarApellidos() {
    const errorApellidosElement = document.getElementById('errorApellidos');
    const apellidos = inputApellidosElement.value.trim();
    let resultado = false;

    const expresion = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (apellidos === '') {
        errorApellidosElement.innerHTML = 'Los apellidos son obligatorios';
    } else if (apellidos.length < 2) {
        errorApellidosElement.innerHTML = 'Los apellidos deben tener al menos 2 caracteres';
    } else if (!expresion.test(apellidos)) {
        errorApellidosElement.innerHTML = 'Solo se permiten letras y espacios';
    } else {
        errorApellidosElement.innerHTML = '';
        usuario.apellidos = apellidos;
        resultado = true;
    }

    return resultado;
}

function validarCiudad() {
    const errorCiudadElement = document.getElementById('errorCiudad');
    const ciudad = inputCiudadElement.value.trim();
    let resultado = false;

    const expresion = /^[a-zA-ZáéíóúÁÉÍÓÚñÑçÇ\s\-']+$/;

    if (ciudad === '') {
        errorCiudadElement.innerHTML = 'La ciudad es obligatoria';
    } else if (ciudad.length < 2) {
        errorCiudadElement.innerHTML = 'La ciudad debe tener al menos 2 caracteres';
    } else if (!expresion.test(ciudad)) {
        errorCiudadElement.innerHTML = 'Solo se permiten letras, espacios y guiones';
    } else {
        errorCiudadElement.innerHTML = '';
        usuario.ciudad = ciudad;
        resultado = true;
    }

    return resultado;
}

function validarFechaNacimiento() {
    const errorFechaNacElement = document.getElementById('errorFechaNac');
    const fechaNac = inputFechaNacimientoElement.value;
    let resultado = false;

    if (fechaNac === '') {
        errorFechaNacElement.innerHTML = 'La fecha de nacimiento es obligatoria';
    } else {
        const fecha = new Date(fechaNac);
        const hoy = new Date();

        if (isNaN(fecha.getTime())) {
            errorFechaNacElement.innerHTML = 'Fecha no válida';
        }
        // Validar que no sea futura
        else if (fecha > hoy) {
            errorFechaNacElement.innerHTML = 'La fecha no puede ser futura';
        } else {
            const dia = fecha.getDate().toString().padStart(2, '0');
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
            const año = fecha.getFullYear();
            const fechaFormateada = `${dia}/${mes}/${año}`;

            inputFechaNacimientoElement.dataset.fechaFormateada = fechaFormateada;

            errorFechaNacElement.innerHTML = '';

            usuario.fechaNacimiento = fecha;
            resultado = true;
        }
    }

    return resultado;
}

function validarEmail() {
    const errorMailElement = document.getElementById('errorEmail');
    const mail = inputMailElement.value.trim();
    let resultado = false;

    const expresion = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (mail === '') {
        errorMailElement.innerHTML = 'El email es obligatorio';
    } else if (!expresion.test(mail)) {
        errorMailElement.innerHTML = 'Formato de email inválido';
    } else {
        errorMailElement.innerHTML = '';
        usuario.email = mail;

        resultado = true;
    }

    return resultado;
}

function validarContrasena() {
    const errorContrasenaElement = document.getElementById('errorContrasena');
    const contrasena = inputContrasenaElement.value;
    let resultado = false;

    const expresion = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (contrasena === '') {
        errorContrasenaElement.innerHTML = 'La contraseña es obligatoria';
    } else if (contrasena.length < 8) {
        errorContrasenaElement.innerHTML = 'Mínimo 8 caracteres';
    } else if (!expresion.test(contrasena)) {
        errorContrasenaElement.innerHTML = 'Debe incluir mayúsculas, minúsculas y números';
    } else {
        errorContrasenaElement.innerHTML = '';
        resultado = true;
    }

    return resultado;
}

function validarConfirmacionContrasena() {
    const errorConfirmacionElement = document.getElementById('errorConfirmacionContrasena');
    const contrasena = inputContrasenaElement.value;
    const confirmacion = inputConfirmarContrasenaElement.value;
    let resultado = false;

    if (confirmacion === '') {
        errorConfirmacionElement.innerHTML = 'Confirma tu contraseña';
    } else if (contrasena !== confirmacion) {
        errorConfirmacionElement.innerHTML = 'Las contraseñas no coinciden';
    } else {
        errorConfirmacionElement.innerHTML = '';
        usuario.contrasenya = contrasena;
        resultado = true;
    }

    return resultado;
}

function validarUserName() {
    const errorUserNameElement = document.getElementById('errorUsername');
    const userName = inputUsernameElement.value.trim();
    let resultado = false;

    const expresion = /^[a-zA-Z0-9._]{3,8}$/;

    if (userName === '') {
        errorUserNameElement.innerHTML = 'El usuario es obligatorio';
    } else if (userName.length < 3) {
        errorUserNameElement.innerHTML = 'Mínimo 3 caracteres';
    } else if (userName.length > 20) {
        errorUserNameElement.innerHTML = 'Máximo 20 caracteres';
    } else if (!expresion.test(userName)) {
        errorUserNameElement.innerHTML = 'Solo letras, números, puntos y guiones bajos';
    } else {
        errorUserNameElement.innerHTML = '';
        usuario.nombreUsuario = userName;
        resultado = true;
    }

    return resultado;
}

function validarTerminos() {
    const terminosCheckbox = document.getElementById('terminos');
    if (!terminosCheckbox.checked) {
        alert('Debes aceptar los términos y condiciones');
        return false;
    }
    usuario.aceptaTerminos = terminosCheckbox.checked;
    return true;
}

function validarSexo() {
    const sexoSeleccionado = document.querySelector('input[name="sexo"]:checked');
    usuario.sexo = sexoSeleccionado.value;
    return true;
}

function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    } else {
        input.type = 'password';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    }
}

function showNotification(message, type = 'info') {
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

document.querySelectorAll('.relative button').forEach(button => {
    button.addEventListener('click', function () {
        const input = this.parentElement.querySelector('input');
        const icon = this.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        } else {
            input.type = 'password';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        }
    });
});