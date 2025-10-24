import "./Home.css";
import shareIcon from "../../assets/share.png";
import deleteIcon from "../../assets/delete.png";

export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Simple ToDo</h1>
        <div className="header-icons">
          <span>🔍</span>
          <span>🔔</span>
          <span>👤</span>
        </div>
      </header>
      <div className="home-content">
        <div className="todo-create">
          <h3>Neue ToDo erstellen:</h3>
          <input type="text" placeholder="Name" className="todo-input" />
          <button className="add-button">Erstellen</button>
        </div>

        <div className="todo-lists">
          <h3>ToDo-Listen:</h3>

          <div className="todo-box">
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
          <div className="todo-box">
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
          <div className="todo-box">
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
