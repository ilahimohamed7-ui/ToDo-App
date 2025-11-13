import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import profileIcon from "../../assets/profile.png";
import backIcon from "../../assets/back.png";

export default function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/");
      return;
    }

    setEmail(storedUser.email);
    setUsername(storedUser.username);
  }, [navigate]);

  const handleSaveUsername = () => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    storedUser.username = username;
    localStorage.setItem("user", JSON.stringify(storedUser));
    alert("Benutzername aktualisiert!");
  };

  const handleChangePassword = () => {
    if (newPassword.trim() === "") {
      alert("Bitte geben Sie ein neues Passwort ein.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    storedUser.password = newPassword;
    localStorage.setItem("user", JSON.stringify(storedUser));
    alert("Passwort aktualisiert!");
    setNewPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <div className="profile-container">
      {/* Zurück-Bereich */}
      <div className="back-section" onClick={() => navigate("/home")}>
        <img src={backIcon} alt="Zurück" className="icon-btn" />
        <h1 className="back-title">Zurück</h1>
      </div>

      {/* Kopfbereich */}
      <div className="profile-header">
        <img src={profileIcon} alt="Profil" className="profile-icon" />
        <h1>Mein Profil</h1>
      </div>

      {/* Benutzername */}
      <div className="profile-section">
        <label>Benutzername:</label>
        <input
          type="text"
          placeholder="Dein Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSaveUsername}> Speichern</button>
      </div>

      {/* E-Mail */}
      <div className="profile-section">
        <label>Email-Adresse:</label>
        <input type="text" value={email} readOnly />
      </div>

      {/* Passwort */}
      <div className="profile-section">
        <label>Passwort:</label>
        <input
          type="password"
          placeholder="Neues Passwort eingeben"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleChangePassword}> Ändern</button>
      </div>

      {/* Abmelden */}
      <div className="profile-footer">
        <button className="logout-btn" onClick={handleLogout}>
          Abmelden
        </button>
      </div>
    </div>
  );
}
