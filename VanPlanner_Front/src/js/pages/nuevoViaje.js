// Función para obtener el ID del usuario
function obtenerUsuarioId() {
    console.log('Buscando usuario ID...');
    
    // Intentar obtener directamente el usuarioId
    let usuarioId = localStorage.getItem('usuarioId') || sessionStorage.getItem('usuarioId');
    console.log('usuarioId directo:', usuarioId);
    
    // Si no existe, intentar extraerlo del objeto usuario
    if (!usuarioId || usuarioId === 'undefined' || usuarioId === 'null') {
        console.log('Intentando extraer del objeto usuario...');
        const usuarioStr = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
        console.log('usuarioStr:', usuarioStr);
        
        if (usuarioStr) {
            try {
                const usuario = JSON.parse(usuarioStr);
                console.log('Usuario parseado:', usuario);
                
                // Probar diferentes nombres de campo
                usuarioId = usuario.id_usuario || usuario.id || usuario.idUsuario || usuario.usuarioId;
                console.log('ID extraído:', usuarioId);
                
                // Guardar para uso futuro
                if (usuarioId && usuarioId !== 'undefined' && usuarioId !== 'null') {
                    localStorage.setItem('usuarioId', usuarioId);
                    console.log('ID guardado en localStorage');
                }
            } catch (e) {
                console.error('Error al parsear usuario:', e);
            }
        }
    }
    
    // Validar que sea un número válido
    if (usuarioId && usuarioId !== 'undefined' && usuarioId !== 'null' && !isNaN(usuarioId)) {
        console.log('Usuario ID válido encontrado:', usuarioId);
        return usuarioId;
    }
    
    console.error('No se pudo obtener un usuario ID válido');
    return null;
}

// Función para verificar si el usuario tiene vehículos
async function verificarVehiculosUsuario() {
    console.log('Verificando vehículos del usuario...');
    
    const usuarioId = obtenerUsuarioId();
    
    console.log('Usuario ID:', usuarioId);
    
    if (!usuarioId) {
        console.error('No se encontró el ID del usuario');
        // Mostrar popup de todas formas para pruebas
        mostrarModalVehiculo();
        return;
    }

    try {
        const url = `https://back.vanplanner.duckdns.org/ObtenerVehiculosServlet?usuario_id=${usuarioId}`;
        console.log('Consultando URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        const vehiculos = await response.json();
        console.log('Vehículos obtenidos:', vehiculos);

        if (!vehiculos || vehiculos.length === 0) {
            console.log('No tiene vehículos, mostrando modal...');
            // No tiene vehículos, mostrar el modal
            mostrarModalVehiculo();
        } else {
            console.log('El usuario ya tiene vehículos:', vehiculos.length);
            // Mostrar el vehículo en la interfaz
            mostrarVehiculoEnInterfaz(vehiculos[0]);
        }
    } catch (error) {
        console.error('Error al verificar vehículos:', error);
        // En caso de error, mostrar el modal para que pueda añadir vehículo
        mostrarModalVehiculo();
    }
}

// Función para mostrar el modal
function mostrarModalVehiculo() {
    console.log('Intentando mostrar modal...');
    const modal = document.getElementById('popup-vehiculo'); // CORREGIDO
    console.log('Modal element:', modal);
    
    if (modal) {
        modal.classList.remove('hidden');
        console.log('Modal mostrado, clases:', modal.className);
    } else {
        console.error('No se encontró el elemento popup-vehiculo'); // CORREGIDO
    }
}

// Función para ocultar el modal
function ocultarModalVehiculo() {
    const modal = document.getElementById('popup-vehiculo'); // CORREGIDO
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Configurar el formulario de vehículo
function configurarFormularioVehiculo() {
    console.log('Configurando formulario de vehículo...');
    const form = document.getElementById('form-add-vehiculo');
    console.log('Formulario encontrado:', form);
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Formulario enviado');
            
            const usuarioId = obtenerUsuarioId();
            console.log('Usuario ID obtenido:', usuarioId);
            
            if (!usuarioId) {
                alert('Error: No se pudo identificar al usuario. Por favor, inicia sesión de nuevo.');
                return;
            }

            const formData = new FormData(form);
            const vehiculoData = {
                usuario_id: parseInt(usuarioId),
                nombre_vehiculo: formData.get('nombre_vehiculo'),
                marca_modelo: formData.get('marca_modelo'),
                consumo: parseFloat(formData.get('consumo')),
                tipo_combustible: formData.get('tipo_combustible'),
                capacidad_tanque: parseInt(formData.get('capacidad_tanque'))
            };

            console.log('Datos del vehículo:', vehiculoData);

            try {
                console.log('Enviando petición al servidor...');
                const response = await fetch('https://back.vanplanner.duckdns.org/AddVehiculoServlet', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(vehiculoData)
                });

                console.log('Respuesta del servidor:', response.status);

                if (response.ok) {
                    alert('¡Vehículo añadido correctamente!');
                    ocultarModalVehiculo();
                    form.reset();
                    await cargarYMostrarVehiculos(); 
                } else {
                    const errorText = await response.text();
                    console.error('Error del servidor:', errorText);
                    alert('Error al añadir el vehículo: ' + errorText);
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                alert('Error de conexión con el servidor: ' + error.message);
            }
        });
        console.log('Event listener añadido al formulario');
    } else {
        console.error('No se encontró el formulario con id "form-add-vehiculo"');
    }
}

// Función para cargar y mostrar los vehículos del usuario
async function cargarYMostrarVehiculos() {
    const usuarioId = obtenerUsuarioId();
    
    if (!usuarioId) {
        console.error('No se pudo obtener el ID del usuario');
        return;
    }
    
    try {
        const response = await fetch(`https://back.vanplanner.duckdns.org/ObtenerVehiculosServlet?usuario_id=${usuarioId}`);
        const vehiculos = await response.json();
        
        if (vehiculos && vehiculos.length > 0) {
            mostrarVehiculoEnInterfaz(vehiculos[0]);
        }
    } catch (error) {
        console.error('Error al cargar vehículos:', error);
    }
}

// Función para mostrar el vehículo en la interfaz
function mostrarVehiculoEnInterfaz(vehiculo) {
    console.log('Mostrando vehículo:', vehiculo);
    
    const nombreElem = document.getElementById('nombre-vehiculo');
    const marcaElem = document.getElementById('marca-vehiculo');
    const consumoElem = document.getElementById('consumo-vehiculo');
    
    if (nombreElem) {
        // El campo 'matricula' contiene el 'nombre_vehiculo' desde el Dao
        nombreElem.textContent = vehiculo.matricula || 'Mi vehículo';
    }
    
    if (marcaElem) {
        const combustible = vehiculo.tipo_combustible || '';
        // El campo 'marca' contiene la 'marca_modelo' desde el Dao
        marcaElem.textContent = `${vehiculo.marca || ''} - ${combustible.charAt(0).toUpperCase() + combustible.slice(1)}`;
    }
    
    if (consumoElem) {
        // El campo es 'consumo_medio' en el JSON
        consumoElem.textContent = vehiculo.consumo_medio ? `${vehiculo.consumo_medio} L/100km` : '-';
    }
}

// Función para mostrar mensajes
function mostrarMensajeVehiculo(tipo, mensaje) {
    const mensajeDiv = document.getElementById('mensaje-vehiculo');
    if (mensajeDiv) {
        mensajeDiv.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700');
        
        if (tipo === 'success') {
            mensajeDiv.classList.add('bg-green-100', 'text-green-700');
        } else {
            mensajeDiv.classList.add('bg-red-100', 'text-red-700');
        }
        
        mensajeDiv.textContent = mensaje;
        mensajeDiv.classList.remove('hidden');
    }
}

// Inicializar fechas y verificar vehículos al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    console.log('Página cargada, iniciando verificación de vehículos...');
    verificarVehiculosUsuario();
    configurarFormularioVehiculo();
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');
    const distanciaTotal = document.getElementById('distancia-total');

    // Establecer fecha mínima como hoy
    const hoy = new Date().toISOString().split('T')[0];
    fechaInicio.setAttribute('min', hoy);

    // Cuando se selecciona fecha de inicio, actualizar mínimo de fecha fin
    fechaInicio.addEventListener('change', function () {
        fechaFin.setAttribute('min', this.value);
        if (fechaFin.value && fechaFin.value < this.value) {
            fechaFin.value = '';
        }
    });

    // Validar que fecha fin sea mayor que fecha inicio
    fechaFin.addEventListener('change', function () {
        if (fechaInicio.value && this.value < fechaInicio.value) {
            alert('La fecha de finalización debe ser posterior a la fecha de inicio');
            this.value = '';
        }
    });
});

// Función para actualizar la distancia total (llamar cuando se añadan puntos)
function actualizarDistanciaTotal(distanciaKm) {
    const distanciaElement = document.getElementById('distancia-total');
    if (distanciaKm > 0) {
        distanciaElement.textContent = `${distanciaKm.toFixed(2)} km`;
        distanciaElement.classList.add('animate-pulse');
        setTimeout(() => {
            distanciaElement.classList.remove('animate-pulse');
        }, 1000);
    } else {
        distanciaElement.textContent = '-- km';
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    let calendar;

    // Inicializar el calendario
    if (calendarEl) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana'
            },
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            height: '100%',
            contentHeight: 'auto',
            aspectRatio: 1.35,

            // Función para deshabilitar días fuera del rango
            dayCellClassNames: function (info) {
                const fechaInicio = document.getElementById('fecha-inicio').value;
                const fechaFin = document.getElementById('fecha-fin').value;

                if (fechaInicio && fechaFin) {
                    const cellDate = info.date;
                    const startDate = new Date(fechaInicio);
                    const endDate = new Date(fechaFin);

                    // Ajustar las fechas para comparación correcta
                    cellDate.setHours(0, 0, 0, 0);
                    startDate.setHours(0, 0, 0, 0);
                    endDate.setHours(0, 0, 0, 0);

                    if (cellDate < startDate || cellDate > endDate) {
                        return ['fc-day-disabled'];
                    }
                }
                return [];
            },

            // Prevenir interacción con días deshabilitados
            selectAllow: function (selectInfo) {
                const fechaInicio = document.getElementById('fecha-inicio').value;
                const fechaFin = document.getElementById('fecha-fin').value;

                if (fechaInicio && fechaFin) {
                    const startDate = new Date(fechaInicio);
                    const endDate = new Date(fechaFin);
                    const selectStart = selectInfo.start;
                    const selectEnd = new Date(selectInfo.end);
                    selectEnd.setDate(selectEnd.getDate() - 1); // Ajustar el día final

                    return selectStart >= startDate && selectEnd <= endDate;
                }
                return true;
            },

            dateClick: function (info) {
                const fechaInicio = document.getElementById('fecha-inicio').value;
                const fechaFin = document.getElementById('fecha-fin').value;

                if (fechaInicio && fechaFin) {
                    const clickedDate = info.date;
                    const startDate = new Date(fechaInicio);
                    const endDate = new Date(fechaFin);

                    clickedDate.setHours(0, 0, 0, 0);
                    startDate.setHours(0, 0, 0, 0);
                    endDate.setHours(0, 0, 0, 0);

                    // Solo permitir clicks en fechas dentro del rango
                    if (clickedDate < startDate || clickedDate > endDate) {
                        alert('Solo puedes seleccionar fechas dentro del rango del viaje');
                        return;
                    }
                }

                // Aquí puedes añadir lógica para añadir eventos
                console.log('Fecha seleccionada:', info.dateStr);
            }
        });

        calendar.render();
    }

    // Escuchar cambios en los campos de fecha
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');

    if (fechaInicio && fechaFin && calendar) {
        fechaInicio.addEventListener('change', function () {
            actualizarCalendario();
            verificarCamposCompletos();
        });

        fechaFin.addEventListener('change', function () {
            actualizarCalendario();
            verificarCamposCompletos();
        });
    }

    // Función para verificar si todos los campos necesarios están completos
    function verificarCamposCompletos() {
        console.log('=== Verificando campos completos ===');
        
        const inputOrigen = document.getElementById('input-origen');
        const inputDestino = document.getElementById('input-destino');
        const fechaInicio = document.getElementById('fecha-inicio');
        const fechaFin = document.getElementById('fecha-fin');
        const btnCrearViaje = document.getElementById('btn-crear-viaje');
        
        if (!inputOrigen || !inputDestino || !fechaInicio || !fechaFin || !btnCrearViaje) {
            console.log('⚠️ No se encontraron todos los elementos necesarios');
            return;
        }
        
        const origenVal = inputOrigen.value ? inputOrigen.value.trim() : '';
        const destinoVal = inputDestino.value ? inputDestino.value.trim() : '';
        const fechaInicioVal = fechaInicio.value || '';
        const fechaFinVal = fechaFin.value || '';
        
        console.log('Valores actuales:');
        console.log('- Origen:', origenVal || '(vacío)');
        console.log('- Destino:', destinoVal || '(vacío)');
        console.log('- Fecha inicio:', fechaInicioVal || '(vacío)');
        console.log('- Fecha fin:', fechaFinVal || '(vacío)');
        
        // Verificar si todos los campos están completos
        const todosCompletos = origenVal && destinoVal && fechaInicioVal && fechaFinVal;
        
        if (todosCompletos) {
            // Habilitar botón
            btnCrearViaje.disabled = false;
            btnCrearViaje.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-400');
            btnCrearViaje.classList.add('bg-van-primario-v1', 'hover:bg-van-primario-v2');
            console.log('✅ BOTÓN HABILITADO - Todos los campos están completos');
        } else {
            // Mantener botón deshabilitado
            btnCrearViaje.disabled = true;
            btnCrearViaje.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-400');
            btnCrearViaje.classList.remove('bg-van-primario-v1', 'hover:bg-van-primario-v2');
            console.log('❌ Botón deshabilitado - Faltan campos');
        }
        
        console.log('=== Fin verificación ===\n');
    }
    
    // Exponer la función para que pueda ser llamada desde otros archivos
    window.verificarCamposCompletos = verificarCamposCompletos;

    // Función para actualizar el calendario
    function actualizarCalendario() {
        if (calendar) {
            const fechaInicio = document.getElementById('fecha-inicio').value;
            const fechaFin = document.getElementById('fecha-fin').value;

            if (fechaInicio && fechaFin) {
                const startDate = new Date(fechaInicio);
                // Navegar al mes de inicio del viaje
                calendar.gotoDate(startDate);
            }

            // Refrescar el calendario para aplicar las clases
            calendar.refetchEvents();
            calendar.render();
        }
    }

    // Deshabilitar campos inicialmente hasta que se establezcan origen y destino
    deshabilitarCampos();
    
    // Configurar el botón de crear viaje
    configurarBotonCrearViaje();
});

// Función para deshabilitar todos los campos excepto origen, destino, fechas y buscador
function deshabilitarCampos() {
    // NO deshabilitar campos de fecha - los necesitamos antes de crear el viaje
    // const fechaInicio = document.getElementById('fecha-inicio');
    // const fechaFin = document.getElementById('fecha-fin');
    // if (fechaInicio) fechaInicio.disabled = true;
    // if (fechaFin) fechaFin.disabled = true;
    
    // NO deshabilitar el buscador del mapa - el usuario lo necesita para buscar origen/destino
    
    // Deshabilitar todas las categorías de puntos de interés
    const categorias = [
        'categoria-gasolinera', 'categoria-hotel', 'categoria-restaurante',
        'categoria-monumento', 'categoria-naturaleza', 'categoria-compras',
        'categoria-transporte', 'categoria-parking', 'categoria-entretenimiento'
    ];
    
    categorias.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.style.opacity = '0.5';
            elemento.style.pointerEvents = 'none';
        }
    });
    
    console.log('Campos deshabilitados hasta crear el viaje');
}

// Función para habilitar todos los campos
function habilitarCampos() {
    // Habilitar campos de fecha
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');
    if (fechaInicio) fechaInicio.disabled = false;
    if (fechaFin) fechaFin.disabled = false;
    
    // Habilitar búsqueda del mapa
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.disabled = false;
    
    // Habilitar todas las categorías de puntos de interés
    const categorias = [
        'categoria-gasolinera', 'categoria-hotel', 'categoria-restaurante',
        'categoria-monumento', 'categoria-naturaleza', 'categoria-compras',
        'categoria-transporte', 'categoria-parking', 'categoria-entretenimiento'
    ];
    
    categorias.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.style.opacity = '1';
            elemento.style.pointerEvents = 'auto';
        }
    });
    
    console.log('Campos habilitados');
}

// Función para configurar el botón de crear viaje
function configurarBotonCrearViaje() {
    const btnCrearViaje = document.getElementById('btn-crear-viaje');
    const inputOrigen = document.getElementById('input-origen');
    const inputDestino = document.getElementById('input-destino');
    
    if (!btnCrearViaje || !inputOrigen || !inputDestino) {
        console.error('No se encontraron los elementos necesarios');
        return;
    }
    
    // Deshabilitar el botón inicialmente
    btnCrearViaje.disabled = true;
    btnCrearViaje.classList.add('opacity-50', 'cursor-not-allowed');
    
    btnCrearViaje.addEventListener('click', async function() {
        const origen = inputOrigen.value.trim();
        const destino = inputDestino.value.trim();
        
        if (!origen || !destino) {
            alert('Por favor, busca y establece el origen y el destino del viaje usando el buscador del mapa');
            return;
        }
        
        // Crear el viaje en la base de datos
        await crearViaje(origen, destino);
    });
}

// Función para crear el viaje en la base de datos
async function crearViaje(origen, destino) {
    console.log('Creando viaje con origen:', origen, 'y destino:', destino);
    
    const usuarioId = obtenerUsuarioId();
    
    if (!usuarioId) {
        alert('Error: No se pudo identificar al usuario');
        return;
    }
    
    // Obtener las fechas
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');
    
    if (!fechaInicio || !fechaFin || !fechaInicio.value || !fechaFin.value) {
        alert('Debes seleccionar las fechas de inicio y fin del viaje');
        return;
    }
    
    // Pedir el nombre del viaje
    const nombreViaje = prompt('Nombre del viaje:');
    
    if (!nombreViaje || nombreViaje.trim() === '') {
        alert('Debes introducir un nombre para el viaje');
        return;
    }
    
    // Pedir la descripción del viaje
    const descripcionViaje = prompt('Descripción breve del viaje:');
    
    if (!descripcionViaje || descripcionViaje.trim() === '') {
        alert('Debes introducir una descripción para el viaje');
        return;
    }
    
    // Obtener el vehículo del usuario
    let vehiculoId = null;
    try {
        const responseVehiculos = await fetch(`https://back.vanplanner.duckdns.org/ObtenerVehiculosServlet?usuario_id=${usuarioId}`);
        const vehiculos = await responseVehiculos.json();
        
        if (vehiculos && vehiculos.length > 0) {
            vehiculoId = vehiculos[0].id_vehiculo;
            console.log('Vehículo del usuario:', vehiculoId);
        } else {
            alert('No tienes ningún vehículo registrado. Primero debes añadir un vehículo.');
            return;
        }
    } catch (error) {
        console.error('Error al obtener vehículo:', error);
        alert('Error al obtener el vehículo del usuario');
        return;
    }
    
    // Preparar los datos del viaje
    const viajeData = {
        usuario_id: parseInt(usuarioId),
        vehiculo_id: vehiculoId,
        nombre_viaje: nombreViaje.trim(),
        descripcion: descripcionViaje.trim(),
        origen: origen,
        destino: destino,
        fecha_inicio: fechaInicio.value,
        fecha_fin: fechaFin.value
    };
    
    console.log('Datos del viaje a guardar:', viajeData);
    
    try {
        const response = await fetch('https://back.vanplanner.duckdns.org/CrearViajeServlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(viajeData)
        });
        
        console.log('Respuesta del servidor:', response.status);
        
        if (response.ok) {
            const resultado = await response.json();
            console.log('Viaje creado:', resultado);
            
            // Habilitar campos
            habilitarCampos();
            
            // Deshabilitar y actualizar el botón
            const btnCrearViaje = document.getElementById('btn-crear-viaje');
            if (btnCrearViaje) {
                btnCrearViaje.disabled = true;
                btnCrearViaje.classList.add('opacity-50', 'cursor-not-allowed');
                btnCrearViaje.innerHTML = '<i class="fas fa-check mr-2"></i> Viaje creado';
            }
            
            // Guardar el ID del viaje para usarlo después
            if (resultado.id_viaje) {
                sessionStorage.setItem('viajeActualId', resultado.id_viaje);
                window.viajeActualId = resultado.id_viaje;
                
                // Enviar gastos pendientes si los hay
                if (window.enviarGastosEnEspera) {
                    window.enviarGastosEnEspera();
                }
            }
            
            // Mostrar mensaje de éxito con opción de ir a ver todos los viajes
            const verTodos = confirm(`¡Viaje "${nombreViaje}" creado exitosamente!\n\n¿Deseas ir a ver todos tus viajes?`);
            if (verTodos) {
                window.location.href = 'verTodos.html';
            }
        } else {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            alert('Error al crear el viaje: ' + errorText);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('Error de conexión con el servidor: ' + error.message);
    }
}

// Mostrar puntos de origen y destino en el mapa si existen valores
function mostrarPuntosOrigenDestino() {
    const inputOrigen = document.getElementById('input-origen');
    const inputDestino = document.getElementById('input-destino');
    if (!window.mapa || !window.mapa.mostrarPuntosViajes || !inputOrigen || !inputDestino) return;
    const puntos = [];
    if (inputOrigen.value) puntos.push({ ciudad: inputOrigen.value });
    if (inputDestino.value) puntos.push({ ciudad: inputDestino.value });
    const geocoder = new google.maps.Geocoder();
    Promise.all(puntos.map(punto => new Promise(resolve => {
        geocoder.geocode({ address: punto.ciudad }, (results, status) => {
            if (status === 'OK' && results[0]) {
                punto.lat = results[0].geometry.location.lat();
                punto.lng = results[0].geometry.location.lng();
            }
            resolve();
        });
    }))).then(() => {
        const puntosConCoords = puntos.filter(p => p.lat && p.lng);
        window.mapa.mostrarPuntosViajes(puntosConCoords);
    });
}

// Llama a la función cuando cambian los campos de origen o destino
['input-origen', 'input-destino'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('change', mostrarPuntosOrigenDestino);
    }
});

// Debug: verificar cada 2 segundos (temporal)
setInterval(() => {
    if (window.verificarCamposCompletos) {
        window.verificarCamposCompletos();
    }
}, 2000);
