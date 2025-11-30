import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setErr("");

    if (!form.email || !form.password) {
      setErr("Bitte Email und Passwort eingeben.");
      return;
    }
    if (form.password !== confirm) {
      setErr("Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      // direkt einloggen
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (e) {
      const msg =
        e?.response?.data?.error?.message || "Registrierung fehlgeschlagen";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <h1 className="login-title">Willkommen bei</h1>
      <h1 className="login-title-simple">Simple ToDo</h1>

      {err && <p className="error">{err}</p>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name (optional)"
          className="input-field"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Passwort erstellen"
          className="input-field"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          minLength={6}
        />

        <input
          type="password"
          placeholder="Passwort wiederholen"
          className="input-field"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={6}
        />

        <button className="login-button" disabled={loading}>
          {loading ? "Registrieren..." : "Registrieren"}
        </button>
      </form>

      <div className="register-link">
        <Link to="/">Schon einen Account? Login</Link>
      </div>
    </div>
  );
}
