import { api } from "./axios";

const VAPID_PUBLIC_KEY = "BOkuMhIh_ZC85rUJwAj85HUbsQt6dEImGUhnsgSagaZh45vYgY46KV882y7jeJzgOfB6BCbEolzMm0Nq8XNRoSQ"; 

export async function subscribeToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    alert("Push Notifications werden von deinem Browser nicht unterstützt.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("Push-Benachrichtigungen wurden blockiert.");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  await api.post("/push/subscribe", { subscription });
  alert("Push-Benachrichtigungen aktiviert!");
}

// Hilfsfunktion für den Key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
