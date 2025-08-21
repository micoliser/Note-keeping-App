import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

function Note({ title, content, setNotes }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedNote, setUpdate] = useState({
    title: title,
    content: content,
  });
  const token = localStorage.getItem("token");

  function startEdit() {
    setIsEditing(true);
  }

  function stopEdit() {
    setIsEditing(false);
  }

  function handleUpdateChange(event) {
    const { name, value } = event.target;
    setUpdate((previousNote) => {
      return {
        ...previousNote,
        [name]: value,
      };
    });
  }

  function updateNote(event, title) {
    event.preventDefault();

    axios
      .put(`${process.env.REACT_APP_API_URL}/notes/` + title, updatedNote, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("Note updated successfully.");
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.title === title ? { ...note, ...updatedNote } : note
          )
        );
      })
      .catch((err) => {
        toast.error("Failed to update note. Please try again.");
      });

    stopEdit();
  }

  function deleteNote(title) {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/notes/` + title, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("Note deleted successfully.");
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note.title !== title)
        );
      })
      .catch((err) => {
        toast.error("Failed to delete note. Please try again.");
      });
  }

  return isEditing ? (
    <form className="note">
      <p style={{ fontSize: "0.9rem" }}>Editing note: '{title}'</p>
      <input
        name="title"
        onChange={handleUpdateChange}
        value={updatedNote.title}
      />
      <textarea
        onChange={handleUpdateChange}
        name="content"
        value={updatedNote.content}
      ></textarea>
      <button
        onClick={(e) => {
          return updateNote(e, title);
        }}
      >
        Update
      </button>
      <button onClick={stopEdit}>Go back</button>
    </form>
  ) : (
    <div className="note">
      <h1>{title}</h1>
      <p>{content}</p>
      <button onClick={startEdit}>
        <EditIcon />
      </button>
      <button
        onClick={() => {
          return deleteNote(title);
        }}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;
