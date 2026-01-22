// server/src/routes/push.routes.js
import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { webpush } from "../config/push.js";
import { Project } from "../models/Project.js";

const router = Router();

// userId --> [subscriptions]
const subscribers = new Map();

// Set zum Verhindern von doppelten Pushes für dieselbe Aufgabe
const sentReminders = new Set();


//  API-Routen


router.use(auth(true));

// Subscription speichern
router.post("/subscribe", (req, res) => {
  const userId = req.user._id.toString();
  const { subscription } = req.body;

  if (!subscription) {
    return res
      .status(400)
      .json({ error: { message: "Subscription fehlt" } });
  }

  if (!subscribers.has(userId)) {
    subscribers.set(userId, []);
  }

  const list = subscribers.get(userId);

  // Duplikate vermeiden
  if (!list.find((s) => JSON.stringify(s) === JSON.stringify(subscription))) {
    list.push(subscription);
  }

  console.log(" Neue Push-Subscription für User:", userId);
  return res.status(201).json({ ok: true });
});

// Test-Push per Button
router.post("/test", async (req, res) => {
  const userId = req.user._id.toString();
  const subs = subscribers.get(userId) || [];

  console.log(` Sende Test-Push an ${subs.length} Subscriptions von User ${userId}`);

  if (subs.length === 0) {
    return res
      .status(400)
      .json({ error: { message: "Keine Push-Subscription vorhanden" } });
  }

  const payload = JSON.stringify({
    title: "Simple ToDo",
    body: "Dies ist eine Test-Push-Benachrichtigung 🎉",
    url: "/home",
  });

  await Promise.all(
    subs.map((sub) =>
      webpush.sendNotification(sub, payload).catch((err) => {
        console.error("Push error:", err);
      })
    )
  );

  return res.json({ ok: true });
});


//  Reminder-Logik (Server)


// Hilfsfunktion: Push an mehrere User schicken
async function notifyUsers(userIds, payload) {
  const payloadString = JSON.stringify(payload);
  const uniqueIds = [...new Set(userIds.filter(Boolean))];

  for (const userId of uniqueIds) {
    const subs = subscribers.get(userId) || [];
    if (!subs.length) continue;

    for (const sub of subs) {
      try {
        await webpush.sendNotification(sub, payloadString);
      } catch (err) {
        console.error("Push error:", err);
      }
    }
  }
}

// Prüft regelmäßig alle Tasks und verschickt Erinnerungen
async function checkTaskReminders() {
  const now = new Date();
  const soon = new Date(now.getTime() + 15 * 60 * 1000); // +15 Minuten

  try {
    // Alle Projekte laden 
    const projects = await Project.find().lean();

    for (const project of projects) {
      const ownerId = project.owner?.toString?.();
      const collaboratorIds = (project.collaborators || []).map((c) =>
        c.toString()
      );
      const userIds = [ownerId, ...collaboratorIds];

      for (const task of project.tasks || []) {
        if (!task.dueDateTime || task.completed) continue;

        const due = new Date(task.dueDateTime);
        const diff = due.getTime() - now.getTime();

        // 1) Erinnerung: bald fällig (in <= 15 Minuten)
        if (diff > 0 && diff <= 15 * 60 * 1000) {
          const key = `soon-${task._id}`;
          if (!sentReminders.has(key)) {
            sentReminders.add(key);
            console.log(
              ` Reminder (bald fällig) für Task "${task.title}" in Projekt ${project._id}`
            );

            await notifyUsers(userIds, {
              title: "Aufgabe bald fällig",
              body: `„${task.title}“ ist in weniger als 15 Minuten fällig.`,
              url: `/todos?id=${project._id}`,
            });
          }
        }

        // 2) Erinnerung: jetzt fällig (Zeitpunkt  jetzt, +- 60 Sek)
        if (diff <= 0 && diff > -60 * 1000) {
          const key = `due-${task._id}`;
          if (!sentReminders.has(key)) {
            sentReminders.add(key);
            console.log(
              ` Reminder (jetzt fällig) für Task "${task.title}" in Projekt ${project._id}`
            );

            await notifyUsers(userIds, {
              title: "Aufgabe fällig",
              body: `„${task.title}“ ist jetzt fällig!`,
              url: `/todos?id=${project._id}`,
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Fehler beim Prüfen von Task-Remindern:", err);
  }
}

// Alle 60 Sekunden prüfen
setInterval(checkTaskReminders, 60 * 1000);

export default router;
