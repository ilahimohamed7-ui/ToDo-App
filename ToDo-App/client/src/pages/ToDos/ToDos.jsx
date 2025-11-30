import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ToDos.css";
import shareIcon from "../../assets/share.png";
import deleteIcon from "../../assets/delete.png";
import backIcon from "../../assets/back.png";
import profileIcon from "../../assets/profile.png";
import Popup from "../Popup/Popup.jsx";
import Notification from "../Notification/Notifications.jsx";
import { api } from "../../api/axios";
import { socket } from "../../socket.js";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!projectId) return;

    // Socket verbinden (falls noch nicht)
    if (!socket.connected) {
      socket.connect();
    }

    // Projekt-Raum joinen
    socket.emit("joinProject", projectId);

    // Handler für Projekt-Updates
    const handleProjectUpdate = (project) => {
      if (project._id === projectId) {
        setProjectName(project.name);
        setTodos(project.tasks || []);
      }
    };

    socket.on("project:updated", handleProjectUpdate);

    // Cleanup beim Verlassen
    return () => {
      socket.emit("leaveProject", projectId);
      socket.off("project:updated", handleProjectUpdate);
      // socket.disconnect();  // optional, wenn du Socket komplett trennen willst
    };
  }, [projectId]);

  // Projekt + Tasks von der API laden
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    if (!projectId) {
      navigate("/home");
      return;
    }

    async function loadProject() {
      try {
        const { data } = await api.get("/projects");
        const project = (data.projects || []).find((p) => p._id === projectId);
        if (!project) {
          navigate("/home");
          return;
        }
        setProjectName(project.name);
        setTodos(project.tasks || []);
      } catch (e) {
        console.error(e);
        if (e.response?.status === 401) navigate("/");
      }
    }

    loadProject();
  }, [projectId, navigate]);

  // Aufgabe hinzufügen (API)
  const handleAddTodo = async () => {
    if (!newTodoText.trim()) {
      alert("Bitte geben Sie eine Aufgabe ein.");
      return;
    }

    try {
      const { data } = await api.post(`/projects/${projectId}/tasks`, {
        title: newTodoText,
        dueDateTime: newTodoTime || null,
      });
      setTodos(data.project.tasks || []);
      setNewTodoText("");
      setNewTodoTime("");
    } catch (e) {
      console.error(e);
      alert("Aufgabe konnte nicht hinzugefügt werden.");
    }
  };

  // Aufgabe löschen (API)
  const handleDeleteTodo = async (taskId) => {
    try {
      const { data } = await api.delete(
        `/projects/${projectId}/tasks/${taskId}`
      );
      setTodos(data.project.tasks || []);

      // Notifications aufräumen
      const allNotifications =
        JSON.parse(localStorage.getItem("notifications")) || [];
      const filtered = allNotifications.filter((n) => n.todoId !== taskId);
      localStorage.setItem("notifications", JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
      alert("Aufgabe konnte nicht gelöscht werden.");
    }
  };

  // Checkbox toggeln (completed)
  const handleToggleCheckbox = async (taskId) => {
    const todo = todos.find((t) => t._id === taskId);
    if (!todo) return;

    try {
      const { data } = await api.patch(
        `/projects/${projectId}/tasks/${taskId}`,
        { completed: !todo.completed }
      );
      setTodos(data.project.tasks || []);

      // Notifications bei Abschluss löschen
      const allNotifications =
        JSON.parse(localStorage.getItem("notifications")) || [];
      const filtered = allNotifications.filter((n) => n.todoId !== taskId);
      localStorage.setItem("notifications", JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
      alert("Status konnte nicht geändert werden.");
    }
  };

  // Teilen (über API)
  const handleSend = async () => {
    try {
      if (!shareEmail.trim()) {
        alert("Bitte E-Mail-Adresse eingeben.");
        return;
      }
      await api.post(`/projects/${projectId}/collaborators`, {
        email: shareEmail.trim().toLowerCase(),
      });
      alert(`ToDo-Liste wurde geteilt mit: ${shareEmail}`);
      setShowPopup(false);
      setShareEmail("");
    } catch (e) {
      console.error(e);
      alert(
        e?.response?.data?.error?.message ||
          "Teilen der ToDo-Liste ist fehlgeschlagen."
      );
    }
  };

  const addNotification = (type, message, todoId = "") => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];

    const exists = stored.some((n) => n.todoId === todoId && n.type === type);
    if (exists) return;

    const newNotification = {
      id: Date.now(),
      type,
      message,
      todoId,
    };
    localStorage.setItem(
      "notifications",
      JSON.stringify([...stored, newNotification])
    );
  };

  // Erinnerungen prüfen (weiterhin lokal)
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      todos.forEach((todo) => {
        if (!todo.dueDateTime || todo.completed) return;

        const dueDate = new Date(todo.dueDateTime);
        const diff = dueDate.getTime() - now.getTime();

        if (diff > 0 && diff <= 15 * 60 * 1000) {
          addNotification(
            "reminder",
            `Erinnerung: "${todo.title}" ist bald fällig!`,
            todo._id
          );
        }
        if (diff <= 0 && diff > -60000) {
          addNotification(
            "reminder",
            `⚠️ "${todo.title}" ist jetzt fällig!`,
            todo._id
          );
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 5000);
    return () => clearInterval(interval);
  }, [todos]);

  return (
    <div>
      {/* Header */}
      <header className="todos-header">
        <div className="todos-topbar">
          <div className="back-section" onClick={() => navigate("/home")}>
            <img src={backIcon} alt="Zurück" className="icon-btn" />
            <h2 className="back-title">Zurück zu ToDo-Listen</h2>
          </div>

          <div className="header-icons">
            <span
              className="icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              🔍
            </span>
            <Notification />
            <img
              src={profileIcon}
              alt="Profil"
              className="icon-btn"
              onClick={() => navigate("/profile")}
            />
          </div>
        </div>

        <hr className="header-divider" />

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

      {searchOpen && (
        <div className="todos-searchbar">
          <input
            type="text"
            placeholder="Aufgabe suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
        {todos
          .filter((t) => {
            const term = (searchTerm || "").trim().toLowerCase();
            return term === "" || (t.title || "").toLowerCase().includes(term);
          })
          .map((todo) => (
            <div className="todo-item" key={todo._id}>
              <div className="todo-left">
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={!!todo.completed}
                  onChange={() => handleToggleCheckbox(todo._id)}
                />
                <span>{todo.title}</span>
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
                  onClick={() => handleDeleteTodo(todo._id)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
