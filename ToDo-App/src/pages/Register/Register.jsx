import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!email || !password) {
      alert("Bitte Email und Passwort eingeben.");
      return;
    }

    const user = { email, password };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Registrierung erfolgreich! Bitte einloggen.");
  };
  return (
    <div className="login-wrapper">
      <h1 className="login-title">Willkommen bei</h1>
      <h1 className="login-title-simple">Simple ToDo</h1>

      <input
        type="text"
        placeholder="Email"
        className="input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Passwort erstellen"
        className="input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Passwort wiederholen"
        className="input-field"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button className="login-button" onClick={handleRegister}>
        Registrieren
      </button>

      <div className="register-link">
        <Link to="/">Schon einen Account? Login</Link>
      </div>
    </div>
  );
}
