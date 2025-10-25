import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import shareIcon from "../../assets/share.png";
import deleteIcon from "../../assets/delete.png";
import profileIcon from "../../assets/profile.png";

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/");
    }

    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(storedProjects);
  }, [navigate]);

  const handleAddProject = () => {
    if (newProjectName.trim() === "") {
      alert("Bitte geben Sie einen Projektnamen ein.");
      return;
    }

    const newProject = {
      id: Date.now(),
      name: newProjectName,
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setNewProjectName("");
  };

  const handleDeleteProject = (id) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
  };

  const handleOpenTodos = (id) => {
    navigate(`/todos?id=${id}`);
  };

  const getTodoCount = (projectId) => {
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || {};
    return storedTodos[projectId]?.length || 0;
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
        {/* Neue ToDo erstellen */}
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

        {/* ToDo Listen */}
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
                  <img src={shareIcon} alt="Teilen" className="icon-btn" />
                  <img
                    src={deleteIcon}
                    alt="Löschen"
                    className="icon-btn "
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
