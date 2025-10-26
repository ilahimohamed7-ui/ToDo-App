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
  const projectId = params.get("id");

  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoTime, setNewTodoTime] = useState("");
  const [projectName, setProjectName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [shareEmail, setShareEmail] = useState("");

  //  Projekte  Todos beim Laden holen
  useEffect(() => {
    const userEmail = localStorage.getItem("loggedInUser");
    if (!userEmail) {
      navigate("/");
      return;
    }

    // Projekt laden
    const storedProjects =
      JSON.parse(localStorage.getItem(`projects_${userEmail}`)) || [];
    const currentProject = storedProjects.find(
      (p) => p.id.toString() === projectId
    );

    if (currentProject) {
      setProjectName(currentProject.name);
    } else {
      navigate("/home");
      return;
    }

    // Todos laden
    const storedTodos =
      JSON.parse(localStorage.getItem(`todos_${userEmail}`)) || {};
    setTodos(storedTodos[projectId] || []);
  }, [projectId, navigate]);

  // Aufgabe hinzufügen
  const handleAddTodo = () => {
    const userEmail = localStorage.getItem("loggedInUser");
    if (!userEmail) return;

    if (newTodoText.trim() === "") {
      alert("Bitte geben Sie eine Aufgabe ein.");
      return;
    }

    const newTask = {
      id: Date.now(),
      name: newTodoText,
      completed: false,
      time: newTodoTime || null,
    };

    const updatedTodos = [...todos, newTask];
    setTodos(updatedTodos);

    const storedTodos =
      JSON.parse(localStorage.getItem(`todos_${userEmail}`)) || {};
    storedTodos[projectId] = updatedTodos;
    localStorage.setItem(`todos_${userEmail}`, JSON.stringify(storedTodos));

    setNewTodoText("");
    setNewTodoTime("");
  };

  //  Aufgabe löschen
  const handleDeleteTodo = (id) => {
    const userEmail = localStorage.getItem("loggedInUser");
    if (!userEmail) return;

    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);

    const storedTodos =
      JSON.parse(localStorage.getItem(`todos_${userEmail}`)) || {};
    storedTodos[projectId] = updated;
    localStorage.setItem(`todos_${userEmail}`, JSON.stringify(storedTodos));
  };

  //  Checkbox toggeln
  const handleToggleCheckbox = (id) => {
    const userEmail = localStorage.getItem("loggedInUser");
    if (!userEmail) return;

    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);

    const storedTodos =
      JSON.parse(localStorage.getItem(`todos_${userEmail}`)) || {};
    storedTodos[projectId] = updated;
    localStorage.setItem(`todos_${userEmail}`, JSON.stringify(storedTodos));
  };

  // Teilen
  const handleSend = () => {
    alert(`ToDo-Liste wurde geteilt mit: ${shareEmail}`);
    setShowPopup(false);
    setShareEmail("");
  };

  return (
    <div>
      {/* Header */}
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
            onClick={(e) => {
              e.stopPropagation();
              setShowPopup(true);
            }}
          />
          {showPopup && (
            <Popup
              title="Teilen Sie Ihre ToDo-Liste"
              onClose={() => setShowPopup(false)}
              onSend={handleSend}
              value={shareEmail}
              setValue={setShareEmail}
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
                onChange={() => handleToggleCheckbox(todo.id)}
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
