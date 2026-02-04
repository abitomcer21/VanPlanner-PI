// URL base del backend
const API_BASE_URL = 'http://localhost:8080/VanPlannerBack';

// Referencias a elementos del DOM
const btnNuevoUsuario = document.getElementById('btnNuevoUsuario');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnCancelar = document.getElementById('btnCancelar');
const modalUsuario = document.getElementById('modalUsuario');
const modalTitulo = document.getElementById('modalTitulo');
const formUsuario = document.getElementById('formUsuario');
const tbody = document.querySelector('tbody');

// Variable para almacenar el ID del usuario que se está editando
let usuarioEditandoId = null;

// Cargar usuarios al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
    cargarEstadisticas();
});

// Función para cargar estadísticas de usuarios
async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_BASE_URL}/ObtenerEstadisticasUsuariosServlet`);
        
        if (!response.ok) {
            throw new Error(`Error al cargar estadísticas: ${response.status}`);
        }
        
        const estadisticas = await response.json();
        
        // Actualizar los elementos del DOM
        const totalUsuariosElement = document.getElementById('total-usuarios');
        const usuariosActivosElement = document.getElementById('usuarios-activos');
        const nuevosHoyElement = document.getElementById('nuevos-hoy');
        
        if (totalUsuariosElement) {
            totalUsuariosElement.textContent = estadisticas.totalUsuarios.toLocaleString('es-ES');
        }
        if (usuariosActivosElement) {
            usuariosActivosElement.textContent = estadisticas.usuariosActivos.toLocaleString('es-ES');
        }
        if (nuevosHoyElement) {
            nuevosHoyElement.textContent = estadisticas.nuevosHoy.toLocaleString('es-ES');
        }
        
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// Función para cargar todos los usuarios
async function cargarUsuarios() {
    try {
        console.log('Intentando cargar usuarios desde:', `${API_BASE_URL}/ObtenerUsuariosServlet`);
        
        const response = await fetch(`${API_BASE_URL}/ObtenerUsuariosServlet`);
        
        console.log('Respuesta recibida:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            throw new Error(`Error al cargar usuarios: ${response.status} - ${errorText}`);
        }
        
        const contentType = response.headers.get("content-type");
        console.log('Content-Type:', contentType);
        
        const responseText = await response.text();
        console.log('Respuesta en texto:', responseText);
        
        let usuarios;
        try {
            usuarios = JSON.parse(responseText);
            console.log('Usuarios parseados:', usuarios);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.error('Texto recibido:', responseText);
            throw new Error('La respuesta del servidor no es JSON válido');
        }
        
        mostrarUsuarios(usuarios);
        
    } catch (error) {
        console.error('Error completo:', error);
        alert(`Error al cargar los usuarios: ${error.message}`);
    }
}

// Función para mostrar usuarios en la tabla
function mostrarUsuarios(usuarios) {
    tbody.innerHTML = '';
    
    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No hay usuarios registrados
                </td>
            </tr>
        `;
        return;
    }
    
    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.className = 'table-row-hover';
        
        const estadoActivo = usuario.activo;
        const estadoClass = estadoActivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        const estadoTexto = estadoActivo ? 'Activo' : 'Inactivo';
        
        // Formatear fecha
        let fechaRegistro = 'N/A';
        if (usuario.fechaNacimiento) {
            const fecha = new Date(usuario.fechaNacimiento);
            fechaRegistro = fecha.toLocaleDateString('es-ES');
        }
        
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" class="rounded border-gray-300">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <img class="h-10 w-10 rounded-full"
                        src="https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre + ' ' + usuario.apellidos)}&background=4f46e5&color=fff"
                        alt="">
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${usuario.nombre} ${usuario.apellidos}</div>
                        <div class="text-sm text-gray-500">@${usuario.nombreUsuario || usuario.username}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${usuario.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${fechaRegistro}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoClass}">
                    ${estadoTexto}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editarUsuario(${usuario.idUsuario})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="mostrarModalEliminarUsuario(${usuario.idUsuario}, '${usuario.nombre.replace(/'/g, "\\'")} ${usuario.apellidos.replace(/'/g, "\\'")}')" class="text-red-600 hover:text-red-900 mr-3">
                    <i class="fas fa-trash"></i>
                </button>
                <button onclick="verUsuario(${usuario.idUsuario})" class="text-gray-600 hover:text-gray-900 mr-3">
                    <i class="fas fa-eye"></i>
                </button>
                <!-- Botón de inactivar eliminado -->
            </td>
        `;
        // Función para inactivar usuario
        async function inactivarUsuario(id) {
            if (!confirm('¿Seguro que quieres pasar este usuario a inactivo?')) return;
            try {
                // Obtener datos actuales del usuario
                const responseGet = await fetch(`${API_BASE_URL}/ObtenerUsuarioServlet?id=${id}`);
                if (!responseGet.ok) throw new Error('No se pudo obtener el usuario');
                const usuario = await responseGet.json();
                usuario.activo = false;
                // Formatear fechaNacimiento si es Date
                if (usuario.fechaNacimiento && typeof usuario.fechaNacimiento === 'string' && usuario.fechaNacimiento.length > 10) {
                    // Si viene como ISO, recortar a YYYY-MM-DD
                    usuario.fechaNacimiento = usuario.fechaNacimiento.substring(0, 10);
                }
                const response = await fetch(`${API_BASE_URL}/ActualizarUsuarioServlet`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(usuario)
                });
                if (!response.ok) throw new Error('No se pudo actualizar el usuario');
                alert('Usuario pasado a inactivo correctamente');
                cargarUsuarios();
            } catch (error) {
                alert('Error al inactivar usuario: ' + error.message);
            }
        }
        
        tbody.appendChild(tr);
    });
}

// Abrir modal para nuevo usuario
btnNuevoUsuario.addEventListener('click', () => {
    modalTitulo.textContent = 'Nuevo Usuario';
    formUsuario.reset();
    usuarioEditandoId = null;
    modalUsuario.classList.remove('hidden');
});

// Función para editar usuario
async function editarUsuario(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/ObtenerUsuarioServlet?id=${id}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener usuario');
        }
        
        const usuario = await response.json();
        
        // Llenar el formulario con los datos del usuario
        const inputs = formUsuario.elements;
        inputs[0].value = usuario.nombre || '';
        inputs[1].value = usuario.apellidos || '';
        inputs[2].value = usuario.email || '';
        inputs[3].value = usuario.nombreUsuario || usuario.username || '';
        inputs[4].value = usuario.tipoUsuario || 'user';
        // Marcar el checkbox de activo según el usuario
        const activoCheckbox = document.getElementById('activoUsuario');
        if (activoCheckbox) activoCheckbox.checked = usuario.activo;
        
        usuarioEditandoId = usuario.idUsuario;
        modalTitulo.textContent = 'Editar Usuario';
        modalUsuario.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los datos del usuario');
    }
}

// Modal de confirmación para eliminar usuario
const modalConfirmarEliminar = document.getElementById('modalConfirmarEliminar');
const textoConfirmarEliminar = document.getElementById('textoConfirmarEliminar');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
let usuarioAEliminarId = null;

function mostrarModalEliminarUsuario(id, nombreCompleto) {
    usuarioAEliminarId = id;
    textoConfirmarEliminar.innerHTML = `Vas a eliminar al usuario <span class="font-bold">${nombreCompleto}</span>. ¿Confirmar?`;
    modalConfirmarEliminar.classList.remove('hidden');
}

btnCancelarEliminar.addEventListener('click', () => {
    usuarioAEliminarId = null;
    modalConfirmarEliminar.classList.add('hidden');
});

btnConfirmarEliminar.addEventListener('click', async () => {
    if (!usuarioAEliminarId) return;
    try {
        const response = await fetch(`${API_BASE_URL}/EliminarUsuarioServlet?id=${usuarioAEliminarId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar usuario');
        }
        alert('Usuario eliminado correctamente');
        cargarUsuarios();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el usuario');
    } finally {
        usuarioAEliminarId = null;
        modalConfirmarEliminar.classList.add('hidden');
    }
});

// Función para ver detalles del usuario
async function verUsuario(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/ObtenerUsuarioServlet?id=${id}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener usuario');
        }
        
        const usuario = await response.json();
        
        const detalles = `
            ID: ${usuario.idUsuario}
            Nombre: ${usuario.nombre} ${usuario.apellidos}
            Username: ${usuario.nombreUsuario || usuario.username}
            Email: ${usuario.email}
            Ciudad: ${usuario.ciudad || 'N/A'}
            Sexo: ${usuario.sexo || 'N/A'}
            Tipo: ${usuario.tipoUsuario}
            Estado: ${usuario.activo ? 'Activo' : 'Inactivo'}
        `;
        
        alert(detalles);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al obtener los detalles del usuario');
    }
}

// Cerrar modal
btnCerrarModal.addEventListener('click', () => {
    modalUsuario.classList.add('hidden');
    usuarioEditandoId = null;
});

btnCancelar.addEventListener('click', () => {
    modalUsuario.classList.add('hidden');
    usuarioEditandoId = null;
});

window.addEventListener('click', (e) => {
    if (e.target === modalUsuario) {
        modalUsuario.classList.add('hidden');
        usuarioEditandoId = null;
    }
});

// Enviar formulario (crear o actualizar)
formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const inputs = formUsuario.elements;
    
    const usuario = {
        nombre: inputs[0].value,
        apellidos: inputs[1].value,
        email: inputs[2].value,
        nombreUsuario: inputs[3].value,
        tipoUsuario: inputs[4].value,
        activo: document.getElementById('activoUsuario').checked
    };

    try {
        if (usuarioEditandoId) {
            // Actualizar usuario existente
            usuario.idUsuario = usuarioEditandoId;

            const response = await fetch(`${API_BASE_URL}/ActualizarUsuarioServlet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar usuario');
            }

            alert('Usuario actualizado correctamente');
        } else {
            // Crear nuevo usuario
            const response = await fetch(`${API_BASE_URL}/RegistroServlet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                throw new Error('Error al crear usuario');
            }

            alert('Usuario creado correctamente');
        }

        modalUsuario.classList.add('hidden');
        usuarioEditandoId = null;
        cargarUsuarios(); // Recargar la lista

    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar el usuario');
    }
});