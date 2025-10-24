import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("❌ Kein Benutzer gefunden! Bitte registrieren.");
      return;
    }

    if (email === storedUser.email && password === storedUser.password) {
      localStorage.setItem("loggedIn", "true");
      alert("Login erfolgreich!");
      navigate("/home");
    } else {
      alert("Ungültige Anmeldedaten. Bitte versuchen Sie es erneut.");
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
