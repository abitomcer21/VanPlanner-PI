document.addEventListener('DOMContentLoaded', inicializar);

function inicializar() {
    cargarNombre();
    cargarViajesUsuario();
    cargarRecordatorios();
}

// ========== GESTIÓN DE RECORDATORIOS ==========

function cargarRecordatorios() {
    const usuarioJson = localStorage.getItem('usuario');
    
    if (!usuarioJson) {
        console.error('No hay usuario en sesión');
        return;
    }
    
    const usuario = JSON.parse(usuarioJson);
    const usuarioId = usuario.id_usuario || usuario.id || usuario.idUsuario;
    
    if (!usuarioId) {
        console.error('No se pudo obtener el ID del usuario');
        return;
    }
    
    fetch(`http://localhost:8080/VanPlannerBack/ObtenerRecordatoriosServlet?usuario_id=${usuarioId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(recordatorios => {
            mostrarRecordatorios(recordatorios);
        })
        .catch(error => {
            console.error('Error al cargar recordatorios:', error);
            // Mostrar mensaje de error en la interfaz
            const listaRecordatorios = document.getElementById('lista-recordatorios');
            if (listaRecordatorios) {
                listaRecordatorios.innerHTML = '<p class="text-red-500 text-sm">Error al cargar recordatorios</p>';
            }
        });
}

function mostrarRecordatorios(recordatorios) {
    const listaRecordatorios = document.getElementById('lista-recordatorios');
    const mensajeSinRecordatorios = document.getElementById('mensaje-sin-recordatorios');
    
    if (!listaRecordatorios) return;
    
    if (recordatorios.length === 0) {
        listaRecordatorios.classList.add('hidden');
        if (mensajeSinRecordatorios) mensajeSinRecordatorios.classList.remove('hidden');
        return;
    }
    
    listaRecordatorios.classList.remove('hidden');
    if (mensajeSinRecordatorios) mensajeSinRecordatorios.classList.add('hidden');
    
    listaRecordatorios.innerHTML = recordatorios.map(recordatorio => `
        <div class="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group ${
            recordatorio.completado ? 'opacity-60' : ''
        }">
            <input type="checkbox" 
                id="recordatorio-${recordatorio.idRecordatorio}" 
                ${recordatorio.completado ? 'checked' : ''}
                onchange="toggleRecordatorio(${recordatorio.idRecordatorio}, this.checked)"
                class="mt-1 w-4 h-4 text-van-primario-v2 border-gray-300 rounded focus:ring-van-primario-v2 cursor-pointer">
            <label for="recordatorio-${recordatorio.idRecordatorio}" class="flex-1 text-gray-700 text-sm cursor-pointer ${
                recordatorio.completado ? 'line-through text-gray-500' : ''
            }">
                ${recordatorio.texto}
            </label>
            <button onclick="eliminarRecordatorio(${recordatorio.idRecordatorio})" 
                class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <i class="fas fa-trash-alt text-sm"></i>
            </button>
        </div>
    `).join('');
}

function agregarRecordatorio() {
    const input = document.getElementById('input-nuevo-recordatorio');
    if (!input) return;
    
    const textoRecordatorio = input.value.trim();
    
    if (textoRecordatorio === '') {
        return;
    }
    
    const usuarioJson = localStorage.getItem('usuario');
    if (!usuarioJson) {
        console.error('No hay usuario en sesión');
        return;
    }
    
    const usuario = JSON.parse(usuarioJson);
    const usuarioId = usuario.id_usuario || usuario.id || usuario.idUsuario;
    
    if (!usuarioId) {
        console.error('No se pudo obtener el ID del usuario');
        return;
    }
    
    const params = new URLSearchParams();
    params.append('usuario_id', usuarioId);
    params.append('texto', textoRecordatorio);
    
    fetch('http://localhost:8080/VanPlannerBack/AddRecordatorioServlet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            input.value = '';
            cargarRecordatorios(); // Recargar la lista
        } else {
            console.error('Error al añadir recordatorio:', result.message);
            alert('Error al añadir el recordatorio');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    });
}

function toggleRecordatorio(idRecordatorio, completado) {
    const params = new URLSearchParams();
    params.append('id_recordatorio', idRecordatorio);
    params.append('completado', completado);
    
    fetch('http://localhost:8080/VanPlannerBack/ActualizarRecordatorioServlet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            cargarRecordatorios(); // Recargar la lista
        } else {
            console.error('Error al actualizar recordatorio:', result.message);
            alert('Error al actualizar el recordatorio');
            cargarRecordatorios(); // Recargar para revertir el cambio en la UI
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
        cargarRecordatorios(); // Recargar para revertir el cambio en la UI
    });
}

function eliminarRecordatorio(idRecordatorio) {
    if (!confirm('¿Estás seguro de que deseas eliminar este recordatorio?')) {
        return;
    }
    
    const params = new URLSearchParams();
    params.append('id_recordatorio', idRecordatorio);
    
    fetch('http://localhost:8080/VanPlannerBack/EliminarRecordatorioServlet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            cargarRecordatorios(); // Recargar la lista
        } else {
            console.error('Error al eliminar recordatorio:', result.message);
            alert('Error al eliminar el recordatorio');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    });
}

// Exponer funciones globalmente para uso en onclick
window.agregarRecordatorio = agregarRecordatorio;
window.toggleRecordatorio = toggleRecordatorio;
window.eliminarRecordatorio = eliminarRecordatorio;

function cargarNombre() {
    let usuarioJson = localStorage.getItem('usuario');

    if (usuarioJson != null) {
        let usuario = JSON.parse(usuarioJson);
        const nombreElement = document.getElementById('nombreUsuario');
        if (nombreElement) {
            nombreElement.innerText = nombreElement.innerText.replace('{nombre}', usuario.nombre);
        }
    }
}

function cargarViajesUsuario() {
    let usuarioJson = localStorage.getItem('usuario');

    if (usuarioJson != null) {
        let usuario = JSON.parse(usuarioJson);
        
        // Obtener el ID del usuario
        let idUsuario = usuario.id_usuario || usuario.id || usuario.idUsuario || localStorage.getItem('usuarioId');

        if (!idUsuario) {
            console.error('No se pudo obtener el ID del usuario');
            return;
        }

        console.log('Cargando viajes para usuario ID:', idUsuario);

        // Hacer petición al servlet para obtener los viajes del usuario
        fetch(`http://localhost:8080/VanPlannerBack/ObtenerViajesUsuarioServlet?usuario=${idUsuario}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(viajes => {
                console.log('Viajes recibidos:', viajes);
                mostrarProximoViaje(viajes);
                mostrarTodosLosViajes(viajes);
                actualizarResumen(viajes);
            })
            .catch(error => {
                console.error('Error al cargar los viajes:', error);
            });
    }
}

function mostrarProximoViaje(viajes) {
    if (viajes.length === 0) {
        // Si no hay viajes, ocultar o mostrar mensaje
        const proximoViajeCard = document.querySelector('.bg-gradient-to-l');
        if (proximoViajeCard) {
            proximoViajeCard.innerHTML = `
                <h2 class="text-sm font-medium text-black mb-2">PRÓXIMO VIAJE</h2>
                <p class="text-black">No tienes viajes programados</p>
            `;
        }
        return;
    }

    // Normalizar fecha actual (sin horas) para comparación correcta
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Ordenar todos los viajes por fecha de inicio
    const viajesOrdenados = viajes.slice().sort((a, b) => {
        const fechaA = (a.fecha_inicio && a.fecha_inicio !== '0000-00-00') ? new Date(a.fecha_inicio) : new Date('9999-12-31');
        const fechaB = (b.fecha_inicio && b.fecha_inicio !== '0000-00-00') ? new Date(b.fecha_inicio) : new Date('9999-12-31');
        return fechaA - fechaB;
    });

    // Buscar el próximo viaje futuro o actual
    let proximoViaje = viajesOrdenados.find(v => {
        const fechaFin = new Date(v.fecha_fin);
        fechaFin.setHours(23, 59, 59, 999);
        return fechaFin >= hoy;
    });

    // Si no hay viajes futuros, mostrar el más reciente
    if (!proximoViaje) {
        proximoViaje = viajesOrdenados[viajesOrdenados.length - 1];
    }

    // Formatear fechas
    const fechaInicio = new Date(proximoViaje.fecha_inicio);
    const fechaFin = new Date(proximoViaje.fecha_fin);
    const fechasTexto = `${fechaInicio.getDate()} - ${fechaFin.getDate()} ${obtenerNombreMes(fechaInicio.getMonth()).toUpperCase()}`;

    // Actualizar la tarjeta de próximo viaje
    const proximoViajeCard = document.querySelector('.bg-gradient-to-l');
    if (proximoViajeCard) {
        proximoViajeCard.innerHTML = `
            <h2 class="text-sm font-medium text-black mb-2">PRÓXIMO VIAJE</h2>
            <h3 class="text-black font-bold mb-2">${proximoViaje.nombre_viaje || 'Sin nombre'}</h3>
            <p class="text-black mb-4">${proximoViaje.origen || ''} → ${proximoViaje.destino || ''} · ${fechasTexto}</p>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div class="text-black font-semibold">${proximoViaje.distancia_total || '--'}km</div>
                <div class="flex gap-2">
                    <button onclick="abrirPopupCompartir(${proximoViaje.id_viaje})" class="bg-van-primario-v2 text-black px-3 py-1 rounded-full text-sm">Compartir</button>
                    <a href="verViajeEspecifico.html?id=${proximoViaje.id_viaje}" class="bg-van-primario-v2 text-black px-3 py-1 rounded-full text-sm">Abrir</a>
                </div>
            </div>
        `;
    }
}

function actualizarResumen(viajes) {
    // Obtener el usuario logueado
    const usuarioJson = localStorage.getItem('usuario');
    if (!usuarioJson) {
        console.error('No hay usuario en sesión');
        return;
    }
    
    const usuario = JSON.parse(usuarioJson);
    const idUsuario = usuario.id_usuario || usuario.id || usuario.idUsuario;
    
    // Calcular total de viajes
    const totalViajes = viajes.length;
    
    // Calcular kilómetros totales
    const totalKm = viajes.reduce((suma, viaje) => {
        const km = parseInt(viaje.distancia_total) || 0;
        return suma + km;
    }, 0);
    
    // Calcular viajes activos (viajes que no han terminado)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const viajesActivos = viajes.filter(viaje => {
        if (!viaje.fecha_fin || viaje.fecha_fin === '0000-00-00') {
            return false;
        }
        const fechaFin = new Date(viaje.fecha_fin);
        fechaFin.setHours(23, 59, 59, 999);
        return fechaFin >= hoy;
    }).length;
    
    // Calcular viajes compartidos (viajes donde el usuario NO es el propietario)
    const viajesCompartidos = viajes.filter(viaje => {
        // Si el viaje tiene propietario_id, compararlo con el usuario actual
        if (viaje.propietario_id || viaje.id_usuario_propietario || viaje.usuario_id) {
            const propietarioId = viaje.propietario_id || viaje.id_usuario_propietario || viaje.usuario_id;
            return parseInt(propietarioId) !== parseInt(idUsuario);
        }
        return false;
    }).length;
    
    // Actualizar los elementos del DOM
    const totalViajesElement = document.getElementById('total-viajes');
    const totalKmElement = document.getElementById('total-km');
    const viajesActivosElement = document.getElementById('viajes-activos');
    const viajesCompartidosElement = document.getElementById('viajes-compartidos');
    
    if (totalViajesElement) totalViajesElement.textContent = totalViajes;
    if (totalKmElement) totalKmElement.textContent = totalKm;
    if (viajesActivosElement) viajesActivosElement.textContent = viajesActivos;
    if (viajesCompartidosElement) viajesCompartidosElement.textContent = viajesCompartidos;
    
    console.log('Resumen actualizado:', {
        totalViajes,
        totalKm,
        viajesActivos,
        viajesCompartidos
    });
}

function mostrarTodosLosViajes(viajes) {
    const container = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-2');
    
    if (!container) {
        console.error('No se encontró el contenedor de viajes');
        return;
    }

    // Limpiar tarjetas existentes (excepto los botones especiales al final)
    const botonesEspeciales = container.querySelector('.flex.flex-col.gap-3');
    container.innerHTML = '';

    if (viajes.length === 0) {
        container.innerHTML = '<div class="col-span-2 text-center text-gray-600">No tienes viajes registrados</div>';
        if (botonesEspeciales) {
            container.appendChild(botonesEspeciales);
        }
        return;
    }

    // Ordenar viajes por fecha de inicio (del más próximo al menos próximo)
    const viajesOrdenados = viajes.slice().sort((a, b) => {
        const fechaA = (a.fecha_inicio && a.fecha_inicio !== '0000-00-00') ? new Date(a.fecha_inicio) : new Date('9999-12-31');
        const fechaB = (b.fecha_inicio && b.fecha_inicio !== '0000-00-00') ? new Date(b.fecha_inicio) : new Date('9999-12-31');
        return fechaA - fechaB;
    });

    // Crear tarjetas para cada viaje
    viajesOrdenados.forEach(viaje => {
        const tarjeta = crearTarjetaViaje(viaje);
        container.appendChild(tarjeta);
    });

    // Agregar de nuevo los botones especiales al final
    if (botonesEspeciales) {
        container.appendChild(botonesEspeciales);
    }
}

function crearTarjetaViaje(viaje) {
    const fechaInicio = new Date(viaje.fecha_inicio);
    const fechaFin = new Date(viaje.fecha_fin);
    
    // Formatear fechas
    let fechaTexto;
    if (fechaInicio.getDate() === fechaFin.getDate() && fechaInicio.getMonth() === fechaFin.getMonth()) {
        fechaTexto = `Día ${fechaInicio.getDate()}`;
    } else {
        fechaTexto = `del ${String(fechaInicio.getDate()).padStart(2, '0')} al ${String(fechaFin.getDate()).padStart(2, '0')}`;
    }
    
    const mesTexto = obtenerNombreMes(fechaInicio.getMonth());
    const idViaje = viaje.id_viaje || 0;
    const nombreViaje = viaje.nombre_viaje || viaje.nombre || 'este viaje';

    const div = document.createElement('div');
    div.className = 'bg-van-primario-v2 rounded-lg p-3 shadow-sm border border-gray-200 flex flex-col min-h-[120px]';
    
    div.innerHTML = `
        <a href="verViajeEspecifico.html?id=${idViaje}" class="font-bold text-white text-center truncate mb-1 hover:underline cursor-pointer block">${(viaje.nombre_viaje || 'Sin nombre').toUpperCase()}</a>
        <div class="font-medium text-white text-center text-sm mb-1">${fechaTexto}</div>
        <div class="text-white font-medium text-center text-sm mb-3">${mesTexto}</div>
        <div class="flex flex-col gap-2 mt-auto">
            <a href="editarViaje.html?id=${idViaje}"
                class="bg-van-primario-v1 text-black rounded-lg py-1 px-2 text-xs hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-x-1">
                <i class="fas fa-edit text-xs"></i>
                editar
            </a>
            <button onclick="confirmarEliminarViaje(${idViaje}, '${nombreViaje.replace(/'/g, "\\'")}')" 
                class="text-white rounded-lg py-1 px-2 text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-x-1"
                style="background-color: #DC2626;">
                <i class="fas fa-trash text-xs"></i>
                eliminar
            </button>
        </div>
    `;
    
    return div;
}

function obtenerNombreMes(mes) {
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes];
}

// Variables y funciones para eliminar viaje
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

async function eliminarViaje(idViaje) {
    try {
        const response = await fetch('http://localhost:8080/VanPlannerBack/EliminarViajeServlet', {
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
            cargarViajesUsuario();
        } else {
            alert('Error al eliminar el viaje: ' + (data.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error al eliminar el viaje:', error);
        alert('No se pudo eliminar el viaje. Por favor, intenta de nuevo.');
    }
}

// ========== FUNCIONES PARA COMPARTIR VIAJE ==========

function abrirPopupCompartir(idViaje) {
    const popup = document.getElementById('popup-colaborador');
    if (popup) {
        // Guardar el ID del viaje para usarlo al enviar la invitación
        popup.dataset.idViaje = idViaje;
        popup.classList.remove('hidden');
        // Limpiar campos
        document.getElementById('email-colaborador').value = '';
        document.getElementById('error-colaborador').classList.add('hidden');
        document.getElementById('success-colaborador').classList.add('hidden');
    }
}

function cerrarPopupCompartir() {
    const popup = document.getElementById('popup-colaborador');
    if (popup) {
        popup.classList.add('hidden');
    }
}

function enviarInvitacionColaborador(event) {
    event.preventDefault();

    const emailColaborador = document.getElementById('email-colaborador').value;
    const errorElement = document.getElementById('error-colaborador');
    const successElement = document.getElementById('success-colaborador');
    const popup = document.getElementById('popup-colaborador');

    // Limpiar mensajes previos
    errorElement.classList.add('hidden');
    successElement.classList.add('hidden');

    // Obtener el ID del viaje del popup
    const idViaje = popup.dataset.idViaje;

    if (!idViaje) {
        errorElement.textContent = 'Error: No se pudo identificar el viaje.';
        errorElement.classList.remove('hidden');
        return;
    }

    // Preparar los datos para enviar
    const datos = {
        id_viaje: parseInt(idViaje),
        email_colaborador: emailColaborador
    };

    console.log('Enviando invitación a colaborador:', datos);

    // Hacer la petición al servlet
    fetch('http://localhost:8080/VanPlannerBack/AddColaboradorServlet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);

            if (data.success) {
                successElement.textContent = '✓ Invitación enviada correctamente';
                successElement.classList.remove('hidden');

                // Cerrar el popup después de 2 segundos
                setTimeout(() => {
                    cerrarPopupCompartir();
                }, 2000);
            } else {
                errorElement.textContent = data.message || 'Error al enviar la invitación';
                errorElement.classList.remove('hidden');
            }
        })
        .catch(error => {
            console.error('Error al enviar invitación:', error);
            errorElement.textContent = 'Error al enviar la invitación. Por favor, intenta de nuevo.';
            errorElement.classList.remove('hidden');
        });
}

// Inicializar event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Event listener para el formulario de colaborador
    const formColaborador = document.getElementById('form-add-colaborador');
    if (formColaborador) {
        formColaborador.addEventListener('submit', enviarInvitacionColaborador);
    }
});

// Exponer funciones globalmente
window.abrirPopupCompartir = abrirPopupCompartir;
window.cerrarPopupCompartir = cerrarPopupCompartir;

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
