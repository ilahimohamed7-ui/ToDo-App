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
  const [shownReminders, setShownReminders] = useState([]);
  const [reminderTodos, setReminderTodos] = useState([]);
  const [showReminderPopup, setShowReminderPopup] = useState(false);

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
      dueDateTime: newTodoTime,
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

  useEffect(() => {
    const now = new Date();
    const reminders = todos.filter((todo) => {
      if (!todo.dueDateTime) return false;
      const todoDate = new Date(todo.dueDateTime);
      const timeDiff = todoDate - now;
      return timeDiff > 0 && timeDiff <= 15 * 60 * 1000;
    });

    setReminderTodos(reminders);
  }, [todos]);

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
            <span
              className="bell-icon"
              onClick={() => setShowReminderPopup(!showReminderPopup)}
            >
              🔔
              {reminderTodos.length > 0 && (
                <span className="notification-badge">
                  {reminderTodos.length}
                </span>
              )}
            </span>

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

      {showReminderPopup && (
        <div className="reminder-popup">
          <h3>Erinnerungen</h3>
          {reminderTodos.length === 0 ? (
            <p>Keine anstehenden Erinnerungen.</p>
          ) : (
            reminderTodos.map((todo) => (
              <div
                key={todo.id}
                className="reminder-item"
                onClick={() => {
                  handleToggleCheckbox(todo.id);
                  setShownReminders((prev) => [...prev, todo.id]);
                }}
              >
                <span>{todo.name}</span>
                {!shownReminders.includes(todo.id) && (
                  <span className="reminder-time">
                    Fällig um:{" "}
                    {new Date(todo.dueDateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

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
          type="datetime-local"
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
              {todo.dueDateTime && (
                <span className="todo-time">
                  {new Date(todo.dueDateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
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
