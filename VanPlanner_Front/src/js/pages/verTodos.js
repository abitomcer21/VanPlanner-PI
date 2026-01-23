document.addEventListener('DOMContentLoaded', inicializar);

function inicializar() {
    cargarNombre();
}

function cargarNombre() {
    let usuarioJson = localStorage.getItem('usuario');

    if (usuarioJson != null) {
        let usuario = JSON.parse(usuarioJson);

        document.getElementById('nombreUsuario').innerText = document.getElementById('nombreUsuario').innerText.replace('{nombre}', usuario.nombre);
    }
}