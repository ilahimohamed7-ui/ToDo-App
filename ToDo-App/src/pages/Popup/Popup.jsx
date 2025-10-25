import "./Popup.css";

export default function Popup({ title, onClose, onSend, value, setValue }) {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>{title}</h2>
          <button className="popup-close" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="popup-body">
          <input
            type="email"
            placeholder="E-Mail-Adresse des Empfängers "
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="popup-input"
          />
        </div>
        <div className="popup-footer">
          <button className="popup-send" onClick={onSend}>
            Senden
          </button>
        </div>
      </div>
    </div>
  );
}
