document.addEventListener('DOMContentLoaded', inicializar);

// Variable global para almacenar todas las paradas
let todasLasParadas = [];

// Hacer toggleDia disponible globalmente
window.toggleDia = function(idDia) {
    const contenido = document.getElementById(idDia);
    const icono = document.getElementById('icono-' + idDia);
    
    if (contenido && icono) {
        contenido.classList.toggle('hidden');
        icono.classList.toggle('rotate-180');
    }
};

function inicializar() {
    cargarNombre();
    cargarViajeDesdeURL();
}

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

function cargarViajeDesdeURL() {
    // Obtener el ID del viaje de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idViaje = urlParams.get('id');

    if (idViaje) {
        console.log('Cargando viaje con ID:', idViaje);
        cargarDatosViaje(idViaje);
    } else {
        console.log('No se proporcionó ID de viaje en la URL');
    }
}

function cargarDatosViaje(idViaje) {
    // Obtener el ID del usuario del localStorage
    let usuarioJson = localStorage.getItem('usuario');
    
    if (!usuarioJson) {
        alert('No hay sesión activa. Por favor, inicia sesión.');
        window.location.href = 'inicioSesion.html';
        return;
    }
    
    let usuario = JSON.parse(usuarioJson);
    let idUsuario = usuario.id_usuario || usuario.id || usuario.idUsuario || localStorage.getItem('usuarioId');
    
    if (!idUsuario) {
        alert('No se pudo identificar el usuario.');
        return;
    }
    
    // Obtener todos los viajes del usuario y filtrar el específico
    fetch(`http://localhost:8080/VanPlannerBack/ObtenerViajesUsuarioServlet?usuario=${idUsuario}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(viajes => {
            console.log('Viajes recibidos:', viajes);
            // Filtrar el viaje específico por ID
            const viaje = viajes.find(v => (v.id_viaje || v.id) == idViaje);
            
            if (viaje) {
                console.log('Viaje encontrado:', viaje);
                mostrarDatosViaje(viaje);
                // Deshabilitar campos después de cargar los datos
                setTimeout(deshabilitarTodosLosCampos, 500);
            } else {
                console.error('Viaje no encontrado con ID:', idViaje);
                alert('No se encontró el viaje solicitado.');
            }
        })
        .catch(error => {
            console.error('Error al cargar el viaje:', error);
            alert('No se pudo cargar el viaje. Por favor, intenta de nuevo.');
        });
}

function mostrarDatosViaje(viaje) {
    // Guardar el viaje actual en una variable global para usarlo después
    window.viajeActual = viaje;

    console.log('Mostrando datos del viaje:', viaje);

    // Actualizar el título de la página
    document.title = `Ver ${viaje.nombre_viaje || 'Viaje'} - VanPlanner`;

    // Rellenar el origen (ID correcto de la nueva interfaz)
    const origenInput = document.getElementById('input-origen');
    if (origenInput) {
        origenInput.value = viaje.origen || '';
        console.log('Origen rellenado:', viaje.origen);
    } else {
        console.error('No se encontró input-origen');
    }

    // Rellenar el destino (ID correcto de la nueva interfaz)
    const destinoInput = document.getElementById('input-destino');
    if (destinoInput) {
        destinoInput.value = viaje.destino || '';
        console.log('Destino rellenado:', viaje.destino);
    } else {
        console.error('No se encontró input-destino');
    }

    // Rellenar fechas si existen
    const fechaInicioInput = document.getElementById('fecha-inicio');
    console.log('Fecha inicio desde servidor:', viaje.fecha_inicio, 'Tipo:', typeof viaje.fecha_inicio);
    if (fechaInicioInput && viaje.fecha_inicio && viaje.fecha_inicio !== '0000-00-00') {
        try {
            // Convertir la fecha al formato yyyy-mm-dd para el input type="date"
            const fechaInicioNormalizada = normalizarFecha(viaje.fecha_inicio);
            if (!fechaInicioNormalizada) {
                console.warn('Fecha inicio inválida:', viaje.fecha_inicio);
            } else {
                fechaInicioInput.value = fechaInicioNormalizada;
                console.log('Fecha inicio rellenada:', fechaInicioInput.value);
            }
        } catch (e) {
            console.error('Error al procesar fecha inicio:', e);
        }
    }

    const fechaFinInput = document.getElementById('fecha-fin');
    console.log('Fecha fin desde servidor:', viaje.fecha_fin, 'Tipo:', typeof viaje.fecha_fin);
    if (fechaFinInput && viaje.fecha_fin && viaje.fecha_fin !== '0000-00-00') {
        try {
            const fechaFinNormalizada = normalizarFecha(viaje.fecha_fin);
            if (!fechaFinNormalizada) {
                console.warn('Fecha fin inválida:', viaje.fecha_fin);
            } else {
                fechaFinInput.value = fechaFinNormalizada;
                console.log('Fecha fin rellenada:', fechaFinInput.value);
            }
        } catch (e) {
            console.error('Error al procesar fecha fin:', e);
        }
    }

    // Mostrar distancia total
    const distanciaElement = document.getElementById('distancia-total');
    if (distanciaElement && viaje.distancia_total) {
        distanciaElement.textContent = `${viaje.distancia_total} km`;
    } else if (distanciaElement) {
        distanciaElement.textContent = '-- km';
    }

    // Actualizar el calendario después de cargar las fechas
    setTimeout(() => {
        actualizarCalendarioConFechas();
    }, 500);

    console.log('Datos del viaje cargados en la interfaz');

    // Cargar colaboradores del viaje
    cargarColaboradores(viaje.id_viaje);

    // Cargar paradas del viaje (para mostrar en el calendario)
    cargarParadas(viaje.id_viaje);

    // Cargar vehículo del viaje
    console.log('Verificando vehículo - vehiculo_id:', viaje.vehiculo_id, 'Tipo:', typeof viaje.vehiculo_id);
    if (viaje.vehiculo_id && viaje.vehiculo_id > 0) {
        console.log('Cargando vehículo con ID:', viaje.vehiculo_id);
        cargarVehiculo(viaje.vehiculo_id);
    } else {
        console.warn('No hay vehiculo_id válido en el viaje');
    }
    
    // Cargar gastos del viaje
    if (typeof window.cargarGastosDesdeDB === 'function') {
        window.cargarGastosDesdeDB(viaje.id_viaje);
    }
}

// Función auxiliar para normalizar fechas a formato ISO (YYYY-MM-DD)
function normalizarFecha(fecha) {
    if (!fecha) return '';

    // Si ya está en formato ISO (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return fecha;
    }

    // Si es un objeto Date o string que Date puede parsear
    const fechaObj = new Date(fecha);
    if (!isNaN(fechaObj.getTime())) {
        const year = fechaObj.getFullYear();
        const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const day = String(fechaObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return '';
}

// Función para actualizar el calendario con las fechas del viaje
function actualizarCalendarioConFechas() {
    // Disparar el evento change en los campos de fecha para que el calendario se actualice
    const fechaInicioInput = document.getElementById('fecha-inicio');
    const fechaFinInput = document.getElementById('fecha-fin');
    
    if (fechaInicioInput && fechaFinInput) {
        // Disparar eventos para que el calendario se actualice
        fechaInicioInput.dispatchEvent(new Event('change'));
        fechaFinInput.dispatchEvent(new Event('change'));
        console.log('Calendario actualizado con las fechas del viaje');
    }
}

// ========== GESTIÓN DE VEHÍCULO ==========

// Función para cargar el vehículo del viaje
async function cargarVehiculo(vehiculoId) {
    try {
        // Obtener el usuario actual
        const usuarioJson = localStorage.getItem('usuario');
        if (!usuarioJson) {
            console.error('No hay usuario en localStorage');
            return;
        }

        const usuario = JSON.parse(usuarioJson);
        console.log('Usuario completo:', usuario);

        // Intentar obtener el ID del usuario de diferentes maneras
        const usuarioId = usuario.id_usuario || usuario.id || usuario.idUsuario || localStorage.getItem('usuarioId');

        console.log('Usuario ID obtenido:', usuarioId, 'Tipo:', typeof usuarioId);

        if (!usuarioId) {
            console.error('No se pudo obtener el ID del usuario');
            return;
        }

        // Obtener todos los vehículos del usuario
        const response = await fetch(`http://localhost:8080/VanPlannerBack/ObtenerVehiculosServlet?usuario_id=${usuarioId}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const vehiculos = await response.json();
        console.log('Vehículos recibidos:', vehiculos);

        // Buscar el vehículo específico
        const vehiculo = vehiculos.find(v => v.id_vehiculo === vehiculoId);

        if (vehiculo) {
            mostrarVehiculo(vehiculo);
        } else {
            console.warn('No se encontró el vehículo con ID:', vehiculoId);
        }

    } catch (error) {
        console.error('Error al cargar el vehículo:', error);
    }
}

// Función para mostrar los datos del vehículo en la interfaz
function mostrarVehiculo(vehiculo) {
    const nombreVehiculo = document.getElementById('nombre-vehiculo');
    const marcaVehiculo = document.getElementById('marca-vehiculo');
    const consumoVehiculo = document.getElementById('consumo-vehiculo');

    if (nombreVehiculo) {
        nombreVehiculo.textContent = vehiculo.matricula || 'Sin nombre';
    }

    if (marcaVehiculo) {
        marcaVehiculo.textContent = vehiculo.marca || 'Sin marca';
    }

    if (consumoVehiculo) {
        consumoVehiculo.textContent = vehiculo.consumo_medio ? `${vehiculo.consumo_medio} L/100km` : '-';
    }

    console.log('Vehículo mostrado:', vehiculo);
}

// ========== GESTIÓN DE COLABORADORES ==========

// Función para cargar colaboradores del viaje
async function cargarColaboradores(idViaje) {
    try {
        const response = await fetch(`http://localhost:8080/VanPlannerBack/ObtenerColaboradoresServlet?id_viaje=${idViaje}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const colaboradores = await response.json();
        mostrarColaboradores(colaboradores);

    } catch (error) {
        console.error('Error al cargar colaboradores:', error);
    }
}

// Función para mostrar colaboradores en la interfaz
function mostrarColaboradores(colaboradores) {
    const listaColaboradores = document.getElementById('lista-colaboradores');

    if (!listaColaboradores) return;

    listaColaboradores.innerHTML = '';

    // Obtener el ID del creador del viaje
    const idCreador = window.viajeActual ? window.viajeActual.usuario_id : null;

    colaboradores.forEach(colaborador => {
        const esConductor = colaborador.usuario_id === idCreador;
        const colorClase = esConductor ? 'blue' : 'green';
        const rolTexto = esConductor ? 'Conductor principal' : 'Colaborador';

        const colaboradorHTML = `
            <div class="flex items-center p-3 border border-gray-200 rounded-lg">
                <div class="h-10 w-10 bg-${colorClase}-100 rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-user text-${colorClase}-600"></i>
                </div>
                <div class="flex-1">
                    <p class="font-medium text-gray-800 text-sm">${colaborador.nombre}</p>
                    <p class="text-xs text-gray-500">${rolTexto}</p>
                </div>
            </div>
        `;

        listaColaboradores.innerHTML += colaboradorHTML;
    });
}

// ========== GESTIÓN DE PARADAS E ITINERARIO ==========

// Nueva función para cargar paradas del viaje
async function cargarParadas(viajeId) {
    if (!viajeId) {
        console.error('No se proporcionó ID de viaje para cargar paradas');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/VanPlannerBack/ObtenerParadasServlet?id_viaje=${viajeId}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const paradas = await response.json();
        console.log('Paradas cargadas:', paradas);
        
        // Guardar paradas en variable global
        todasLasParadas = paradas;

        // Limpiar solo los eventos de paradas anteriores del calendario
        if (window.calendar) {
            window.calendar.getEvents().forEach(event => {
                if (event.id && event.id.startsWith('parada-')) {
                    event.remove();
                }
            });
        }

        // Añadir cada parada al calendario
        if (window.calendar && Array.isArray(paradas)) {
            paradas.forEach(parada => {
                // Extraer la fecha de las notas (formato: "Fecha: 2026-02-10 | Categoría: hotel")
                const fecha = extraerFechaDeNotas(parada.notas);
                const categoria = extraerCategoriaDeNotas(parada.notas);

                if (fecha && parada.hora_estimada_llegada && parada.hora_estimada_salida) {
                    window.calendar.addEvent({
                        id: `parada-${parada.id_parada}`,
                        title: parada.nombre_lugar,
                        start: `${fecha}T${parada.hora_estimada_llegada}`,
                        end: `${fecha}T${parada.hora_estimada_salida}`,
                        color: obtenerColorCategoria(categoria),
                        extendedProps: {
                            id_parada: parada.id_parada,
                            nombre: parada.nombre_lugar,
                            direccion: parada.direccion,
                            tipo: parada.tipo,
                            latitud: parada.latitud,
                            longitud: parada.longitud,
                            notas: parada.notas
                        }
                    });
                }
            });
            console.log(`${paradas.length} paradas añadidas al calendario`);
        }

        // Mostrar paradas organizadas por días en el apartado de itinerario
        mostrarItinerarioPorDias(paradas);

    } catch (error) {
        console.error('Error al cargar paradas:', error);
    }
}

// Función auxiliar para extraer la fecha de las notas
function extraerFechaDeNotas(notas) {
    if (!notas) return null;
    const match = notas.match(/Fecha:\s*(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
}

// Función auxiliar para extraer la categoría de las notas
function extraerCategoriaDeNotas(notas) {
    if (!notas) return 'otro';
    const match = notas.match(/Categoría:\s*(\w+)/);
    return match ? match[1] : 'otro';
}

// Función para mostrar puntos de interés de un día específico
window.mostrarPuntosInteresDelDia = function(fechaSeleccionada) {
    console.log('Mostrando puntos de interés para:', fechaSeleccionada);
    
    // Filtrar paradas del día seleccionado
    const paradasDelDia = todasLasParadas.filter(parada => {
        const fecha = extraerFechaDeNotas(parada.notas);
        return fecha === fechaSeleccionada;
    });
    
    console.log('Paradas encontradas:', paradasDelDia.length);
    
    // Contenedor de puntos de interés
    const contenedorPuntosInteres = document.querySelector('.space-y-2.flex-1.overflow-y-auto.custom-scrollbar');
    
    if (!contenedorPuntosInteres) {
        console.error('No se encontró el contenedor de puntos de interés');
        return;
    }
    
    // Si no hay paradas, mostrar mensaje
    if (paradasDelDia.length === 0) {
        contenedorPuntosInteres.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <i class="fas fa-calendar-times text-3xl mb-2"></i>
                <p class="text-sm">No hay paradas programadas para este día</p>
                <p class="text-xs mt-1">${new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
            </div>
        `;
        return;
    }
    
    // Ordenar paradas por hora de llegada
    paradasDelDia.sort((a, b) => a.hora_estimada_llegada.localeCompare(b.hora_estimada_llegada));
    
    // Generar HTML para mostrar las paradas del día
    let htmlParadas = `
        <div class="bg-blue-50 p-2 rounded-lg mb-2 border border-blue-200">
            <p class="text-xs font-semibold text-blue-700 text-center">
                <i class="fas fa-calendar-day mr-1"></i>
                ${new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
        </div>
    `;
    
    paradasDelDia.forEach(parada => {
        const categoria = extraerCategoriaDeNotas(parada.notas);
        const iconoCategoria = obtenerIconoCategoria(categoria);
        const colorTexto = obtenerColorTextoCategoria(categoria);
        const colorFondo = obtenerColorFondo(categoria);
        
        htmlParadas += `
            <div class="flex items-center p-2 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow text-sm">
                <div class="h-8 w-8 ${colorFondo} rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <i class="${iconoCategoria} ${colorTexto} text-xs"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-800 truncate">${parada.nombre_lugar}</p>
                    <p class="text-xs text-gray-500 truncate">${parada.direccion || ''}</p>
                    <div class="flex items-center gap-1 mt-1">
                        <i class="far fa-clock text-gray-400 text-xs"></i>
                        <span class="text-xs text-gray-600">${parada.hora_estimada_llegada.substring(0, 5)} - ${parada.hora_estimada_salida.substring(0, 5)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    contenedorPuntosInteres.innerHTML = htmlParadas;
};

// Función para mostrar el itinerario organizado por días
function mostrarItinerarioPorDias(paradas) {
    const contenedorItinerario = document.getElementById('contenedor-itinerario');
    
    if (!contenedorItinerario) {
        console.error('No se encontró el contenedor de itinerario');
        return;
    }
    
    if (!paradas || paradas.length === 0) {
        contenedorItinerario.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <i class="fas fa-route text-3xl mb-2"></i>
                <p>No hay paradas programadas aún</p>
            </div>
        `;
        return;
    }
    
    // Organizar paradas por día
    const paradasPorDia = {};
    
    paradas.forEach(parada => {
        const fecha = extraerFechaDeNotas(parada.notas);
        if (fecha) {
            if (!paradasPorDia[fecha]) {
                paradasPorDia[fecha] = [];
            }
            paradasPorDia[fecha].push(parada);
        }
    });
    
    // Ordenar días cronológicamente
    const diasOrdenados = Object.keys(paradasPorDia).sort();
    
    // Generar HTML para cada día
    let htmlItinerario = '';
    
    diasOrdenados.forEach((fecha, index) => {
        const paradasDelDia = paradasPorDia[fecha];
        const numeroDia = index + 1;
        const fechaObj = new Date(fecha + 'T00:00:00');
        const nombreDia = fechaObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        
        // Ordenar paradas del día por hora
        paradasDelDia.sort((a, b) => a.hora_estimada_llegada.localeCompare(b.hora_estimada_llegada));
        
        // HTML del día con acordeón
        htmlItinerario += `
            <div class="border border-gray-200 rounded-lg overflow-hidden mb-3">
                <!-- Cabecera del día -->
                <button onclick="toggleDia('contenido-dia-${numeroDia}')" 
                        class="w-full bg-white hover:bg-gray-50 px-4 py-3 flex items-center justify-between transition-colors">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="font-bold text-blue-600">${numeroDia}</span>
                        </div>
                        <div class="text-left">
                            <p class="font-semibold text-gray-800">Día ${numeroDia}</p>
                            <p class="text-xs text-gray-500">${nombreDia}</p>
                        </div>
                    </div>
                    <i id="icono-contenido-dia-${numeroDia}" class="fas fa-chevron-down text-gray-400 transition-transform"></i>
                </button>
                
                <!-- Contenido del día (paradas) -->
                <div id="contenido-dia-${numeroDia}" class="bg-gray-50 px-4 py-3 space-y-2">
        `;
        
        // Añadir cada parada del día
        paradasDelDia.forEach(parada => {
            const categoria = extraerCategoriaDeNotas(parada.notas);
            const iconoCategoria = obtenerIconoCategoria(categoria);
            const colorTexto = obtenerColorTextoCategoria(categoria);
            const colorFondo = obtenerColorFondo(categoria);
            
            htmlItinerario += `
                <div class="flex items-center p-3 bg-white border border-gray-200 rounded-lg text-sm">
                    <div class="h-10 w-10 ${colorFondo} rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <i class="${iconoCategoria} ${colorTexto}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-gray-800">${parada.nombre_lugar}</p>
                        <p class="text-xs text-gray-500 truncate">${parada.direccion || ''}</p>
                        <div class="flex items-center gap-1 mt-1">
                            <i class="far fa-clock text-gray-400 text-xs"></i>
                            <span class="text-xs text-gray-600">${parada.hora_estimada_llegada.substring(0, 5)} - ${parada.hora_estimada_salida.substring(0, 5)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        htmlItinerario += `
                </div>
            </div>
        `;
    });
    
    contenedorItinerario.innerHTML = htmlItinerario;
}

// Funciones auxiliares para categorías
function obtenerIconoCategoria(categoria) {
    const iconos = {
        'hotel': 'fas fa-bed',
        'restaurante': 'fas fa-utensils',
        'monumento': 'fas fa-landmark',
        'naturaleza': 'fas fa-tree',
        'compras': 'fas fa-shopping-bag',
        'transporte': 'fas fa-bus',
        'otro': 'fas fa-map-marker-alt'
    };
    return iconos[categoria] || iconos['otro'];
}

function obtenerColorTextoCategoria(categoria) {
    const colores = {
        'hotel': 'text-purple-600',
        'restaurante': 'text-blue-600',
        'monumento': 'text-red-600',
        'naturaleza': 'text-green-600',
        'compras': 'text-yellow-600',
        'transporte': 'text-indigo-600',
        'otro': 'text-gray-600'
    };
    return colores[categoria] || colores['otro'];
}

function obtenerColorFondo(categoria) {
    const colores = {
        'hotel': 'bg-purple-100',
        'restaurante': 'bg-blue-100',
        'monumento': 'bg-red-100',
        'naturaleza': 'bg-green-100',
        'compras': 'bg-yellow-100',
        'transporte': 'bg-indigo-100',
        'otro': 'bg-gray-100'
    };
    return colores[categoria] || colores['otro'];
}

function obtenerColorCategoria(categoria) {
    const colores = {
        'hotel': '#9333ea',
        'restaurante': '#3b82f6',
        'monumento': '#ef4444',
        'naturaleza': '#22c55e',
        'compras': '#eab308',
        'transporte': '#6366f1',
        'otro': '#6b7280'
    };
    return colores[categoria] || colores['otro'];
}

function deshabilitarTodosLosCampos() {
    // Deshabilitar todos los inputs EXCEPTO los relacionados con el calendario
    const inputs = document.querySelectorAll('input[type="text"], input[type="date"], input[type="time"], input[type="number"], textarea, select');
    inputs.forEach(input => {
        // No deshabilitar campos de fecha que son parte del calendario
        if (input.id !== 'fecha-inicio' && input.id !== 'fecha-fin') {
            input.disabled = true;
            input.style.backgroundColor = '#f3f4f6';
            input.style.cursor = 'not-allowed';
        }
    });

    // Deshabilitar botones EXCEPTO los del header y navegación del calendario
    const botones = document.querySelectorAll('button');
    botones.forEach(boton => {
        // Permitir botones del header (menú de usuario y navegación)
        // Y permitir botones del calendario (navegación entre meses/días)
        if (!boton.closest('.justify-self-end') && 
            !boton.closest('header') && 
            !boton.closest('#calendar') &&
            !boton.closest('.fc')) {
            boton.disabled = true;
            boton.style.opacity = '0.5';
            boton.style.cursor = 'not-allowed';
        }
    });

    // Deshabilitar enlaces de eliminación
    const botonesEliminar = document.querySelectorAll('.text-red-500, .hover\\:text-red-500');
    botonesEliminar.forEach(boton => {
        if (!boton.closest('#calendar')) {
            boton.style.pointerEvents = 'none';
            boton.style.opacity = '0.5';
            boton.style.cursor = 'not-allowed';
        }
    });

    // Deshabilitar categorías de puntos de interés (para añadir nuevos)
    const categorias = document.querySelectorAll('[id^="categoria-"]');
    categorias.forEach(cat => {
        cat.style.pointerEvents = 'none';
        cat.style.opacity = '0.7';
        cat.style.cursor = 'not-allowed';
    });

    // Deshabilitar el campo de búsqueda del mapa
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.disabled = true;
        searchInput.style.backgroundColor = '#f3f4f6';
        searchInput.style.cursor = 'not-allowed';
    }

    // Deshabilitar botones de añadir gastos
    const botonesAddGasto = document.querySelectorAll('#btn-add-gasolina, #btn-add-hoteles, #btn-add-restaurantes');
    botonesAddGasto.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    });

    console.log('Campos deshabilitados - Modo solo lectura (calendario activo)');
}
