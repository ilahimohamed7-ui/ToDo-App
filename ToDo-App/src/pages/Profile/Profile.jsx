import "./Profile.css";
import { useNavigate } from "react-router-dom";
import profileIcon from "../../assets/profile.png";
import backIcon from "../../assets/back.png";

export default function Profile() {
  const navigate = useNavigate();

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
        <input type="text" placeholder="Dein Benutzername" />
        <button>Ändern</button>
      </div>

      {/* E-Mail */}
      <div className="profile-section">
        <label>Email-Adresse:</label>
        <input type="text" value="deine.email@example.com" readOnly />
      </div>

      {/* Passwort */}
      <div className="profile-section">
        <label>Passwort:</label>
        <input type="password" placeholder="********" />
        <button>Ändern</button>
      </div>

      {/* Abmelden */}
      <div className="profile-footer">
        <button className="logout-btn">Abmelden</button>
      </div>
    </div>
  );
}
