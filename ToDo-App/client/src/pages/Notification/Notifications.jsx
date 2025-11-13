import { useEffect, useState } from "react";
import "./Notification.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const updatedNotifications = () => {
      const stored = JSON.parse(localStorage.getItem("notifications")) || [];
      setNotifications(stored);
    };

    updatedNotifications();

    const interval = setInterval(() => {
      updatedNotifications();
    }, 5000); // alle 5 Sekunden aktualisieren

    window.addEventListener("storage", updatedNotifications);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updatedNotifications);
    };
  }, []);

  const handleRemove = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);

    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  return (
    <div className="notifications-wrapper">
      <span className="bell-icon " onClick={() => setShowPopup(!showPopup)}>
        🔔
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </span>
      {showPopup && (
        <div className="notification-popup">
          <h3>Benachrichtigungen</h3>
          {notifications.length === 0 ? (
            <p>Keine neuen Benachrichtigungen.</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <span>{notification.message}</span>
                <button
                  className="remove-button"
                  onClick={() => handleRemove(notification.id)}
                >
                  Entfernen
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
