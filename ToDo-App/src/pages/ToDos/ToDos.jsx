import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ToDos.css";
import shareIcon from "../../assets/share.png";
import deleteIcon from "../../assets/delete.png";
import backIcon from "../../assets/back.png";
import profileIcon from "../../assets/profile.png";
import Popup from "../Popup/Popup.jsx";

export default function ToDos() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectId = params.get("id"); // z. B. ?id=12345

  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [projectName, setProjectName] = useState("");
  const [newTodoTime, setNewTodoTime] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [shareEmail, setShareEmail] = useState("");

  //useEffect wird ausgeführ sobald die Seite geladen wird

  useEffect(() => {
    // Projekte aus dem Speicher holen
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const currentProject = storedProjects.find(
      (p) => p.id.toString() === projectId
    );

    if (currentProject) {
      // Projektnamen setzen
      setProjectName(currentProject.name);
    } else {
      // Wenn kein Projekt mit der ID gefunden wird → zurück zur Startseite
      navigate("/home");
      return;
    }

    // Todos für dieses Projekt laden
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || {};
    setTodos(storedTodos[projectId] || []);
  }, [projectId, navigate]); // <- beide Dependencies angegeben ✅

  // ➕ Aufgabe hinzufügen
  const handleAddTodo = () => {
    if (newTodoText.trim() === "") {
      alert("Bitte geben Sie eine Aufgabe ein.");
      return;
    }

    const newTask = {
      id: Date.now(),
      name: newTodoText,
      completed: false,
      time: newTodoTime,
    };

    const updatedTodos = [...todos, newTask];
    setTodos(updatedTodos);

    // im LocalStorage speichern
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || {};
    storedTodos[projectId] = updatedTodos;
    localStorage.setItem("todos", JSON.stringify(storedTodos));

    setNewTodoText("");
    setNewTodoTime("");
  };

  // 🗑️ Aufgabe löschen
  const handleDeleteTodo = (id) => {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);

    const storedTodos = JSON.parse(localStorage.getItem("todos")) || {};
    storedTodos[projectId] = updated;
    localStorage.setItem("todos", JSON.stringify(storedTodos));
  };

  const handleToggeleCheckbox = (id) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);

    const storedTodos = JSON.parse(localStorage.getItem("todos")) || {};
    storedTodos[projectId] = updated;
    localStorage.setItem("todos", JSON.stringify(storedTodos));
  };

  const handleSend = () => {
    // Hier können Sie die Logik zum Teilen der ToDo-Liste per E-Mail implementieren
    alert(`ToDo-Liste wirde geteilt mit :  ${shareEmail} `);
    setShowPopup(false);
    setShareEmail("");
  };

  return (
    <div>
      <header className="todos-header">
        {/* Obere Leiste */}
        <div className="todos-topbar">
          <div className="back-section" onClick={() => navigate("/home")}>
            <img src={backIcon} alt="Zurück" className="icon-btn" />
            <h2 className="back-title">Zurück zu ToDo-Listen</h2>
          </div>

          <div className="header-icons">
            <span>🔔</span>
            <img
              src={profileIcon}
              alt="Profil"
              className="icon-btn"
              onClick={() => navigate("/profile")}
            />
          </div>
        </div>

        <hr className="header-divider" />

        {/* Titelzeile */}
        <div className="todos-titlebar">
          <h1>ToDos für: {projectName}</h1>
          <img
            src={shareIcon}
            alt="Teilen"
            className="icon-btn"
            onClick={() => setShowPopup(true)}
          />
          {showPopup && (
            <Popup
              title="Teilen Sie Ihre ToDo-Liste"
              message="Geben Sie die E-Mail-Adresse ein, mit der Sie die ToDo-Liste teilen möchten:"
              inputValue={shareEmail}
              onInputChange={setShareEmail}
              onClose={() => setShowPopup(false)}
              onSend={handleSend}
            />
          )}
        </div>
      </header>

      {/* Eingabebereich */}
      <div className="todos-input-section">
        <input
          type="text"
          placeholder="Neue Aufgabe eingeben"
          className="todos-input"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
        />

        <input
          type="time"
          className="todos-time-input"
          value={newTodoTime}
          onChange={(e) => setNewTodoTime(e.target.value)}
        />

        <button className="todos-add-btn" onClick={handleAddTodo}>
          Hinzufügen
        </button>
      </div>

      {/* Aufgabenliste */}
      <div className="todos-list">
        {todos.map((todo) => (
          <div className="todo-item" key={todo.id}>
            <div className="todo-left">
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed}
                onChange={() => handleToggeleCheckbox(todo.id)}
              />
              <span>{todo.name}</span>
            </div>
            <div className="todo-right">
              {todo.time && <span className="todo-time">{todo.time}</span>}
              <img
                src={deleteIcon}
                alt="Löschen"
                className="icon-btn"
                onClick={() => handleDeleteTodo(todo.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
