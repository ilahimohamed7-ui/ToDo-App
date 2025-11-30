import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import shareIcon from "../../assets/share.png";
import deleteIcon from "../../assets/delete.png";
import profileIcon from "../../assets/profile.png";
import filterIcon from "../../assets/filter.png"; // dein Filter-Icon
import Popup from "../Popup/Popup";
import { subscribeToPush } from "../../api/push";

export default function Home() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Suche
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter-Menü
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all | done | notDone
  const [sortType, setSortType] = useState("newest"); // newest | oldest

  // 🔒 Nur eingeloggte Nutzer
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    loadProjects();
  }, []);

  //  Projekte laden
  async function loadProjects() {
    try {
      const { data } = await api.get("/projects");
      setProjects(data.projects || []);
    } catch (e) {
      console.error(e);
      if (e.response?.status === 401) navigate("/");
    }
  }

  //  Projekt erstellen
  async function handleAddProject() {
    if (!newProjectName.trim()) {
      alert("Bitte Projektnamen eingeben.");
      return;
    }
    try {
      const { data } = await api.post("/projects", { name: newProjectName });
      setProjects([...projects, data.project]);
      setNewProjectName("");
    } catch (e) {
      console.error(e);
      alert("Fehler beim Erstellen des Projekts.");
    }
  }

  //  Projekt löschen
  async function handleDeleteProject(id) {
    if (!window.confirm("Projekt wirklich löschen?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (e) {
      console.error(e);
      alert("Löschen fehlgeschlagen");
    }
  }

  //  Todos öffnen
  function handleOpenTodos(id) {
    navigate(`/todos?id=${id}`);
  }

  //  Teilen
  async function handleSend() {
    try {
      await api.post(`/projects/${selectedProjectId}/collaborators`, {
        email: shareEmail,
      });
      alert("Projekt erfolgreich geteilt!");
      setShareEmail("");
      setShowPopup(false);
    } catch (e) {
      alert(e?.response?.data?.error?.message || "Teilen fehlgeschlagen.");
    }
  }

  // 🔎 Projekte nach Suche + Filter + Sortierung
  const visibleProjects = projects
    .filter((project) => {
      const name = (project.name || "").toLowerCase();
      const term = searchTerm.trim().toLowerCase();

      // Suche
      const matchesSearch = term === "" || name.includes(term);

      // Task-Status
      const tasks = project.tasks || [];
      const hasTasks = tasks.length > 0;
      const allDone = hasTasks && tasks.every((t) => t.completed);
      const hasNotDone = tasks.some((t) => !t.completed);

      // Filter-Typ
      if (filterType === "done" && !allDone) return false; // nur Projekte, bei denen ALLE Tasks completed sind
      if (filterType === "notDone" && !hasNotDone) return false; // Projekte mit mind. 1 offenem Task

      return matchesSearch;
    })
    .sort((a, b) => {
      // Sortierung nach createdAt
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortType === "newest") {
        // Neu → Alt
        return dateB - dateA;
      }
      if (sortType === "oldest") {
        // Alt → Neu
        return dateA - dateB;
      }
      return 0;
    });

  const sendTestPush = async () => {
    await api.post("/push/test");
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1 className="home-title">Simple ToDo</h1>

        <div className="header-icons">
          {/* Filter-Icon öffnet Menü */}
          <img
            src={filterIcon}
            alt="Filter"
            className="icon-btn"
            title="Filter & Sortierung"
            onClick={() => setFilterMenuOpen((prev) => !prev)}
          />

          {/* Such-Icon */}
          <span
            className="icon-btn"
            title="Projekte suchen"
            onClick={() => setSearchOpen((prev) => !prev)}
          >
            🔍
          </span>

          {/* „Benachrichtigungen“ Dummy */}
          <span>🔔</span>

          {/* Profil */}
          <img
            src={profileIcon}
            alt="Profil"
            className="icon-btn"
            onClick={() => navigate("/profile")}
          />
          <button onClick={subscribeToPush}> Push aktivieren </button>
          <button onClick={sendTestPush}> Test-Push senden </button>
        </div>
      </header>

      {/* Filter-Menü */}
      {filterMenuOpen && (
        <div className="filter-menu">
          <p className="filter-title">Filter</p>
          <button
            className={
              filterType === "all" ? "filter-btn active" : "filter-btn"
            }
            onClick={() => setFilterType("all")}
          >
            Alle Projekte
          </button>
          <button
            className={
              filterType === "done" ? "filter-btn active" : "filter-btn"
            }
            onClick={() => setFilterType("done")}
          >
            Gemachte Projekte
          </button>
          <button
            className={
              filterType === "notDone" ? "filter-btn active" : "filter-btn"
            }
            onClick={() => setFilterType("notDone")}
          >
            Nicht gemachte Projekte
          </button>

          <p className="filter-title">Sortieren</p>
          <button
            className={
              sortType === "newest" ? "filter-btn active" : "filter-btn"
            }
            onClick={() => setSortType("newest")}
          >
            Neu → Alt
          </button>
          <button
            className={
              sortType === "oldest" ? "filter-btn active" : "filter-btn"
            }
            onClick={() => setSortType("oldest")}
          >
            Alt → Neu
          </button>
        </div>
      )}

      {/* Suchfeld */}
      {searchOpen && (
        <div className="home-searchbar">
          <input
            type="text"
            placeholder="Projekt suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Inhalt */}
      <div className="home-content">
        {/* Projekt erstellen */}
        <div className="todo-create">
          <h3>Neue ToDo-Liste:</h3>
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
          <h3>Deine Projekte:</h3>
          {visibleProjects.length === 0 && <p>Keine Projekte gefunden.</p>}

          {visibleProjects.map((project) => (
            <div
              key={project._id}
              className="todo-box"
              onClick={() => handleOpenTodos(project._id)}
            >
              <div className="todo-box-content">
                <div>
                  <p className="todo-title">{project.name}</p>
                  <p className="todo-subtext">
                    {project.tasks?.length || 0} Aufgaben
                  </p>
                </div>
                <div className="todo-icons">
                  <img
                    src={shareIcon}
                    alt="Teilen"
                    className="icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProjectId(project._id);
                      setShowPopup(true);
                    }}
                  />
                  <img
                    src={deleteIcon}
                    alt="Löschen"
                    className="icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project._id);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {showPopup && (
            <Popup
              title="Projekt teilen"
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
