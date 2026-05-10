import "../styles.css";

export default function NoteItem({ note, deleteNote, onEditNote }) {
    // Formater la date en français
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Couleur selon la priorité
    const getPriorityColor = (priority) => {
        if (priority === "high") return "#ff6b6b"; // Rouge
        if (priority === "medium") return "#ffd93d"; // Jaune
        return "#6bcf7f"; // Vert
    };

    const color = getPriorityColor(note.priority);
    const priorityLabel = {
        high: "Haute",
        medium: "Moyenne",
        low: "Basse"
    }[note.priority];

    return (
        <div 
            className={`note-card ${note.priority}`}
            style={{ borderLeft: `4px solid ${color}` }}
        >
            {/* Titre et priorité */}
            <div className="note-item-header">
                <div>
                    <h3>{note.title}</h3>
                    <div className="note-item-meta">
                        <span 
                            style={{
                                backgroundColor: color,
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                            }}
                        >
                            {priorityLabel}
                        </span>
                        <small>
                            📅 {formatDate(note.created_at)}
                        </small>
                    </div>
                </div>
            </div>

            {/* Contenu */}
            {note.content && (
                <p className="note-content">
                    {note.content}
                </p>
            )}

            {/* Boutons */}
            <div className="note-card-actions">
                <button 
                    onClick={() => onEditNote(note)}
                    className="btn btn-primary note-action-btn"
                >
                    ✏️ Modifier
                </button>
                <button 
                    onClick={() => deleteNote(note.id)}
                    className="btn btn-danger note-action-btn"
                >
                    🗑️ Supprimer
                </button>
            </div>
        </div>
    );
}