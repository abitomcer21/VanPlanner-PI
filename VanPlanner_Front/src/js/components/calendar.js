document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            firstDay: 1,
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día'
            },
            editable: false,
            selectable: false,
            dayMaxEvents: true,
            
            // Aplicar estilos CSS a los días fuera del rango
            dayCellClassNames: function(info) {
                const fechaInicioStr = document.getElementById('fecha-inicio')?.value;
                const fechaFinStr = document.getElementById('fecha-fin')?.value;
                
                if (!fechaInicioStr || !fechaFinStr) return ['fc-day-disabled'];
                
                const cellDate = new Date(info.date);
                const startDate = new Date(fechaInicioStr + 'T00:00:00');
                const endDate = new Date(fechaFinStr + 'T23:59:59');
                
                cellDate.setHours(0, 0, 0, 0);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);
                
                if (cellDate < startDate || cellDate > endDate) {
                    return ['fc-day-disabled'];
                }
                return ['fc-day-enabled'];
            },
            
            // Prevenir clicks en días deshabilitados
            dateClick: function(info) {
                const fechaInicioStr = document.getElementById('fecha-inicio')?.value;
                const fechaFinStr = document.getElementById('fecha-fin')?.value;

                if (!fechaInicioStr || !fechaFinStr) {
                    alert('Define las fechas de inicio y fin del viaje primero.');
                    return;
                }

                const clickedDate = new Date(info.dateStr + 'T00:00:00');
                const startDate = new Date(fechaInicioStr + 'T00:00:00');
                const endDate = new Date(fechaFinStr + 'T00:00:00');
                
                clickedDate.setHours(0, 0, 0, 0);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);

                if (clickedDate < startDate || clickedDate > endDate) {
                    alert('Solo puedes añadir eventos dentro del rango del viaje.');
                    return;
                }
                
                // Mostrar puntos de interés del día seleccionado
                if (window.mostrarPuntosInteresDelDia) {
                    window.mostrarPuntosInteresDelDia(info.dateStr);
                }
                
                // Cambiar a la vista de día al hacer clic en una fecha válida
                calendar.changeView('timeGridDay', info.dateStr);
            },

            eventClick: function(info) {
                // Mostrar detalles del evento al hacer clic
                const props = info.event.extendedProps.itinerario;
                if (props) {
                    alert(
                        `Actividad: ${info.event.title}\n` +
                        `Ubicación: ${props.ubicacion}\n` +
                        `Hora: ${props.hora_inicio} - ${props.hora_fin}`
                    );
                }
            }
        });
        
        calendar.render();
        window.calendar = calendar; // Exponer el calendario globalmente
    }

    // Escuchar cambios en los campos de fecha del viaje para actualizar el calendario
    const fechaInicioInput = document.getElementById('fecha-inicio');
    const fechaFinInput = document.getElementById('fecha-fin');
    
    function actualizarRangoCalendario() {
        if (window.calendar) {
            const fechaInicio = fechaInicioInput?.value;
            if (fechaInicio) {
                window.calendar.gotoDate(fechaInicio);
            }
            // Vuelve a renderizar para aplicar las clases de días deshabilitados
            window.calendar.render(); 
        }
    }
    
    if (fechaInicioInput && fechaFinInput) {
        fechaInicioInput.addEventListener('change', actualizarRangoCalendario);
        fechaFinInput.addEventListener('change', actualizarRangoCalendario);
    }
});