
// public/app.js

document.addEventListener(
  'DOMContentLoaded',
  async function () {

    const calendarEl =
      document.getElementById('calendar')

    const calendar =
      new FullCalendar.Calendar(
        calendarEl,
        {

          locale: 'es',

          firstDay: 1,

          initialView: 'dayGridMonth',

          selectable: true,

          editable: false,

          height: 'auto',

          dayMaxEvents: 3,

          headerToolbar: {

            left:
              'prev,next today',

            center:
              'title',

            right:
              'dayGridMonth,timeGridWeek'
          },

          buttonText: {

            today: 'Hoy',

            month: 'Mes',

            week: 'Semana'
          },

          dayHeaderFormat: {
            weekday: 'short'
          },

          /* =========================
             CARGAR EVENTOS
          ========================= */

          events: async function(
            info,
            successCallback
          ) {

            const res =
              await fetch('/events')

            const data =
              await res.json()

            successCallback(data)
          },

          /* =========================
             CREAR EVENTO
          ========================= */

          dateClick: async function(info) {

            const title =
              prompt(
                'Nombre del evento'
              )

            if (!title) return

            await fetch('/events', {

              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body: JSON.stringify({

                title,

                start: info.dateStr
              })
            })

            calendar.refetchEvents()
          },

          /* =========================
             ELIMINAR EVENTO
          ========================= */

          eventClick: async function(info) {

            const confirmDelete =
              confirm(
                '¿Eliminar este evento?'
              )

            if (!confirmDelete) return

            await fetch(
              '/events/' + info.event.id,
              {
                method: 'DELETE'
              }
            )

            calendar.refetchEvents()
          }

        }
      )

    calendar.render()
  }
)
