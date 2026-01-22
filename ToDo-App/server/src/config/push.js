// server/src/config/push.js
import webpush from "web-push";
import { env } from "./env.js";

// Hier ob  ENV-Werte wirklich ankommen
console.log("VAPID CONFIG:", {
  subject: env.vapidSubject,
  publicKey: env.vapidPublicKey ? "OK" : "MISSING",
  privateKey: env.vapidPrivateKey ? "OK" : "MISSING",
});

// Wenn einer davon undefined ist, kracht web-push
webpush.setVapidDetails(
  env.vapidSubject || "mailto:test@example.com",
  env.vapidPublicKey,
  env.vapidPrivateKey
);

// Named export, damit import { webpush } ... funktioniert
export { webpush };
