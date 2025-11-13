import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import shareIcon from "../../assets/share.png";
import deleteIcon from "../../assets/delete.png";
import profileIcon from "../../assets/profile.png";
import Popup from "../Popup/Popup";

export default function Home() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Beim Laden: Benutzer prüfen und Projekte laden
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const userEmail = localStorage.getItem("loggedInUser");

    if (!loggedIn || !userEmail) {
      navigate("/");
      return;
    }

    const storedProjects =
      JSON.parse(localStorage.getItem(`projects_${userEmail}`)) || [];
    setProjects(storedProjects);
  }, [navigate]);

  //  Projekt hinzufügen
  const handleAddProject = () => {
    if (newProjectName.trim() === "") {
      alert("Bitte geben Sie einen Projektnamen ein.");
      return;
    }

    const userEmail = localStorage.getItem("loggedInUser");
    if (!userEmail) {
      alert("Fehler: Kein Benutzer gefunden. Bitte neu einloggen.");
      navigate("/");
      return;
    }

    const storedProjects =
      JSON.parse(localStorage.getItem(`projects_${userEmail}`)) || [];

    const newProject = {
      id: Date.now(),
      name: newProjectName,
    };

    const updatedProjects = [...storedProjects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem(
      `projects_${userEmail}`,
      JSON.stringify(updatedProjects)
    );
    setNewProjectName("");
  };

  // 🗑 Projekt löschen
  const handleDeleteProject = (id) => {
    const userEmail = localStorage.getItem("loggedInUser");
    if (!userEmail) return;

    const storedProjects =
      JSON.parse(localStorage.getItem(`projects_${userEmail}`)) || [];
    const updated = storedProjects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem(`projects_${userEmail}`, JSON.stringify(updated));
  };

  // 📂 Todos öffnen
  const handleOpenTodos = (id) => {
    navigate(`/todos?id=${id}`);
  };

  //  Anzahl Aufgaben anzeigen
  const getTodoCount = (projectId) => {
    const userEmail = localStorage.getItem("loggedInUser");
    if (!userEmail) return 0;
    const storedTodos =
      JSON.parse(localStorage.getItem(`todos_${userEmail}`)) || {};
    return storedTodos[projectId]?.length || 0;
  };

  //  Projekt teilen
  const handleSend = () => {
    const senderEmail = localStorage.getItem("loggedInUser");
    if (!shareEmail || shareEmail === senderEmail) {
      alert("❌ Ungültige Empfänger-Adresse");
      return;
    }

    const projectToShare = projects.find((p) => p.id === selectedProjectId);
    if (!projectToShare) return;

    const recipientProjects =
      JSON.parse(localStorage.getItem(`projects_${shareEmail}`)) || [];

    const alreadyExists = recipientProjects.some(
      (p) => p.id === projectToShare.id
    );

    if (!alreadyExists) {
      recipientProjects.push(projectToShare);
      localStorage.setItem(
        `projects_${shareEmail}`,
        JSON.stringify(recipientProjects)
      );
      alert(`✅ Projekt wurde mit ${shareEmail} geteilt`);
    } else {
      alert("⚠️ Dieses Projekt wurde bereits geteilt.");
    }

    const senderTodos =
      JSON.parse(localStorage.getItem(`todos_${senderEmail}`)) || {};
    const recipientTodos =
      JSON.parse(localStorage.getItem(`todos_${shareEmail}`)) || {};
    if (senderTodos[selectedProjectId]) {
      recipientTodos[selectedProjectId] = senderTodos[selectedProjectId];
      localStorage.setItem(
        `todos_${shareEmail}`,
        JSON.stringify(recipientTodos)
      );
    }

    setShareEmail("");
    setShowPopup(false);
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1 className="home-title">Simple ToDo</h1>
        <div className="header-icons">
          <span>🔍</span>
          <span>🔔</span>
          <img
            src={profileIcon}
            alt="Profil"
            className="icon-btn"
            onClick={() => navigate("/profile")}
          />
        </div>
      </header>

      {/* Inhalt */}
      <div className="home-content">
        {/* Projekt erstellen */}
        <div className="todo-create">
          <h3>Neue ToDo erstellen:</h3>
          <input
            type="text"
            placeholder="Name"
            className="todo-input"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button className="add-button" onClick={handleAddProject}>
            Erstellen
          </button>
        </div>

        {/* Projektliste */}
        <div className="todo-lists">
          <h3>ToDo-Listen:</h3>

          {projects.length === 0 && (
            <p>Keine ToDo-Listen vorhanden. Erstellen Sie eine neue!</p>
          )}

          {projects.map((project) => (
            <div
              key={project.id}
              className="todo-box"
              onClick={() => handleOpenTodos(project.id)}
            >
              <div className="todo-box-content">
                <div>
                  <p className="todo-title">{project.name}</p>
                  <p className="todo-subtext">
                    {getTodoCount(project.id)} Aufgabe
                    {getTodoCount(project.id) !== 1 && "n"}
                  </p>
                </div>
                <div className="todo-icons">
                  {/* Teilen */}
                  <img
                    src={shareIcon}
                    alt="Teilen"
                    className="icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProjectId(project.id);
                      setShowPopup(true);
                    }}
                  />

                  {/* Löschen */}
                  <img
                    src={deleteIcon}
                    alt="Löschen"
                    className="icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Popup */}
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
      </div>
    </div>
  );
}
