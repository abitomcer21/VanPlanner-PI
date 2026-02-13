let map;
let autocomplete;
let markers = [];
let puntosGuardados = [];
let markerOrigen = null; // Marcador del origen
let markerDestino = null; // Marcador del destino


const categorias = {
    'hotel': 'categoria-hotel',
    'restaurante': 'categoria-restaurante',
    'monumento': 'categoria-monumento',
    'naturaleza': 'categoria-naturaleza',
    'compras': 'categoria-compras',
    'transporte': 'categoria-transporte',
    'ciudad': 'categoria-otros',
    'playa': 'categoria-naturaleza',
    'parque': 'categoria-naturaleza',
    'museo': 'categoria-monumento',
    'iglesia': 'categoria-monumento',
    'castillo': 'categoria-monumento',
    'camping': 'categoria-hotel',
    'albergue': 'categoria-hotel',
    'cafeteria': 'categoria-restaurante',
    'bar': 'categoria-restaurante',
    'tienda': 'categoria-compras',
    'centro comercial': 'categoria-compras',
    'estacion': 'categoria-transporte',
    'aeropuerto': 'categoria-transporte',
    'otro': 'categoria-otros'
};

function initMap() {
    console.log("Inicializando mapa...");

    try {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 40.4168, lng: -3.7038 },
            zoom: 6
        });

        console.log("Mapa creado");
        setupSearch();
        cargarPuntos();

    } catch (error) {
        console.error("Error:", error);
    }
}

function setupSearch() {
    console.log("Configurando buscador...");

    const input = document.getElementById('search-input');
    if (!input) return;

    console.log("Input encontrado");

    try {
        autocomplete = new google.maps.places.Autocomplete(input);
        console.log("Autocomplete creado");

        autocomplete.addListener('place_changed', function () {
            const place = autocomplete.getPlace();
            console.log("Lugar seleccionado:", place.name);
            mostrarLugar(place);
        });

    } catch (error) {
        console.error("Error autocomplete:", error);
    }

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && this.value.trim()) {
            buscarLugar(this.value.trim());
            this.value = '';
            e.preventDefault();
        }
    });
}

function mostrarLugar(place) {
    if (!place.geometry || !place.geometry.location) {
        mostrarError("No se pudo obtener la ubicación");
        return;
    }

    limpiarMarcadores();
    map.setCenter(place.geometry.location);
    map.setZoom(16);

    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
        animation: google.maps.Animation.DROP
    });

    markers.push(marker);

    const infoWindow = new google.maps.InfoWindow({
        content: crearVentanaInfo(place)
    });
    
    // Guardar referencia del InfoWindow en el marker
    marker.infoWindow = infoWindow;

    infoWindow.open(map, marker);

    map.addListener('click', function () {
        infoWindow.close();
    });
    
    // Preguntar si añadir como origen o destino
    preguntarOrigenDestino(place);
}

function crearVentanaInfo(place) {
    const nombre = place.name || 'Sin nombre';
    const direccion = place.formatted_address || 'Sin dirección';
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const tipo = determinarTipo(place);

    return `
        <div style="padding: 15px; min-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${nombre}</h3>
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">${direccion}</p>
            
            <div style="display: flex; gap: 8px; margin-top: 15px;">
                <button onclick="anadirPunto('${place.place_id}', '${nombre.replace(/'/g, "\\'")}', '${direccion.replace(/'/g, "\\'")}', ${lat}, ${lng}, '${tipo}')"
                        style="flex: 1; background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 13px; cursor: pointer;">
                    <i class="fas fa-plus mr-2"></i>Añadir al itinerario
                </button>
                <button onclick="cerrarVentana()"
                        style="background: #94a3b8; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 13px; cursor: pointer;">
                    Cerrar
                </button>
            </div>
        </div>
    `;
}

function determinarTipo(place) {
    const nombre = (place.name || '').toLowerCase();
    const tipos = place.types || [];

    for (let tipo in categorias) {
        if (tipos.some(t => t.toLowerCase().includes(tipo))) {
            return tipo;
        }
    }

    // Buscar por nombre
    if (nombre.includes('hotel') || nombre.includes('hostal') || nombre.includes('albergue') ||
        nombre.includes('camping') || nombre.includes('alojamiento')) {
        return 'hotel';
    }

    if (nombre.includes('restaurante') || nombre.includes('restaurant') || nombre.includes('comida') ||
        nombre.includes('bar') || nombre.includes('café') || nombre.includes('cafeteria')) {
        return 'restaurante';
    }

    if (nombre.includes('museo') || nombre.includes('monumento') || nombre.includes('iglesia') ||
        nombre.includes('catedral') || nombre.includes('castillo')) {
        return 'monumento';
    }

    if (nombre.includes('parque') || nombre.includes('playa') || nombre.includes('montaña') ||
        nombre.includes('lago') || nombre.includes('río') || nombre.includes('bosque')) {
        return 'naturaleza';
    }

    if (nombre.includes('tienda') || nombre.includes('centro comercial') || nombre.includes('mercado') ||
        nombre.includes('supermercado') || nombre.includes('zara') || nombre.includes('el corte inglés')) {
        return 'compras';
    }

    if (nombre.includes('estación') || nombre.includes('aeropuerto') || nombre.includes('parada') ||
        nombre.includes('autobús') || nombre.includes('tren') || nombre.includes('metro')) {
        return 'transporte';
    }

    if (nombre.includes('ciudad') || nombre.includes('pueblo') || nombre.includes('villa')) {
        return 'ciudad';
    }

    return 'otro';
}

async function anadirPunto(placeId, nombre, direccion, lat, lng, tipo) {
    console.log("Preparando añadir:", nombre, "| Tipo:", tipo);

    // Almacenar datos del punto temporalmente
    window.puntoTemporal = {
        placeId: placeId,
        nombre: nombre,
        direccion: direccion,
        lat: lat,
        lng: lng,
        tipo: tipo
    };

    // Abrir el popup para añadir el punto de interés (ahora gestionado en editarViaje.js)
    if (typeof abrirPopupPuntoInteres === 'function') {
        abrirPopupPuntoInteres();
    } else {
        console.error("La función abrirPopupPuntoInteres no está definida.");
    }
}

async function sendAddParadaRequest(data) {
    return fetch(`https://back.vanplanner.duckdns.org/AddParadaServlet`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

function anadirPuntoVisual(punto) {
    const categoriaId = categorias[punto.tipo] || 'categoria-otros';
    console.log("Buscando categoría:", categoriaId);

    const elementoCategoria = document.getElementById(categoriaId);

    if (!elementoCategoria) {
        console.error("No se encontró:", categoriaId);

        const fallback = document.getElementById('categoria-otros');
        if (fallback) {
            insertarPuntoEnCategoria(punto, fallback);
        }
        return;
    }

    insertarPuntoEnCategoria(punto, elementoCategoria);
}

function insertarPuntoEnCategoria(punto, categoriaElement) {

    const puntoElement = document.createElement('div');
    puntoElement.className = 'punto-agregado ml-10 mt-2 p-2 border-l-2 border-gray-300 bg-gray-50 rounded-r';
    puntoElement.dataset.puntoId = punto.id;

    puntoElement.innerHTML = `
        <div class="text-xs">
            <div class="font-medium text-gray-800 flex justify-between items-start">
                <span class="truncate">${punto.nombre}</span>
                <button onclick="eliminarPunto(${punto.id})" class="text-gray-400 hover:text-red-600 ml-2 flex-shrink-0">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="text-gray-500 text-xs truncate mt-1">${punto.direccion}</div>
            <div class="flex justify-between items-center mt-2">
                <span class="text-gray-400 text-xs">${punto.fecha} ${punto.hora}</span>
                <span class="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                    ${punto.tipo}
                </span>
            </div>
        </div>
    `;

    categoriaElement.parentNode.insertBefore(puntoElement, categoriaElement.nextSibling);
}

function eliminarPunto(id) {
    const index = puntosGuardados.findIndex(p => p.id === id);
    if (index !== -1) {
        const puntoElement = document.querySelector(`[data-punto-id="${id}"]`);
        if (puntoElement) {
            puntoElement.remove();
        }

        puntosGuardados.splice(index, 1);
        guardarPuntos();
    }
}

function guardarPuntos() {
    localStorage.setItem('vanplanner_puntos', JSON.stringify(puntosGuardados));
}

function cargarPuntos() {
    const guardados = localStorage.getItem('vanplanner_puntos');
    if (guardados) {
        puntosGuardados = JSON.parse(guardados);
        puntosGuardados.forEach(punto => {
            anadirPuntoVisual(punto);
        });
    }
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notif = document.createElement('div');
    notif.className = `fixed top-4 right-4 px-4 py-3 rounded-lg text-white font-medium z-50 ${tipo === 'success' ? 'bg-green-500' : 'bg-blue-500'}`;
    notif.innerHTML = `<i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-info-circle'} mr-2"></i> ${mensaje}`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

function mostrarError(mensaje) {
    mostrarNotificacion(mensaje, 'error');
}

function cerrarVentana() {
    markers.forEach(m => {
        if (m.infoWindow) m.infoWindow.close();
    });
}

function limpiarMarcadores() {
    markers.forEach(m => m.setMap(null));
    markers = [];
}

function buscarLugar(query) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, function (results, status) {
        if (status === 'OK' && results[0]) {
            const place = {
                name: results[0].formatted_address,
                formatted_address: results[0].formatted_address,
                geometry: { location: results[0].geometry.location },
                place_id: results[0].place_id,
                types: results[0].types || []
            };
            mostrarLugar(place);
        } else {
            mostrarError("No se encontró: " + query);
        }
    });
}

// Función para preguntar si añadir el lugar como origen o destino
function preguntarOrigenDestino(place) {
    const inputOrigen = document.getElementById('input-origen');
    const inputDestino = document.getElementById('input-destino');
    
    if (!inputOrigen || !inputDestino) {
        console.error('No se encontraron los campos de origen/destino');
        return;
    }
    
    const nombreLugar = place.name || place.formatted_address || 'este lugar';
    
    // Si no hay origen, preguntar si añadir como origen
    if (!inputOrigen.value) {
        if (confirm(`¿Añadir "${nombreLugar}" como ORIGEN del viaje?`)) {
            inputOrigen.value = nombreLugar;
            console.log('Origen establecido:', nombreLugar);
            
            // Eliminar marcador de origen anterior si existe
            if (markerOrigen) {
                markerOrigen.setMap(null);
            }
            
            // Crear nuevo marcador de origen (verde/azul)
            markerOrigen = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                title: 'Origen: ' + nombreLugar,
                label: {
                    text: 'A',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                },
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                }
            });
            
            // Verificar si se puede habilitar el botón
            if (typeof window.verificarCamposCompletos === 'function') {
                window.verificarCamposCompletos();
            }
        }
    }
    // Si hay origen pero no destino, preguntar si añadir como destino
    else if (!inputDestino.value) {
        if (confirm(`¿Añadir "${nombreLugar}" como DESTINO del viaje?`)) {
            inputDestino.value = nombreLugar;
            console.log('Destino establecido:', nombreLugar);
            
            // Eliminar marcador de destino anterior si existe
            if (markerDestino) {
                markerDestino.setMap(null);
            }
            
            // Crear nuevo marcador de destino (rojo)
            markerDestino = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                title: 'Destino: ' + nombreLugar,
                label: {
                    text: 'B',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                },
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                }
            });
            
            // Ajustar el mapa para mostrar ambos marcadores
            if (markerOrigen && markerDestino) {
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(markerOrigen.getPosition());
                bounds.extend(markerDestino.getPosition());
                map.fitBounds(bounds);
            }
            
            // Habilitar los campos de fecha cuando origen y destino estén establecidos
            habilitarCamposFecha();
            
            // Verificar si se puede habilitar el botón
            if (typeof window.verificarCamposCompletos === 'function') {
                window.verificarCamposCompletos();
            }
        }
    }
}

// Función para habilitar los campos de fecha
function habilitarCamposFecha() {
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');
    
    if (fechaInicio) {
        fechaInicio.disabled = false;
        fechaInicio.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    if (fechaFin) {
        fechaFin.disabled = false;
        fechaFin.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    console.log('Campos de fecha habilitados');
}

// Funciones para manejar el popup de punto de interés
function abrirPopupPuntoInteres() {
    const popup = document.getElementById('popup-punto-interes');
    if (!popup) return;
    
    // Obtener fechas del viaje
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');
    const fechaActividad = document.getElementById('fecha-actividad');
    
    if (fechaInicio && fechaFin && fechaActividad) {
        // Establecer min y max para la fecha de actividad
        fechaActividad.min = fechaInicio.value;
        fechaActividad.max = fechaFin.value;
        fechaActividad.value = fechaInicio.value; // Valor por defecto
    }
    
    // Preseleccionar la categoría detectada automáticamente
    if (window.puntoTemporal && window.puntoTemporal.tipo) {
        const selectCategoria = document.getElementById('categoria-punto');
        if (selectCategoria) {
            selectCategoria.value = window.puntoTemporal.tipo;
        }
    }
    
    // Limpiar mensajes de error
    document.getElementById('error-fecha').classList.add('hidden');
    document.getElementById('error-hora').classList.add('hidden');
    
    // Mostrar popup
    popup.classList.remove('hidden');
    popup.classList.add('flex');
}

function cerrarPopupPuntoInteres() {
    const popup = document.getElementById('popup-punto-interes');
    if (!popup) return;
    
    popup.classList.add('hidden');
    popup.classList.remove('flex');
    
    // Limpiar formulario
    document.getElementById('form-punto-interes').reset();
    window.puntoTemporal = null;
}

function obtenerColorCategoria(categoria) {
    const colores = {
        'hotel': '#9333ea',
        'restaurante': '#2563eb',
        'monumento': '#dc2626',
        'naturaleza': '#16a34a',
        'compras': '#ea580c',
        'transporte': '#0891b2',
        'otro': '#6b7280'
    };
    return colores[categoria] || '#3788d8';
}
function obtenerIconoPorTipo(tipo) {
    const iconos = {
        'hotel': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        'restaurante': 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
        'monumento': 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
        'naturaleza': 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        'compras': 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png',
        'transporte': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        'parking': 'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png',
        'otro': 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    };
    
    return iconos[tipo] || iconos['otro'];
}

window.initMap = initMap;
window.anadirPunto = anadirPunto;
window.cerrarVentana = cerrarVentana;
window.eliminarPunto = eliminarPunto;
window.cerrarPopupPuntoInteres = cerrarPopupPuntoInteres;
window.abrirPopupPuntoInteres = abrirPopupPuntoInteres;
window.puntosGuardados = puntosGuardados; // Exponer array de puntos

// Función para calcular distancia entre origen y destino
// Puede recibir coordenadas directamente o nombres de lugares
function calcularDistanciaTotal(origen, destino, coordOrigen = null, coordDestino = null) {
    return new Promise((resolve, reject) => {
        // Si ya tenemos coordenadas, calcular directamente
        if (coordOrigen && coordDestino && coordOrigen.lat && coordOrigen.lng && coordDestino.lat && coordDestino.lng) {
            console.log('Calculando con coordenadas directas:', coordOrigen, coordDestino);
            const distanciaKm = calcularDistanciaHaversine(
                coordOrigen.lat,
                coordOrigen.lng,
                coordDestino.lat,
                coordDestino.lng
            );
            console.log('Distancia calculada:', distanciaKm, 'km');
            resolve(distanciaKm);
            return;
        }
        
        if (!origen || !destino) {
            console.log('Origen o destino vacíos');
            resolve(0);
            return;
        }

        console.log('Valores para geocoding:', { origen, destino });
        
        // Limpiar y normalizar los nombres (quitar espacios extra, etc)
        origen = origen.trim();
        destino = destino.trim();
        
        console.log('Calculando distancia con Geocoding:', { origen, destino });
        const geocoder = new google.maps.Geocoder();
        
        // Geocodificar origen
        geocoder.geocode({ address: origen }, (results1, status1) => {
            console.log('Resultado geocoding origen:', status1, results1);
            if (status1 === 'OK' && results1[0]) {
                const coordOrigen = results1[0].geometry.location;
                
                // Geocodificar destino
                geocoder.geocode({ address: destino }, (results2, status2) => {
                    console.log('Resultado geocoding destino:', status2, results2);
                    if (status2 === 'OK' && results2[0]) {
                        const coordDestino = results2[0].geometry.location;
                        
                        // Calcular distancia usando fórmula de Haversine
                        const distanciaKm = calcularDistanciaHaversine(
                            coordOrigen.lat(),
                            coordOrigen.lng(),
                            coordDestino.lat(),
                            coordDestino.lng()
                        );
                        
                        console.log('Distancia calculada:', distanciaKm, 'km');
                        resolve(distanciaKm);
                    } else {
                        console.error('Error geocodificando destino:', status2);
                        resolve(0);
                    }
                });
            } else {
                console.error('Error geocodificando origen:', status1);
                resolve(0);
            }
        });
    });
}

// Fórmula de Haversine para calcular distancia entre dos puntos
function calcularDistanciaHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;
    return Math.round(distancia);
}

// Exponer función globalmente
window.calcularDistanciaTotal = calcularDistanciaTotal;

console.log("Sistema listo con 7 categorías diferentes");

window.mapa = window.mapa || {};

window.mapa.mostrarPuntosViajes = function(puntos) {
    if (!map) return;
    puntos.forEach(punto => {
        const marker = new google.maps.Marker({
            map: map,
            position: { lat: punto.lat, lng: punto.lng },
            title: punto.ciudad,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
        markers.push(marker);
    });
};