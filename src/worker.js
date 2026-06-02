export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =========================
    // API GET EVENTS
    // =========================

    if (request.method === "GET" && url.pathname === "/events") {
      const data = await env.CALENDAR.get("events");

      return Response.json(JSON.parse(data || "[]"));
    }

    // =========================
    // API CREATE EVENT
    // =========================

    if (request.method === "POST" && url.pathname === "/events") {
      const newEvent = await request.json();

      const data = await env.CALENDAR.get("events");

      const events = JSON.parse(data || "[]");

      newEvent.id = Date.now();

      events.push(newEvent);

      await env.CALENDAR.put("events", JSON.stringify(events));

      return Response.json({
        success: true,
      });
    }

    // =========================
    // API DELETE EVENT
    // =========================

    if (request.method === "DELETE" && url.pathname.startsWith("/events/")) {
      const id = Number(url.pathname.split("/")[2]);

      const data = await env.CALENDAR.get("events");

      const events = JSON.parse(data || "[]");

      const filtered = events.filter((e) => e.id !== id);

      await env.CALENDAR.put("events", JSON.stringify(filtered));

      return Response.json({
        success: true,
      });
    }

    // =========================
    // STATIC FILES
    // =========================

    return env.ASSETS.fetch(request);
  },
};
