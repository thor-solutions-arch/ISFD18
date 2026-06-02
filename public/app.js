// public/app.js

const calendar = document.getElementById("calendar");

const monthTitle = document.getElementById("monthTitle");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");

const modal = document.getElementById("modal");

const eventTitle = document.getElementById("eventTitle");

const saveBtn = document.getElementById("saveBtn");

const cancelBtn = document.getElementById("cancelBtn");

let currentDate = new Date();

let selectedDate = null;

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

async function getEvents() {
  const res = await fetch("/events");

  return await res.json();
}

async function renderCalendar() {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();

  monthTitle.textContent = months[month] + " " + year;

  const firstDay = new Date(year, month, 1);

  const lastDay = new Date(year, month + 1, 0);

  let startDay = firstDay.getDay();

  startDay = startDay === 0 ? 6 : startDay - 1;

  const totalDays = lastDay.getDate();

  const events = await getEvents();

  // EMPTY CELLS

  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");

    empty.className = "day empty";

    calendar.appendChild(empty);
  }

  // REAL DAYS

  for (let day = 1; day <= totalDays; day++) {
    const dayEl = document.createElement("div");

    dayEl.className = "day";

    const date = new Date(year, month, day);

    const dateStr = date.toISOString().split("T")[0];

    // TODAY

    const today = new Date();

    if (today.toDateString() === date.toDateString()) {
      dayEl.classList.add("today");
    }

    // NUMBER

    const number = document.createElement("div");

    number.className = "day-number";

    number.textContent = day;

    dayEl.appendChild(number);

    // EVENTS CONTAINER

    const eventsContainer = document.createElement("div");

    eventsContainer.className = "events";

    // FILTER EVENTS

    const dayEvents = events.filter((e) => e.start === dateStr);

    dayEvents.forEach((event) => {
      const eventEl = document.createElement("div");

      eventEl.className = "event";

      eventEl.textContent = event.title;

      // DELETE EVENT

      eventEl.addEventListener("click", async (ev) => {
        ev.stopPropagation();

        const confirmDelete = confirm("¿Eliminar evento?");

        if (!confirmDelete) return;

        await fetch("/events/" + event.id, {
          method: "DELETE",
        });

        renderCalendar();
      });

      eventsContainer.appendChild(eventEl);
    });

    dayEl.appendChild(eventsContainer);

    // ADD EVENT

    dayEl.addEventListener("click", () => {
      selectedDate = dateStr;

      modal.classList.remove("hidden");

      eventTitle.value = "";

      eventTitle.focus();
    });

    calendar.appendChild(dayEl);
  }
}

// SAVE EVENT

saveBtn.addEventListener("click", async () => {
  const title = eventTitle.value.trim();

  if (!title) return;

  await fetch("/events", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      title,

      start: selectedDate,
    }),
  });

  modal.classList.add("hidden");

  renderCalendar();
});

// CANCEL

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// NAVIGATION

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);

  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);

  renderCalendar();
});

// INIT

renderCalendar();
