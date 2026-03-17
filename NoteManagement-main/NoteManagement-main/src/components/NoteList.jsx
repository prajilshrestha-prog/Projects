
export const NoteList = ({ notes }) => {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <div key={note.id} className="note-item">
              <p className="note-timestamp"> {note.createdAt}</p>
          <p>{note.text}</p>
      
        </div>
      ))}
    </div>
  );
};