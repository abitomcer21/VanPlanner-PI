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
    inicializarEventListeners();
}

function inicializarEventListeners() {
    // Event listener para el botón de añadir colaborador
    const btnAddColaborador = document.getElementById('btn-add-colaborador');
    if (btnAddColaborador) {
        btnAddColaborador.addEventListener('click', abrirPopupColaborador);
    }

    // Event listener para el formulario de colaborador
    const formColaborador = document.getElementById('form-add-colaborador');
    if (formColaborador) {
        formColaborador.addEventListener('submit', enviarInvitacionColaborador);
    }

    // Event listeners para calcular distancia cuando cambien origen o destino
    const origenInput = document.getElementById('input-origen');
    const destinoInput = document.getElementById('input-destino');

    if (origenInput && destinoInput) {
        origenInput.addEventListener('change', actualizarDistancia);
        destinoInput.addEventListener('change', actualizarDistancia);
    }
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
    document.title = `Editar ${viaje.nombre_viaje || 'Viaje'} - VanPlanner`;

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

    // Disparar el cálculo de distancia DESPUÉS de rellenar los campos
    setTimeout(() => {
        esperarGoogleMapsYCalcularDistancia();
    }, 500); // Un pequeño delay para asegurar que el DOM está actualizado

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

    // Actualizar el calendario después de cargar las fechas
    setTimeout(() => {
        actualizarCalendarioConFechas();
        // Calcular distancia esperando a que Google Maps esté disponible
        // Añadir un delay adicional para asegurar que los inputs tengan los valores
        setTimeout(() => {
            esperarGoogleMapsYCalcularDistancia();
        }, 500);
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

// Función para actualizar el calendario con las fechas del viaje
function actualizarCalendarioConFechas() {
    const fechaInicioInput = document.getElementById('fecha-inicio');
    const fechaFinInput = document.getElementById('fecha-fin');

    if (fechaInicioInput && fechaFinInput) {
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
                ${!esConductor ? `
                <button onclick="eliminarColaborador(${colaborador.id_colaborador})" class="text-gray-400 hover:text-red-500">
                    <i class="fas fa-times text-sm"></i>
                </button>
                ` : ''}
            </div>
        `;

        listaColaboradores.innerHTML += colaboradorHTML;
    });
}

// Función para eliminar colaborador
async function eliminarColaborador(idColaborador) {
    // Mostrar confirmación
    const confirmar = confirm('¿Estás seguro de que deseas eliminar este colaborador del viaje?');

    if (!confirmar) {
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/VanPlannerBack/EliminarColaboradorServlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id_colaborador=${idColaborador}`
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            // Recargar la lista de colaboradores
            if (window.viajeActual && window.viajeActual.id_viaje) {
                cargarColaboradores(window.viajeActual.id_viaje);
            }
            alert('Colaborador eliminado correctamente');
        } else {
            alert('Error: ' + data.message);
        }

    } catch (error) {
        console.error('Error al eliminar colaborador:', error);
        alert('Error al eliminar el colaborador. Por favor, intenta de nuevo.');
    }
}

function abrirPopupColaborador() {
    const popup = document.getElementById('popup-colaborador');
    if (popup) {
        popup.classList.remove('hidden');
        // Limpiar campos
        document.getElementById('email-colaborador').value = '';
        document.getElementById('error-colaborador').classList.add('hidden');
        document.getElementById('success-colaborador').classList.add('hidden');
    }
}

function cerrarPopupColaborador() {
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

    // Limpiar mensajes previos
    errorElement.classList.add('hidden');
    successElement.classList.add('hidden');

    // Validar que hay un viaje cargado
    if (!window.viajeActual || !window.viajeActual.id_viaje) {
        errorElement.textContent = 'Error: No hay un viaje seleccionado.';
        errorElement.classList.remove('hidden');
        return;
    }

    const idViaje = window.viajeActual.id_viaje;

    // Preparar los datos para enviar
    const datos = {
        id_viaje: idViaje,
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

                // Recargar la lista de colaboradores
                cargarColaboradores(idViaje);

                // Cerrar el popup después de 2 segundos
                setTimeout(() => {
                    cerrarPopupColaborador();
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

// ========== CÁLCULO DE DISTANCIA ==========

async function actualizarDistancia() {
    const origen = document.getElementById('input-origen')?.value.trim();
    const destino = document.getElementById('input-destino')?.value.trim();
    const distanciaElement = document.getElementById('distancia-total');

    console.log('Calculando distancia:', { origen, destino });
    console.log('Valores exactos - Origen:', `"${origen}"`, 'Destino:', `"${destino}"`);

    if (!origen || !destino) {
        console.log('Origen o destino vacío, no se puede calcular');
        if (distanciaElement) {
            distanciaElement.textContent = '-- km';
        }
        return;
    }

    try {
        // Verificar que la función de cálculo de distancia esté disponible
        if (typeof window.calcularDistanciaTotal === 'function') {
            console.log('Llamando a calcularDistanciaTotal con origen/destino de los inputs...');

            // Usar SIEMPRE el valor de los inputs de texto para el cálculo.
            const distanciaKm = await window.calcularDistanciaTotal(origen, destino);
            console.log('Distancia calculada:', distanciaKm, 'km');
            
            if (distanciaElement) {
                if (distanciaKm > 0) {
                    distanciaElement.textContent = `${distanciaKm} km`;
                } else {
                    // Si la distancia es 0, podría ser un error o que origen y destino son iguales.
                    // Mostramos un texto neutral en lugar de "Error".
                    distanciaElement.textContent = '0 km'; 
                }
            }

            // Guardar la distancia en el viaje actual y actualizar en la base de datos solo si es válida
            if (window.viajeActual && window.viajeActual.id_viaje && distanciaKm > 0) {
                window.viajeActual.distancia_total = distanciaKm;
                await guardarDistanciaEnBaseDatos(window.viajeActual.id_viaje, distanciaKm);
            } else if (distanciaKm === 0) {
                console.warn('Distancia calculada es 0, no se guardará en BD');
            }
        } else {
            console.error('La función calcularDistanciaTotal no está disponible');
        }
    } catch (error) {
        console.error('Error al calcular distancia:', error);
        if (distanciaElement) {
            distanciaElement.textContent = '-- km';
        }
    }
}

// Función para esperar a que Google Maps esté disponible antes de calcular distancia
function esperarGoogleMapsYCalcularDistancia() {
    let intentos = 0;
    const maxIntentos = 20; // Máximo 10 segundos (20 * 500ms)
    
    const intervalo = setInterval(() => {
        intentos++;
        
        if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
            console.log('Google Maps disponible, calculando distancia...');
            clearInterval(intervalo);
            actualizarDistancia();
        } else if (intentos >= maxIntentos) {
            console.error('Google Maps no se cargó en el tiempo esperado');
            clearInterval(intervalo);
            const distanciaElement = document.getElementById('distancia-total');
            if (distanciaElement) {
                distanciaElement.textContent = 'Error al calcular';
            }
        } else {
            console.log(`Esperando Google Maps... intento ${intentos}/${maxIntentos}`);
        }
    }, 500);
}

// Función para guardar distancia en la base de datos
async function guardarDistanciaEnBaseDatos(idViaje, distanciaKm) {
    try {
        console.log('Intentando guardar distancia en BD:', { idViaje, distanciaKm });
        
        const body = {
            id_viaje: idViaje,
            distancia_total: distanciaKm
        };
        console.log('Body a enviar:', JSON.stringify(body));
        
        const response = await fetch('http://localhost:8080/VanPlannerBack/ActualizarFechasViajeServlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error al actualizar distancia:', response.status, errorText);
        } else {
            const resultado = await response.json();
            console.log('Distancia actualizada en BD:', distanciaKm, 'km', resultado);
        }
    } catch (error) {
        console.error('Error al guardar distancia:', error);
    }
}

// Función para obtener coordenadas desde la tabla paradas
async function obtenerCoordenadasDesdeParadas(idViaje) {
    try {
        const response = await fetch(`http://localhost:8080/VanPlannerBack/ObtenerParadasServlet?id_viaje=${idViaje}`);

        if (!response.ok) {
            console.log('No se pudieron obtener las paradas');
            return { origen: null, destino: null };
        }

        const paradas = await response.json();

        if (paradas && paradas.length > 0) {
            // Ordenar por orden_secuencia
            paradas.sort((a, b) => a.orden_secuencia - b.orden_secuencia);

            const primeraParada = paradas[0];
            const ultimaParada = paradas[paradas.length - 1];

            return {
                origen: primeraParada.latitud && primeraParada.longitud ?
                    { lat: parseFloat(primeraParada.latitud), lng: parseFloat(primeraParada.longitud) } : null,
                destino: ultimaParada.latitud && ultimaParada.longitud ?
                    { lat: parseFloat(ultimaParada.latitud), lng: parseFloat(ultimaParada.longitud) } : null
            };
        }

        return { origen: null, destino: null };
    } catch (error) {
        console.error('Error obteniendo coordenadas de paradas:', error);
        return { origen: null, destino: null };
    }
}

// ===== GESTIÓN DE PUNTOS DE INTERÉS E ITINERARIO =====
let puntoInteresSeleccionado = null;
let categoriaSeleccionada = null;

// Inicializar event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Añadir event listeners a las categorías
    const categorias = ['hotel', 'restaurante', 'monumento', 'naturaleza', 'compras', 'transporte', 'otros'];
    categorias.forEach(cat => {
        const elem = document.getElementById(`categoria-${cat}`);
        if (elem) {
            elem.addEventListener('click', () => abrirBusquedaItinerario(cat));
        }
    });

    // Event listener para el formulario de punto de interés
    const formPuntoInteres = document.getElementById('form-punto-interes');
    if (formPuntoInteres) {
        formPuntoInteres.addEventListener('submit', guardarItinerario);
    }

    // Cargar itinerarios cuando se carga el viaje
    if (window.viajeActual && window.viajeActual.id_viaje) {
        cargarItinerarios(window.viajeActual.id_viaje);
    }
});

// Función para abrir búsqueda por categoría
function abrirBusquedaItinerario(categoria) {
    categoriaSeleccionada = categoria;

    // Mapear categorías a tipos de Google Places
    const tiposGoogle = {
        'hotel': 'lodging',
        'restaurante': 'restaurant',
        'monumento': 'tourist_attraction',
        'naturaleza': 'park',
        'compras': 'shopping_mall',
        'transporte': 'transit_station',
        'otros': 'point_of_interest'
    };

    const tipo = tiposGoogle[categoria] || 'point_of_interest';

    // Crear input de búsqueda si no existe
    let searchInput = document.getElementById('search-lugares');
    if (!searchInput) {
        const searchDiv = document.createElement('div');
        searchDiv.id = 'search-container';
        searchDiv.innerHTML = `
            <div class="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
                <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold">Buscar ${categoria}</h3>
                        <button onclick="cerrarBusquedaLugares()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    <input type="text" id="search-lugares" 
                        placeholder="Busca un lugar..." 
                        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4">
                    <div id="resultados-busqueda" class="max-h-96 overflow-y-auto"></div>
                </div>
            </div>
        `;
        document.body.appendChild(searchDiv);
        searchInput = document.getElementById('search-lugares');
    } else {
        document.getElementById('search-container').classList.remove('hidden');
    }

    // Inicializar Autocomplete de Google Places
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        const autocomplete = new google.maps.places.Autocomplete(searchInput, {
            types: [tipo],
            fields: ['name', 'formatted_address', 'geometry', 'place_id']
        });

        autocomplete.addListener('place_changed', function () {
            const place = autocomplete.getPlace();
            if (place && place.geometry) {
                seleccionarItinerario(place);
            }
        });
    }
}

function cerrarBusquedaLugares() {
    const searchContainer = document.getElementById('search-container');
    if (searchContainer) {
        searchContainer.remove();
    }
}

function seleccionarItinerario(place) {
    console.log('Lugar seleccionado desde búsqueda por categoría:', place);

    puntoInteresSeleccionado = {
        nombre: place.name,
        direccion: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        tipo: categoriaSeleccionada
    };

    console.log('puntoInteresSeleccionado asignado:', puntoInteresSeleccionado);

    // Cerrar búsqueda y abrir popup de fecha/hora
    cerrarBusquedaLugares();
    abrirPopupPuntoInteres();
}

// Función llamada desde mapa.js cuando se selecciona un lugar
function abrirPopupPuntoInteres() {
    console.log('abrirPopupPuntoInteres llamada');
    console.log('window.puntoTemporal:', window.puntoTemporal);
    console.log('puntoInteresSeleccionado antes:', puntoInteresSeleccionado);

    // Si viene desde el mapa, copiar de window.puntoTemporal
    if (window.puntoTemporal && !puntoInteresSeleccionado) {
        puntoInteresSeleccionado = {
            nombre: window.puntoTemporal.nombre,
            direccion: window.puntoTemporal.direccion,
            lat: window.puntoTemporal.lat,
            lng: window.puntoTemporal.lng,
            tipo: window.puntoTemporal.tipo
        };
        console.log('Datos copiados desde window.puntoTemporal');
    }

    // Si viene desde las categorías, puntoInteresSeleccionado ya estará asignado
    if (!puntoInteresSeleccionado) {
        console.error('No hay punto seleccionado disponible');
        alert('Error: No se pudo cargar la información del lugar.');
        return;
    }

    console.log('puntoInteresSeleccionado después:', puntoInteresSeleccionado);

    const popup = document.getElementById('popup-punto-interes');
    const nombreElement = document.getElementById('nombre-punto-interes');
    const categoriaSelect = document.getElementById('categoria-punto');
    const fechaInput = document.getElementById('fecha-actividad');

    if (!popup) {
        console.error('No se encontró el popup-punto-interes');
        return;
    }

    // Actualizar el título del popup
    if (nombreElement) {
        nombreElement.textContent = puntoInteresSeleccionado.nombre;
    }

    // Preseleccionar la categoría
    if (categoriaSelect) {
        categoriaSelect.value = puntoInteresSeleccionado.tipo || 'otro';
    }

    // Establecer límites de fecha según el viaje
    if (window.viajeActual && fechaInput) {
        // Normalizar las fechas al formato ISO
        let fechaInicio = normalizarFecha(window.viajeActual.fecha_inicio);
        let fechaFin = normalizarFecha(window.viajeActual.fecha_fin);

        console.log('Fechas normalizadas - Inicio:', fechaInicio, 'Fin:', fechaFin);

        fechaInput.min = fechaInicio;
        fechaInput.max = fechaFin;
        fechaInput.value = fechaInicio; // Por defecto, el primer día
    }

    // Limpiar mensajes de error
    document.getElementById('error-fecha').classList.add('hidden');
    document.getElementById('error-hora').classList.add('hidden');

    // Mostrar popup
    popup.classList.remove('hidden');
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

function cerrarPopupPuntoInteres() {
    const popup = document.getElementById('popup-punto-interes');
    if (popup) {
        popup.classList.add('hidden');
    }
    // NO limpiar puntoInteresSeleccionado aquí porque puede necesitarse para guardar
    // puntoInteresSeleccionado = null;
    // window.puntoTemporal = null;
    document.getElementById('form-punto-interes')?.reset();
    document.getElementById('error-fecha')?.classList.add('hidden');
    document.getElementById('error-hora')?.classList.add('hidden');
}

// Nueva función para limpiar datos después de guardar exitosamente
function limpiarDatosPuntoInteres() {
    puntoInteresSeleccionado = null;
    window.puntoTemporal = null;
    console.log('Datos del punto de interés limpiados');
}

async function guardarItinerario(event) {
    event.preventDefault();

    console.log('DEBUG guardarItinerario - puntoInteresSeleccionado:', puntoInteresSeleccionado);
    console.log('DEBUG guardarItinerario - window.viajeActual:', window.viajeActual);

    // Si no hay puntoInteresSeleccionado, intentar recuperarlo de window.puntoTemporal
    if (!puntoInteresSeleccionado && window.puntoTemporal) {
        console.log('Recuperando desde window.puntoTemporal...');
        puntoInteresSeleccionado = {
            nombre: window.puntoTemporal.nombre,
            direccion: window.puntoTemporal.direccion,
            lat: window.puntoTemporal.lat,
            lng: window.puntoTemporal.lng,
            tipo: window.puntoTemporal.tipo
        };
    }

    if (!puntoInteresSeleccionado || !window.viajeActual) {
        console.error('Error - puntoInteresSeleccionado:', puntoInteresSeleccionado);
        console.error('Error - window.viajeActual:', window.viajeActual);
        alert('Error: Datos incompletos. Por favor, intenta seleccionar el lugar de nuevo.');
        return;
    }

    const fecha = document.getElementById('fecha-actividad').value;
    const horaInicio = document.getElementById('hora-inicio-actividad').value;
    const horaFin = document.getElementById('hora-fin-actividad').value;
    const categoria = document.getElementById('categoria-punto').value;

// Validar que se hayan completado todos los campos
if (!fecha || !horaInicio || !horaFin) {
    alert('Por favor, completa todos los campos obligatorios.');
    return;
}

// Validar fechas
const errorFecha = document.getElementById('error-fecha');
const errorHora = document.getElementById('error-hora');
errorFecha.classList.add('hidden');
errorHora.classList.add('hidden');

// Normalizar y convertir fechas para comparación correcta
const fechaInicioNorm = normalizarFecha(window.viajeActual.fecha_inicio);
const fechaFinNorm = normalizarFecha(window.viajeActual.fecha_fin);

console.log('=== DEBUG VALIDACIÓN FECHAS ===');
console.log('Fecha inicio del viaje (original):', window.viajeActual.fecha_inicio);
console.log('Fecha fin del viaje (original):', window.viajeActual.fecha_fin);
console.log('Fecha inicio normalizada:', fechaInicioNorm);
console.log('Fecha fin normalizada:', fechaFinNorm);
console.log('Fecha seleccionada por el usuario:', fecha);

const fechaInicioViaje = new Date(fechaInicioNorm + 'T00:00:00');
const fechaFinViaje = new Date(fechaFinNorm + 'T00:00:00');
const fechaSeleccionada = new Date(fecha + 'T00:00:00');

console.log('Fecha inicio (Date):', fechaInicioViaje);
console.log('Fecha fin (Date):', fechaFinViaje);
console.log('Fecha seleccionada (Date):', fechaSeleccionada);

fechaInicioViaje.setHours(0, 0, 0, 0);
fechaFinViaje.setHours(0, 0, 0, 0);
fechaSeleccionada.setHours(0, 0, 0, 0);

console.log('Comparación:', {
    fechaSeleccionada: fechaSeleccionada.toISOString(),
    fechaInicioViaje: fechaInicioViaje.toISOString(),
    fechaFinViaje: fechaFinViaje.toISOString(),
    esAnteriorAInicio: fechaSeleccionada < fechaInicioViaje,
    esPosteriorAFin: fechaSeleccionada > fechaFinViaje
});
console.log('===============================');

if (fechaSeleccionada < fechaInicioViaje || fechaSeleccionada > fechaFinViaje) {
    errorFecha.textContent = `La fecha debe estar entre ${fechaInicioNorm} y ${fechaFinNorm}`;
    errorFecha.classList.remove('hidden');
    return;
}

if (horaInicio >= horaFin) {
    errorHora.textContent = 'La hora de fin debe ser posterior a la de inicio';
    errorHora.classList.remove('hidden');
    return;
}

// Calcular el día del viaje
const fechaInicioNormalizada = normalizarFecha(window.viajeActual.fecha_inicio);
const fechaInicio = new Date(fechaInicioNormalizada + 'T00:00:00');
const fechaActividad = new Date(fecha + 'T00:00:00');
const diffTime = Math.abs(fechaActividad - fechaInicio);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
const ordenSecuencia = diffDays + 1;

// Mapear categoría del frontend al ENUM de la base de datos
const mapeoTipos = {
    'hotel': 'hotel',
    'restaurante': 'restaurante',
    'monumento': 'atraccion',
    'naturaleza': 'mirador',
    'compras': 'supermercado',
    'transporte': 'gasolinera',
    'otro': 'otros'
};

const tipoParaDB = mapeoTipos[categoria] || 'otros';

console.log('=== MAPEO DE TIPO ===');
console.log('Categoría seleccionada:', categoria);
console.log('Tipo para DB:', tipoParaDB);
console.log('====================');

// Crear objeto parada para enviar al servlet (con nombres que coinciden con la clase Java)
// Agregar segundos a las horas para que Gson pueda parsearlas como java.sql.Time
const parada = {
    viaje_id: window.viajeActual.id_viaje,
    nombre_lugar: puntoInteresSeleccionado.nombre,
    direccion: puntoInteresSeleccionado.direccion,
    latitud: puntoInteresSeleccionado.lat,
    longitud: puntoInteresSeleccionado.lng,
    orden_secuencia: ordenSecuencia,
    tipo: tipoParaDB,
    hora_estimada_llegada: horaInicio + ':00',
    hora_estimada_salida: horaFin + ':00',
    notas: `Fecha: ${fecha} | Categoría: ${categoria}`
};

console.log('=== DEBUG PARADA ===');
console.log('Objeto parada a enviar:', parada);
console.log('viaje_id:', parada.viaje_id, typeof parada.viaje_id);
console.log('nombre_lugar:', parada.nombre_lugar, typeof parada.nombre_lugar);
console.log('latitud:', parada.latitud, typeof parada.latitud);
console.log('longitud:', parada.longitud, typeof parada.longitud);
console.log('orden_secuencia:', parada.orden_secuencia, typeof parada.orden_secuencia);
console.log('hora_estimada_llegada:', parada.hora_estimada_llegada, typeof parada.hora_estimada_llegada);
console.log('hora_estimada_salida:', parada.hora_estimada_salida, typeof parada.hora_estimada_salida);
console.log('JSON a enviar:', JSON.stringify(parada, null, 2));
console.log('===================');

try {
    const response = await fetch('http://localhost:8080/VanPlannerBack/AddParadaServlet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parada)
    });

    console.log('Respuesta del servidor - status:', response.status);
    console.log('Respuesta del servidor - statusText:', response.statusText);

    // Intentar leer la respuesta como texto primero para ver qué devuelve
    const responseText = await response.text();
    console.log('Respuesta del servidor - texto completo:', responseText);

    // Intentar parsear como JSON
    let data;
    try {
        data = JSON.parse(responseText);
        console.log('Respuesta del servidor - data parseada:', data);
    } catch (e) {
        console.error('Error al parsear respuesta JSON:', e);
        console.error('Respuesta recibida:', responseText);
        alert('Error: El servidor no devolvió una respuesta JSON válida. Revisa la consola.');
        return;
    }

    if (data.success) {
        // Mostrar mensaje de éxito
        alert('¡Parada añadida con éxito!');

        // Cerrar popup
        cerrarPopupPuntoInteres();

        // Limpiar datos después de guardar exitosamente
        limpiarDatosPuntoInteres();

        // Recargar todas las paradas del viaje para mantener sincronización
        // Esto añadirá la nueva parada al calendario junto con las existentes
        if (window.viajeActual?.id_viaje) {
            cargarParadas(window.viajeActual.id_viaje);
        }
    } else {
        alert('Error al añadir parada: ' + (data.message || 'Error desconocido'));
    }
    } catch (error) {
        console.error('Error al guardar parada:', error);
        alert('No se pudo guardar la parada. Verifica la conexión con el servidor.');
    }
}

function agregarEventoCalendario(evento) {
    if (window.calendar) {
        const nuevoEvento = {
            title: evento.actividad,
            start: `${evento.fecha}T${evento.hora_inicio}`,
            end: `${evento.fecha}T${evento.hora_fin}`,
            color: obtenerColorCategoria(evento.notas),
            extendedProps: {
                evento: evento
            }
        };
        window.calendar.addEvent(nuevoEvento);
        console.log("Evento añadido al calendario:", nuevoEvento);
    } else {
        console.error("La instancia del calendario no está disponible.");
    }
}

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

// Función auxiliar para obtener color de fondo según categoría
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

// ========== FUNCIONES PARA GUARDAR VIAJE ==========

function guardarViaje() {
    // Mostrar el popup de éxito
    const popup = document.getElementById('popup-exito-guardar');
    if (popup) {
        popup.classList.remove('hidden');
    }
}

function cerrarPopupExito() {
    const popup = document.getElementById('popup-exito-guardar');
    if (popup) {
        popup.classList.add('hidden');
    }
    // Redirigir a panelIniciado
    window.location.href = 'panelIniciado.html';
}

// Exponer funciones globalmente para que puedan ser llamadas desde mapa.js
window.abrirPopupPuntoInteres = abrirPopupPuntoInteres;
window.cerrarPopupPuntoInteres = cerrarPopupPuntoInteres;
window.guardarViaje = guardarViaje;
window.cerrarPopupExito = cerrarPopupExito;