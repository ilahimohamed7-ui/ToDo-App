// Wird aufgerufen, wenn vom Server ein Push-Event kommt
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push empfangen:", event.data && event.data.text());

  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    console.error("Konnte Push-Daten nicht parsen:", e);
  }

  const title = data.title || "Simple ToDo";
  const options = {
    body: data.body || "Du hast eine neue Benachrichtigung!",
    icon: "/favicon.ico",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
