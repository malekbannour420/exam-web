import NoteItem from "./NoteItem";
import "../styles.css";

export default function NoteList({ notes, deleteNote, onEditNote, filter, search = "" }) {
    // Trier les notes par date de création décroissante
    const sortedNotes = [...notes].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Filtrer les notes selon la priorité et la recherche
    const filteredNotes = sortedNotes.filter((note) => {
        const matchesPriority = filter === "all" || note.priority === filter;
        const matchesSearch = 
            search === "" ||
            note.title.toLowerCase().includes(search) ||
            (note.content && note.content.toLowerCase().includes(search));
        return matchesPriority && matchesSearch;
    });

    // Afficher la liste des notes
    return (
        <div className="notes-list">
            {filteredNotes.length === 0 ? (
                // Aucune note trouvée
                <div className="empty-state">
                    <h3>Aucune note trouvée 😴</h3>
                    <p>{search ? "Essayez d'ajuster votre recherche." : "Créez votre première note ou changez le filtre."}</p>
                </div>
            ) : (
                // Afficher chaque note
                filteredNotes.map((note) => (
                    <NoteItem
                        key={note.id}
                        note={note}
                        deleteNote={deleteNote}
                        onEditNote={onEditNote}
                    />
                ))
            )}
        </div>
    );
}