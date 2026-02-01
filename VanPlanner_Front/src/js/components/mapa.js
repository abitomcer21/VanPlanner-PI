let map;
let autocomplete;
let markers = [];
let puntosGuardados = [];


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

    infoWindow.open(map, marker);

    map.addListener('click', function () {
        infoWindow.close();
    });
}

function crearVentanaInfo(place) {
    const nombre = place.name || 'Sin nombre';
    const direccion = place.formatted_address || 'Sin dirección';
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const tipo = determinarTipo(place);
    const categoria = categorias[tipo] || 'categoria-otros';

    return `
        <div style="padding: 15px; min-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${nombre}</h3>
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">${direccion}</p>
            <p style="margin: 0 0 10px 0; font-size: 12px;">
                <strong>Tipo:</strong> ${tipo}<br>
                <strong>Categoría:</strong> ${categoria.replace('categoria-', '')}
            </p>
            
            <div style="display: flex; gap: 8px; margin-top: 15px;">
                <button onclick="anadirPunto('${place.place_id}', '${nombre.replace(/'/g, "\\'")}', '${direccion.replace(/'/g, "\\'")}', ${lat}, ${lng}, '${tipo}')"
                        style="flex: 1; background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 13px; cursor: pointer;">
                    Añadir a ${tipo}
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
    console.log("Añadiendo:", nombre, "| Tipo:", tipo);

    const punto = {
        id: placeId,
        nombre: nombre,
        direccion: direccion,
        lat: lat,
        lng: lng,
        tipo: tipo
    };

    puntosGuardados.push(punto);

    // TODO: Implementar correctamente
    await sendAddParadaRequest(punto);

    anadirPuntoVisual(punto);
    guardarPuntos();
    cerrarVentana();
}

async function sendAddParadaRequest(data) {
    return fetch(`http://localhost:8080/VanPlannerBack/AddParadaServlet`, {
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

window.initMap = initMap;
window.anadirPunto = anadirPunto;
window.cerrarVentana = cerrarVentana;
window.eliminarPunto = eliminarPunto;

console.log("Sistema listo con 7 categorías diferentes");