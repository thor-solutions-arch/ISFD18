document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",

    selectable: true,

    editable: false,

    events: async function (fetchInfo, successCallback) {
      const res = await fetch("/events");

      const data = await res.json();

      successCallback(data);
    },

    dateClick: async function (info) {
      const title = prompt("Event title");

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
      const confirmDelete = confirm("Delete this event?");

      if (!confirmDelete) return;

      await fetch("/events/" + info.event.id, {
        method: "DELETE",
      });

      calendar.refetchEvents();
    },
  });

  calendar.render();
});
