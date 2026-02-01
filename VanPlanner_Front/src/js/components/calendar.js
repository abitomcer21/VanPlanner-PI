document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar')
    const calendar = new FullCalendar.Calendar(calendarEl, {
        firstDay: 1, 
        initialView: 'dayGridMonth',
        locale: 'es'
    })
    calendar.render()

})