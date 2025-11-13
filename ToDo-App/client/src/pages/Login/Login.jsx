import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Alle User laden
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Benutzer suchen
    const storedUser = allUsers.find((u) => u.email === email);

    if (!storedUser) {
      alert("❌ Kein Benutzer mit dieser E-Mail gefunden! Bitte registrieren.");
      return;
    }

    // Passwort prüfen
    if (password === storedUser.password) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("loggedInUser", email);
      alert("✅ Login erfolgreich!");
      navigate("/home");
    } else {
      alert("⚠️ Falsches Passwort. Bitte erneut versuchen.");
    }
  };

  return (
    <div className="login-wrapper">
      <h1 className="login-title">Willkommen zurück bei</h1>
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
        placeholder="Password"
        className="input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="login-button" onClick={handleLogin}>
        Login
      </button>

      <div className="register-link">
        <Link to="/register">Noch keinen Account? Registrieren</Link>
      </div>
    </div>
  );
}
