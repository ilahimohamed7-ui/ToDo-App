import "./ToDos.css";
import shareIcon from "../../assets/share.png";
import deleteIcon from "../../assets/delete.png";
import backIcon from "../../assets/back.png";

export default function ToDos() {
  return (
    <div>
      <header className="todos-header">
        {/* Obere Leiste */}
        <div className="todos-topbar">
          <div className="back-section">
            <img src={backIcon} alt="Zurück" className="icon-btn" />
            <h2 className="back-title">Zurück zu ToDo-Listen</h2>
          </div>

          <div className="header-icons">
            <span>🔔</span>
            <span>👤</span>
          </div>
        </div>

        <hr className="header-divider" />

        {/* Titelzeile */}
        <div className="todos-titlebar">
          <h1>ToDos für: Schule</h1>
          <img src={shareIcon} alt="Teilen" className="icon-btn" />
        </div>
      </header>

      {/* Eingabebereich */}
      <div className="todos-input-section">
        <input
          type="text"
          placeholder="Neue Aufgabe eingeben"
          className="todos-input"
        />
        <input type="time" className="todos-time-input" />
        <button className="todos-add-btn">Hinzufügen</button>
      </div>

      {/* Aufgabenliste */}
      <div className="todos-list">
        <div className="todo-item">
          <div className="todo-left">
            <input type="checkbox" className="todo-checkbox" />
            <span>Hausaufgaben machen</span>
          </div>
          <div className="todo-right">
            <span className="todo-time">14:30</span>
            <img src={deleteIcon} alt="Löschen" className="icon-btn" />
          </div>
        </div>

        <div className="todo-item">
          <div className="todo-left">
            <input type="checkbox" className="todo-checkbox" />
            <span>Mathe lernen</span>
          </div>
          <div className="todo-right">
            <span className="todo-time">16:00</span>
            <img src={deleteIcon} alt="Löschen" className="icon-btn" />
          </div>
        </div>
      </div>
    </div>
  );
}
