import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../api/axios";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault(); // verhindert Page Reload (SPA)
    setErr("");
    setLoading(true);
    try {
      const payload = {
        email: (email || "").trim().toLowerCase(),
        password: (password || "").trim(),
      };
      const { data } = await api.post("/auth/login", payload);
      localStorage.setItem("token", data.token); //speichern
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (e) {
      const msg = e?.response?.data?.error?.message || "Login fehlgeschlagen";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <h1 className="login-title">Willkommen zurück bei</h1>
      <h1 className="login-title-simple">Simple ToDo</h1>

      {err && <p className="error">{err}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Passwort"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="login-button" disabled={loading}>
          {loading ? "Einloggen..." : "Login"}
        </button>
      </form>

      <div className="register-link">
        <Link to="/register">Noch keinen Account? Registrieren</Link>
      </div>
    </div>
  );
}
