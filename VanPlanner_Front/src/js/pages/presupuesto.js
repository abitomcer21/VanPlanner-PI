// Gestión del presupuesto del viaje
const gastosPresupuesto = {
    gasolina: [],
    hoteles: [],
    restaurantes: []
};

// Función para abrir popup de gasto
function abrirPopupGasto(tipo) {
    const popup = document.getElementById(`popup-gasto-${tipo}`);
    if (popup) {
        popup.classList.remove('hidden');
    }
}

// Función para cerrar popup de gasto
function cerrarPopupGasto(tipo) {
    const popup = document.getElementById(`popup-gasto-${tipo}`);
    if (popup) {
        popup.classList.add('hidden');
        // Limpiar formulario
        const form = document.getElementById(`form-gasto-${tipo}`);
        if (form) {
            form.reset();
        }
    }
}

// Función para añadir gasto
function anadirGasto(tipo, descripcion, cantidad) {
    const gasto = {
        descripcion: descripcion,
        cantidad: parseFloat(cantidad),
        fecha: new Date().toISOString()
    };
    
    gastosPresupuesto[tipo].push(gasto);
    actualizarMostrarGastos(tipo);
    actualizarTotalPresupuesto();
    
    // Enviar al backend
    enviarGastoAlBackend(tipo, descripcion, cantidad);
    
    console.log(`Gasto añadido a ${tipo}:`, gasto);
}

// Función para enviar gasto al backend
async function enviarGastoAlBackend(tipo, descripcion, cantidad) {
    // Obtener el ID del viaje actual (desde sessionStorage o window)
    const viajeId = sessionStorage.getItem('viajeActualId') || window.viajeActualId;
    const usuarioId = localStorage.getItem('usuarioId') || 1; // Obtener de localStorage
    
    if (!viajeId) {
        console.warn('No hay un viaje activo. El gasto se guardará solo localmente hasta que se cree el viaje.');
        // Guardar en cola para enviar después
        if (!window.gastosEnEspera) {
            window.gastosEnEspera = [];
        }
        window.gastosEnEspera.push({ tipo, descripcion, cantidad });
        return;
    }

    const gastoData = {
        viaje_id: parseInt(viajeId),
        usuario_id: parseInt(usuarioId),
        tipo: tipo,
        total: parseFloat(cantidad),
        descripcion: descripcion,
        fecha_gasto: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
    };

    try {
        const response = await fetch('https://back.vanplanner.duckdns.org/AddGastoServlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gastoData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del servidor:', response.status, errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        if (result.success) {
            console.log('✅ Gasto guardado en BD:', result.message);
        } else {
            console.error('❌ Error al guardar gasto en BD:', result.message);
            console.log('💾 El gasto se ha guardado localmente');
        }
    } catch (error) {
        console.error('❌ Error al enviar gasto al backend:', error);
        console.log('💾 El gasto se mantiene guardado localmente');
        console.log('📝 Detalles del error:', error.message);
    }
}

// Función para enviar gastos en espera cuando se cree el viaje
window.enviarGastosEnEspera = async function() {
    const viajeId = sessionStorage.getItem('viajeActualId') || window.viajeActualId;
    
    if (!viajeId || !window.gastosEnEspera || window.gastosEnEspera.length === 0) {
        return;
    }

    console.log(`Enviando ${window.gastosEnEspera.length} gastos pendientes...`);
    
    for (const gasto of window.gastosEnEspera) {
        await enviarGastoAlBackend(gasto.tipo, gasto.descripcion, gasto.cantidad);
    }
    
    // Limpiar la cola
    window.gastosEnEspera = [];
    console.log('Gastos pendientes enviados correctamente');
};

// Función para actualizar la visualización de gastos
function actualizarMostrarGastos(tipo) {
    // Actualizar el total
    const elemento = document.getElementById(`gasto-${tipo}`);
    if (!elemento) return;
    
    const total = gastosPresupuesto[tipo].reduce((sum, gasto) => sum + gasto.cantidad, 0);
    elemento.textContent = `${total.toFixed(2)}€`;
    
    // Actualizar la lista de gastos individuales
    const listaElemento = document.getElementById(`lista-gastos-${tipo}`);
    if (!listaElemento) return;
    
    // Limpiar la lista
    listaElemento.innerHTML = '';
    
    // Si no hay gastos, no mostrar nada
    if (gastosPresupuesto[tipo].length === 0) {
        return;
    }
    
    // Añadir cada gasto como un elemento de lista
    gastosPresupuesto[tipo].forEach((gasto, index) => {
        const gastoDiv = document.createElement('div');
        gastoDiv.className = 'flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200';
        gastoDiv.innerHTML = `
            <div class="flex-1 min-w-0">
                <p class="text-gray-700 truncate">${gasto.descripcion || 'Sin descripción'}</p>
            </div>
            <div class="flex items-center gap-2 ml-2">
                <span class="text-gray-900 font-semibold whitespace-nowrap">${gasto.cantidad.toFixed(2)}€</span>
                <button onclick="eliminarGasto('${tipo}', ${index})" class="text-red-500 hover:text-red-700" title="Eliminar gasto">
                    <i class="fas fa-trash text-xs"></i>
                </button>
            </div>
        `;
        listaElemento.appendChild(gastoDiv);
    });
}

// Función para actualizar el total del presupuesto
function actualizarTotalPresupuesto() {
    const totalGasolina = gastosPresupuesto.gasolina.reduce((sum, g) => sum + g.cantidad, 0);
    const totalHoteles = gastosPresupuesto.hoteles.reduce((sum, g) => sum + g.cantidad, 0);
    const totalRestaurantes = gastosPresupuesto.restaurantes.reduce((sum, g) => sum + g.cantidad, 0);
    
    const totalGeneral = totalGasolina + totalHoteles + totalRestaurantes;
    
    const elementoTotal = document.getElementById('total-presupuesto');
    if (elementoTotal) {
        elementoTotal.textContent = `${totalGeneral.toFixed(2)}€`;
    }
}

// Función para eliminar un gasto
function eliminarGasto(tipo, index) {
    if (confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
        gastosPresupuesto[tipo].splice(index, 1);
        actualizarMostrarGastos(tipo);
        actualizarTotalPresupuesto();
        console.log(`Gasto eliminado de ${tipo} en posición ${index}`);
    }
}

// Función para cargar gastos desde la base de datos
async function cargarGastosDesdeDB(viajeId) {
    if (!viajeId) {
        console.warn('No se proporcionó ID de viaje para cargar gastos');
        return;
    }
    
    try {
        console.log('Intentando cargar gastos del viaje:', viajeId);
        
        const response = await fetch(`https://back.vanplanner.duckdns.org/ObtenerGastosServlet?id_viaje=${viajeId}`);
        
        if (!response.ok) {
            console.warn(`Servlet de gastos no disponible (${response.status}). Los gastos no se cargarán.`);
            return;
        }
        
        const gastos = await response.json();
        console.log('Gastos recibidos:', gastos);
        
        // Limpiar gastos actuales
        gastosPresupuesto.gasolina = [];
        gastosPresupuesto.hoteles = [];
        gastosPresupuesto.restaurantes = [];
        
        // Organizar gastos por tipo
        gastos.forEach(gasto => {
            const gastoObj = {
                descripcion: gasto.descripcion || 'Sin descripción',
                cantidad: parseFloat(gasto.total || 0),
                fecha: gasto.fecha_gasto
            };
            
            // Mapear el tipo de la BD al tipo del frontend
            let tipoFrontend = gasto.tipo;
            if (gasto.tipo === 'alojamiento') tipoFrontend = 'hoteles';
            else if (gasto.tipo === 'comida') tipoFrontend = 'restaurantes';
            else if (gasto.tipo === 'transporte' || gasto.tipo === 'combustible') tipoFrontend = 'gasolina';
            
            if (gastosPresupuesto[tipoFrontend]) {
                gastosPresupuesto[tipoFrontend].push(gastoObj);
            }
        });
        
        // Actualizar visualización
        actualizarMostrarGastos('gasolina');
        actualizarMostrarGastos('hoteles');
        actualizarMostrarGastos('restaurantes');
        actualizarTotalPresupuesto();
        
        console.log('Gastos cargados correctamente:', gastosPresupuesto);
    } catch (error) {
        console.warn('No se pudieron cargar los gastos (servlet no disponible o error):', error.message);
        // No mostramos error al usuario, simplemente no cargamos gastos
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Botones para abrir popups
    const btnGasolina = document.getElementById('btn-add-gasolina');
    const btnHoteles = document.getElementById('btn-add-hoteles');
    const btnRestaurantes = document.getElementById('btn-add-restaurantes');
    
    if (btnGasolina) {
        btnGasolina.addEventListener('click', (e) => {
            e.preventDefault();
            abrirPopupGasto('gasolina');
        });
    }
    
    if (btnHoteles) {
        btnHoteles.addEventListener('click', (e) => {
            e.preventDefault();
            abrirPopupGasto('hoteles');
        });
    }
    
    if (btnRestaurantes) {
        btnRestaurantes.addEventListener('click', (e) => {
            e.preventDefault();
            abrirPopupGasto('restaurantes');
        });
    }
    
    // Formularios de gastos
    const formGasolina = document.getElementById('form-gasto-gasolina');
    if (formGasolina) {
        formGasolina.addEventListener('submit', function(e) {
            e.preventDefault();
            const descripcion = document.getElementById('desc-gasolina').value;
            const cantidad = document.getElementById('cantidad-gasolina').value;
            
            anadirGasto('gasolina', descripcion, cantidad);
            cerrarPopupGasto('gasolina');
        });
    }
    
    const formHoteles = document.getElementById('form-gasto-hoteles');
    if (formHoteles) {
        formHoteles.addEventListener('submit', function(e) {
            e.preventDefault();
            const descripcion = document.getElementById('desc-hoteles').value;
            const cantidad = document.getElementById('cantidad-hoteles').value;
            
            anadirGasto('hoteles', descripcion, cantidad);
            cerrarPopupGasto('hoteles');
        });
    }
    
    const formRestaurantes = document.getElementById('form-gasto-restaurantes');
    if (formRestaurantes) {
        formRestaurantes.addEventListener('submit', function(e) {
            e.preventDefault();
            const descripcion = document.getElementById('desc-restaurantes').value;
            const cantidad = document.getElementById('cantidad-restaurantes').value;
            
            anadirGasto('restaurantes', descripcion, cantidad);
            cerrarPopupGasto('restaurantes');
        });
    }
    
    // Cerrar popups al hacer clic fuera
    ['gasolina', 'hoteles', 'restaurantes'].forEach(tipo => {
        const popup = document.getElementById(`popup-gasto-${tipo}`);
        if (popup) {
            popup.addEventListener('click', function(e) {
                if (e.target === popup) {
                    cerrarPopupGasto(tipo);
                }
            });
        }
    });
});

// Exponer funciones globalmente
window.abrirPopupGasto = abrirPopupGasto;
window.cerrarPopupGasto = cerrarPopupGasto;
window.anadirGasto = anadirGasto;
window.eliminarGasto = eliminarGasto;
window.cargarGastosDesdeDB = cargarGastosDesdeDB;
window.gastosPresupuesto = gastosPresupuesto;

console.log('Sistema de presupuesto cargado');
