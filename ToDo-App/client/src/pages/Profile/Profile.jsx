// client/src/pages/Profile/Profile.jsx
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import profileIcon from "../../assets/profile.png";
import backIcon from "../../assets/back.png";
import { api } from "../../api/axios";

export default function Profile() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPw, setLoadingPw] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !storedUser) {
      navigate("/");
      return;
    }

    setEmail(storedUser.email || "");
    setUsername(storedUser.username || "");
  }, [navigate]);

  // ✅ Username in DB speichern
  const handleSaveUsername = async () => {
    const name = username.trim();
    if (!name) return alert("Bitte einen Benutzernamen eingeben.");

    try {
      setLoadingName(true);
      const { data } = await api.patch("/users/me", { username: name });

      // local user aktualisieren
      localStorage.setItem("user", JSON.stringify(data.user));
      setEmail(data.user.email || email);
      setUsername(data.user.username || name);

      alert("Benutzername aktualisiert!");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.error?.message || "Update fehlgeschlagen");
    } finally {
      setLoadingName(false);
    }
  };

  // ✅ Passwort in DB ändern (hashed)
  const handleChangePassword = async () => {
    const pw = newPassword.trim();
    if (!pw) return alert("Bitte ein neues Passwort eingeben.");
    if (pw.length < 6)
      return alert("Passwort muss mindestens 6 Zeichen haben.");

    try {
      setLoadingPw(true);
      await api.patch("/users/me/password", { password: pw });

      alert("Passwort aktualisiert!");
      setNewPassword("");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.error?.message || "Update fehlgeschlagen");
    } finally {
      setLoadingPw(false);
    }
  };

  // ✅ Logout: Token + User löschen
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="profile-container">
      {/* Zurück */}
      <div className="back-section" onClick={() => navigate("/home")}>
        <img src={backIcon} alt="Zurück" className="icon-btn" />
        <h1 className="back-title">Zurück</h1>
      </div>

      {/* Header */}
      <div className="profile-header">
        <img src={profileIcon} alt="Profil" className="profile-icon" />
        <h1>Mein Profil</h1>
      </div>

      {/* Username */}
      <div className="profile-section">
        <label>Benutzername:</label>
        <input
          type="text"
          placeholder="Dein Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSaveUsername} disabled={loadingName}>
          {loadingName ? "Speichern..." : "Speichern"}
        </button>
      </div>

      {/* Email */}
      <div className="profile-section">
        <label>Email-Adresse:</label>
        <input type="text" value={email} readOnly />
      </div>

      {/* Passwort */}
      <div className="profile-section">
        <label>Neues Passwort:</label>
        <input
          type="password"
          placeholder="Neues Passwort eingeben"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleChangePassword} disabled={loadingPw}>
          {loadingPw ? "Ändern..." : "Ändern"}
        </button>
      </div>

      {/* Logout */}
      <div className="profile-footer">
        <button className="logout-btn" onClick={handleLogout}>
          Abmelden
        </button>
      </div>
    </div>
  );
}
