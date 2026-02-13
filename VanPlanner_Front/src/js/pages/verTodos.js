
document.addEventListener('DOMContentLoaded', () => {
    // Espera a que el headerLoggeado se cargue antes de continuar
    const esperarHeader = () => {
        const nombreSpan = document.getElementById('nombreUsuario');
        if (nombreSpan) {
            cargarNombre();
            cargarViajes();
        } else {
            setTimeout(esperarHeader, 50);
        }
    };
    esperarHeader();
});

function cargarNombre() {
    let usuarioJson = localStorage.getItem('usuario');

    if (usuarioJson != null) {
        let usuario = JSON.parse(usuarioJson);

        document.getElementById('nombreUsuario').innerText = document.getElementById('nombreUsuario').innerText.replace('{nombre}', usuario.nombre);
    }
}

function cargarViajes() {
    let usuarioJson = localStorage.getItem('usuario');

    if (usuarioJson != null) {
        let usuario = JSON.parse(usuarioJson);
        
        // Obtener el ID del usuario (puede ser id, id_usuario, idUsuario, etc.)
        let idUsuario = usuario.id_usuario || usuario.id || usuario.idUsuario || localStorage.getItem('usuarioId');

        if (!idUsuario) {
            console.error('No se pudo obtener el ID del usuario');
            document.getElementById('viajes-container').innerHTML = '<div class="col-span-full text-center text-white text-xl">Error: No se pudo identificar el usuario</div>';
            return;
        }

        console.log('Cargando viajes para usuario ID:', idUsuario);

        // Hacer petición al servlet para obtener los viajes del usuario
        fetch(`https://back.vanplanner.duckdns.org/ObtenerViajesUsuarioServlet?usuario=${idUsuario}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(viajes => {
                console.log('Viajes recibidos:', viajes);
                mostrarViajes(viajes);
            })
            .catch(error => {
                console.error('Error al cargar los viajes:', error);
                // Si hay error, mostrar el contenedor vacío
                document.getElementById('viajes-container').innerHTML = '<div class="col-span-full text-center text-white text-xl">No se pudieron cargar los viajes. Verifica tu conexión.</div>';
            });
    } else {
        console.error('No hay usuario en localStorage');
        document.getElementById('viajes-container').innerHTML = '<div class="col-span-full text-center text-white text-xl">Por favor, inicia sesión</div>';
    }
}

function mostrarViajes(viajes) {
    const container = document.getElementById('viajes-container');
    container.innerHTML = ''; // Limpiar el contenedor

    if (viajes.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center text-white text-xl">No tienes viajes registrados aún</div>';
        return;
    }

    // Ordenar viajes por fecha de inicio (del más próximo al menos próximo)
    const viajesOrdenados = viajes.slice().sort((a, b) => {
        const fechaA = (a.fecha_inicio && a.fecha_inicio !== '0000-00-00') ? new Date(a.fecha_inicio) : new Date('9999-12-31');
        const fechaB = (b.fecha_inicio && b.fecha_inicio !== '0000-00-00') ? new Date(b.fecha_inicio) : new Date('9999-12-31');
        return fechaA - fechaB;
    });

    viajesOrdenados.forEach(viaje => {
        const viajeCard = crearTarjetaViaje(viaje);
        container.appendChild(viajeCard);
    });
}

function crearTarjetaViaje(viaje) {
    // Formatear las fechas
    const fechaInicio = viaje.fecha_inicio ? formatearFecha(viaje.fecha_inicio) : 'Sin fecha';
    const fechaFin = viaje.fecha_fin ? formatearFecha(viaje.fecha_fin) : '';
    const fechasTexto = fechaFin ? `${fechaInicio} - ${fechaFin}` : fechaInicio;

    // Obtener el ID del viaje
    const idViaje = viaje.id_viaje || viaje.id || viaje.idViaje;

    // Crear el elemento
    const div = document.createElement('div');
    div.className = 'bg-van-primario-v2 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-5 text-white flex flex-col border border-white/20 min-h-[160px]';
    
    div.innerHTML = `
        <div class="flex justify-between items-start mb-3 gap-2">
            <div class="flex-1 min-w-0">
                <a href="verViajeEspecifico.html?id=${idViaje}" class="text-lg md:text-xl font-bold truncate hover:underline cursor-pointer block">${viaje.nombre_viaje || viaje.nombre || 'Sin nombre'}</a>
                <p class="text-blue-100 text-sm md:text-base mt-1">${fechasTexto}</p>
            </div>
            <div class="flex flex-col gap-2 flex-shrink-0">
                <a href="editarViaje.html?id=${idViaje}"
                    class="bg-van-primario-v1 hover:bg-yellow-800 text-white p-1.5 md:p-2 rounded-full transition duration-300 flex items-center justify-center w-8 h-8 md:w-10 md:h-10">
                    <i class="fas fa-pen text-xs md:text-sm"></i>
                </a>
                <button onclick="confirmarEliminarViaje(${idViaje}, '${(viaje.nombre_viaje || viaje.nombre || 'este viaje').replace(/'/g, "\\'")}')"
                    class="text-white p-1.5 md:p-2 rounded-full transition duration-300 flex items-center justify-center w-8 h-8 md:w-10 md:h-10"
                    style="background-color: #DC2626;"
                    onmouseover="this.style.backgroundColor='#B91C1C'"
                    onmouseout="this.style.backgroundColor='#DC2626'">
                    <i class="fas fa-trash text-xs md:text-sm"></i>
                </button>
            </div>
        </div>
        <p class="text-blue-100 text-sm md:text-base mt-auto line-clamp-2">${viaje.descripcion || 'Sin descripción'}</p>
    `;
    
    return div;
}

function formatearFecha(fecha) {
    // Si la fecha viene en formato timestamp o ISO
    const date = new Date(fecha);
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', opciones);
}

// Función para añadir un nuevo viaje dinámicamente (se puede llamar después de crear un viaje)
function agregarViajeNuevo(viaje) {
    const container = document.getElementById('viajes-container');
    
    // Si el contenedor está vacío (mensaje de "no hay viajes"), limpiarlo
    if (container.querySelector('.col-span-full')) {
        container.innerHTML = '';
    }
    
    const viajeCard = crearTarjetaViaje(viaje);
    container.appendChild(viajeCard);
}

// Función para confirmar eliminación de viaje
let viajeAEliminar = null;

function confirmarEliminarViaje(idViaje, nombreViaje) {
    viajeAEliminar = idViaje;
    const nombreElement = document.getElementById('nombre-viaje-eliminar');
    if (nombreElement) {
        nombreElement.textContent = `"${nombreViaje}"`;
    }
    
    const popup = document.getElementById('popup-eliminar-viaje');
    if (popup) {
        popup.classList.remove('hidden');
    }
}

function cerrarPopupEliminar() {
    const popup = document.getElementById('popup-eliminar-viaje');
    if (popup) {
        popup.classList.add('hidden');
    }
    viajeAEliminar = null;
}

function confirmarEliminacion() {
    if (viajeAEliminar) {
        eliminarViaje(viajeAEliminar);
        cerrarPopupEliminar();
    }
}

// Función para eliminar un viaje
async function eliminarViaje(idViaje) {
    try {
        const response = await fetch('https://back.vanplanner.duckdns.org/EliminarViajeServlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id_viaje=${idViaje}`
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Mostrar mensaje de éxito
            mostrarMensajeExito('¡Viaje eliminado con éxito!');
            // Recargar los viajes
            cargarViajes();
        } else {
            alert('Error al eliminar el viaje: ' + (data.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error al eliminar el viaje:', error);
        alert('No se pudo eliminar el viaje. Por favor, intenta de nuevo.');
    }
}

function mostrarMensajeExito(mensaje) {
    // Crear el elemento del mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-fade-in';
    mensajeDiv.innerHTML = `
        <i class="fas fa-check-circle text-2xl"></i>
        <span class="font-semibold">${mensaje}</span>
    `;
    
    document.body.appendChild(mensajeDiv);
    
    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
        mensajeDiv.style.opacity = '0';
        mensajeDiv.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(mensajeDiv);
        }, 500);
    }, 3000);
}