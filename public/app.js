document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    locale: "es",

    initialView: "dayGridMonth",

    selectable: true,

    editable: false,

    height: "auto",

    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek",
    },

    buttonText: {
      today: "Hoy",
      month: "Mes",
      week: "Semana",
    },

    events: async function (info, successCallback) {
      const res = await fetch("/events");

      const data = await res.json();

      successCallback(data);
    },

    dateClick: async function (info) {
      const title = prompt("Nombre del evento");

      if (!title) return;

      await fetch("/events", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          start: info.dateStr,
        }),
      });

      calendar.refetchEvents();
    },

    eventClick: async function (info) {
      const confirmDelete = confirm("¿Eliminar este evento?");

      if (!confirmDelete) return;

      await fetch("/events/" + info.event.id, {
        method: "DELETE",
      });

      calendar.refetchEvents();
    },
  });

  calendar.render();
});
