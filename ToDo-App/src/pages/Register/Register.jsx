import { Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  return (
    <div className="login-wrapper">
      <h1 className="login-title">Willkommen bei</h1>
      <h1 className="login-title-simple">Simple ToDo</h1>

      <input type="text" placeholder="Email" className="input-field" />
      <input
        type="password"
        placeholder="Password erstellen"
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password wiederholen"
        className="input-field"
      />

      <button className="login-button">Registrieren</button>

      <div className="register-link">
        <Link to="/">Schon einen Account? Login</Link>
      </div>
    </div>
  );
}
