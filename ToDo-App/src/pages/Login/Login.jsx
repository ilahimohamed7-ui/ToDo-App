import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-wrapper">
      <h1 className="login-title">Willkommen zurück bei</h1>
      <h1 className="login-title-simple">Simple ToDo</h1>

      <input type="text" placeholder="Email" className="input-field" />
      <input type="password" placeholder="Password" className="input-field" />

      <button className="login-button">Login</button>

      <div className="register-link">
        <Link to="/register">Noch keinen Account? Registrieren</Link>
      </div>
    </div>
  );
}
