import "./Home.css";
import { useNavigate } from "react-router-dom";
import shareIcon from "../../assets/share.png";
import deleteIcon from "../../assets/delete.png";
import profileIcon from "../../assets/profile.png";

export default function Home() {
  const navigate = useNavigate();

  const handleOpenTodos = () => {
    navigate("/todos");
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
          <input type="text" placeholder="Name" className="todo-input" />
          <button className="add-button">Erstellen</button>
        </div>

        {/* ToDo Listen */}
        <div className="todo-lists">
          <h3>ToDo-Listen:</h3>

          {/* ToDo Box 1 */}
          <div className="todo-box" onClick={handleOpenTodos}>
            <div className="todo-box-content">
              <div>
                <p className="todo-title">Schule</p>
                <p className="todo-subtext">5 Aufgaben</p>
              </div>
              <div className="todo-icons">
                <img src={shareIcon} alt="Teilen" className="icon-btn" />
                <img src={deleteIcon} alt="Löschen" className="icon-btn" />
              </div>
            </div>
          </div>

          {/* ToDo Box 2 */}
          <div className="todo-box" onClick={handleOpenTodos}>
            <div className="todo-box-content">
              <div>
                <p className="todo-title">Einkaufen</p>
                <p className="todo-subtext">3 Aufgaben</p>
              </div>
              <div className="todo-icons">
                <img src={shareIcon} alt="Teilen" className="icon-btn" />
                <img src={deleteIcon} alt="Löschen" className="icon-btn" />
              </div>
            </div>
          </div>

          {/* ToDo Box 3 */}
          <div className="todo-box" onClick={handleOpenTodos}>
            <div className="todo-box-content">
              <div>
                <p className="todo-title">Sport</p>
                <p className="todo-subtext">2 Aufgaben</p>
              </div>
              <div className="todo-icons">
                <img src={shareIcon} alt="Teilen" className="icon-btn" />
                <img src={deleteIcon} alt="Löschen" className="icon-btn" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
