import { useState, useEffect } from "react";
import api from "../services/api";
import "../styles.css";

export default function NoteForm({ onNoteAdded, editingNote, onEditingChange }) {
    // Form state - stocke les valeurs du formulaire
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [priority, setPriority] = useState("low");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Remplir le formulaire si on édite une note existante
    useEffect(() => {
        if (editingNote) {
            setTitle(editingNote.title || "");
            setContent(editingNote.content || "");
            setPriority(editingNote.priority || "low");
        } else {
            resetForm();
        }
    }, [editingNote]);

    // Vider le formulaire
    const resetForm = () => {
        setTitle("");
        setContent("");
        setPriority("low");
        setError("");
    };

    // Valider et envoyer la note
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Le titre est obligatoire
        if (!title.trim()) {
            setError("Le titre est obligatoire");
            return;
        }

        // Le titre ne doit pas dépasser 100 caractères
        if (title.trim().length > 100) {
            setError("Le titre ne doit pas dépasser 100 caractères");
            return;
        }

        try {
            setLoading(true);

            if (editingNote) {
                // Modifier une note existante
                await api.put(`/notes/${editingNote.id}`, {
                    title: title.trim(),
                    content: content.trim(),
                    priority,
                });
                onNoteAdded(true, "Note modifiée avec succès");
            } else {
                // Créer une nouvelle note
                await api.post("/notes", {
                    title: title.trim(),
                    content: content.trim(),
                    priority,
                });
                onNoteAdded(true, "Note créée avec succès");
            }

            // Réinitialiser le formulaire
            resetForm();
            onEditingChange(null);
        } catch (err) {
            console.error(err);
            let message = "Erreur lors de la sauvegarde";

            if (err.response?.status === 422) {
                const errors = err.response?.data?.errors;
                message = errors
                    ? Object.values(errors).flat()[0]
                    : err.response?.data?.message || message;
            } else if (err.response?.status === 401) {
                message = "Non autorisé";
            } else {
                message = err.response?.data?.message || message;
            }

            setError(message);
            onNoteAdded(false, message);
        } finally {
            setLoading(false);
        }
    };

    // Annuler l'édition
    const handleCancel = () => {
        resetForm();
        onEditingChange(null);
    };

    // Afficher le formulaire
    const isEditing = editingNote !== null;
    const buttonText = loading ? "Enregistrement..." : isEditing ? "📝 Modifier" : "➕ Ajouter";

    return (
        <div className="card">
            <form onSubmit={handleSubmit}>
                <h3>{isEditing ? "📝 Modifier la note" : "➕ Ajouter une nouvelle note"}</h3>

                {/* Titre et priorité */}
                <div className="note-form-row">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                        placeholder="Titre de la note (max 100 caractères)"
                        maxLength="100"
                    />

                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="low">Basse priorité</option>
                        <option value="medium">Priorité moyenne</option>
                        <option value="high">Haute priorité</option>
                    </select>

                    <button type="submit" className="btn btn-primary" disabled={loading || !title.trim()}>
                        {buttonText}
                    </button>

                    {isEditing && (
                        <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={loading}>
                            ❌ Annuler
                        </button>
                    )}
                </div>

                {/* Contenu */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Contenu de la note (optionnel)"
                    rows={4}
                    className="note-textarea"
                />

                {/* Messages d'erreur */}
                {error && <p style={{ color: "red", marginTop: 10 }}>⚠️ {error}</p>}

                {/* Compteur de caractères */}
                {title.length > 0 && (
                    <small style={{ color: "#666", marginTop: 8, display: "block" }}>
                        {title.length}/100 caractères
                    </small>
                )}
            </form>
        </div>
    );
}