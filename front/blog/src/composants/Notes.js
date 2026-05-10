import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import NoteForm from "./NoteForm";
import NoteList from "./NoteList";
import "../styles.css";

// Composant pour afficher les notifications (succès/erreur)
function Toast({ message, type, onClose }) {
    useEffect(() => {
        // Fermer automatiquement après 4 secondes
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === "success" ? "#4CAF50" : "#f44336";

    return (
        <div
            style={{
                position: "fixed",
                top: 20,
                right: 20,
                backgroundColor: bgColor,
                color: "white",
                padding: "15px 20px",
                borderRadius: "4px",
                zIndex: 1000,
                animation: "slideIn 0.3s ease-in-out",
            }}
        >
            {message}
        </div>
    );
}

export default function Notes() {
    // ===== ÉTAT =====
    const [notes, setNotes] = useState([]); // Liste des notes
    const [filter, setFilter] = useState("all"); // Filtre par priorité
    const [search, setSearch] = useState(""); // Recherche
    const [error, setError] = useState(""); // Message d'erreur
    const [loading, setLoading] = useState(true); // En train de charger?
    const [editingNote, setEditingNote] = useState(null); // Note en édition
    const [toast, setToast] = useState(null); // Notification
    
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // ===== REDIRECTION SI NON CONNECTÉ =====
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    // ===== RÉCUPÉRER LES NOTES DE L'API =====
    const fetchNotes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get("/notes");
            setNotes(response.data);
            setError("");
        } catch (err) {
            console.error(err);

            // Si non autorisé, renvoyer à la connexion
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError("Impossible de charger les notes");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // Charger les notes au montage
    useEffect(() => {
        if (token) fetchNotes();
    }, [token, fetchNotes]);

    // ===== CRÉER/MODIFIER UNE NOTE =====
    const handleNoteAdded = (success, message) => {
        if (success) {
            setToast({ message, type: "success" });
            fetchNotes(); // Recharger la liste
        } else {
            setToast({ message, type: "error" });
        }
    };

    // ===== SUPPRIMER UNE NOTE =====
    const deleteNote = async (id) => {
        // Demander confirmation
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette note?");
        if (!confirmed) return;

        try {
            await api.delete(`/notes/${id}`);
            setToast({ message: "Note supprimée avec succès", type: "success" });
            fetchNotes();
        } catch (err) {
            console.error(err);

            // Gérer les erreurs
            if (err.response?.status === 404) {
                setToast({ message: "Note non trouvée", type: "error" });
            } else if (err.response?.status === 401) {
                setToast({ message: "Non autorisé", type: "error" });
                localStorage.removeItem("token");
                navigate("/login");
            } else if (err.response?.status === 422) {
                setToast({ message: "La note n'a pas pu être supprimée : erreur de validation", type: "error" });
            } else {
                setToast({ message: "Erreur lors de la suppression", type: "error" });
            }

            fetchNotes();
        }
    };

    // ===== ÉDITER UNE NOTE =====
    const handleEditNote = (note) => {
        setEditingNote(note);
        // Scroller vers le haut pour voir le formulaire
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ===== SE DÉCONNECTER =====
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // ===== EXPORTER LES NOTES =====
    const exportNotes = (format) => {
        let content, type, filename;

        if (format === "json") {
            // Exporter en JSON
            content = JSON.stringify(notes, null, 2);
            type = "application/json";
            filename = "json";
        } else {
            // Exporter en CSV (pour Excel)
            const headers = ["Titre", "Contenu", "Priorité", "Date"];
            const rows = notes.map((note) => [
                `"${note.title.replace(/"/g, '""')}"`,
                `"${(note.content || "").replace(/"/g, '""')}"`,
                note.priority,
                new Date(note.created_at).toLocaleDateString(),
            ]);
            content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
            type = "text/csv";
            filename = "csv";
        }

        // Créer et télécharger le fichier
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `notes-${new Date().toISOString().split("T")[0]}.${filename}`;
        link.click();
        URL.revokeObjectURL(url);
        
        setToast({ message: `Exporté en ${filename.toUpperCase()}`, type: "success" });
    };

    // ===== AFFICHAGE EN CHARGEMENT =====
    if (loading) {
        return (
            <div className="app-container" style={{ textAlign: "center", marginTop: 50 }}>
                <h2>⏳ Chargement des notes...</h2>
            </div>
        );
    }

    // ===== INTERFACE PRINCIPALE =====
    return (
        <div className="app-container">
            {/* En-tête avec nombre de notes et bouton déconnexion */}
            <div className="navbar">
                <h2>📝 Mes Notes ({notes.length})</h2>
                <button className="btn btn-danger" onClick={logout}>
                    🚪 Déconnexion
                </button>
            </div>

            {/* Notification (toast) */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Message d'erreur général */}
            {error && (
                <div style={{ backgroundColor: "#fff3cd", color: "#856404", padding: 12, borderRadius: 4, marginBottom: 20 }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Formulaire pour ajouter/modifier une note */}
            <NoteForm
                onNoteAdded={handleNoteAdded}
                editingNote={editingNote}
                onEditingChange={setEditingNote}
            />

            {/* Recherche, filtrage et export */}
            <div className="card card-section">
                <div className="search-filter-row">
                    {/* Barre de recherche */}
                    <div>
                        <label className="form-label">
                            🔍 Chercher
                        </label>
                        <input
                            type="text"
                            placeholder="Chercher par titre ou contenu..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value.toLowerCase())}
                        />
                    </div>

                    {/* Filtre par priorité */}
                    <div>
                        <label className="form-label">
                            Filtre
                        </label>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">Toutes les priorités</option>
                            <option value="high">🔴 Haute</option>
                            <option value="medium">🟡 Moyenne</option>
                            <option value="low">🟢 Basse</option>
                        </select>
                        <div className="filter-button-group">
                            {[
                                { key: "all", label: "Toutes" },
                                { key: "high", label: "Haute" },
                                { key: "medium", label: "Moyenne" },
                                { key: "low", label: "Basse" },
                            ].map((option) => (
                                <button
                                    key={option.key}
                                    type="button"
                                    className={option.key === filter ? "btn btn-primary" : "btn btn-logout"}
                                    onClick={() => setFilter(option.key)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Boutons d'export */}
                    <div className="action-buttons">
                        <button onClick={() => exportNotes("json")} className="btn btn-primary">
                            📥 JSON
                        </button>
                        <button onClick={() => exportNotes("csv")} className="btn btn-primary">
                            📊 CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Liste des notes */}
            <NoteList
                notes={notes}
                deleteNote={deleteNote}
                onEditNote={handleEditNote}
                filter={filter}
                search={search}
            />
        </div>
    );
}