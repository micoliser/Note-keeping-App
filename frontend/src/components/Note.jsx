import React, { useState } from "react";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

function Note(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedNote, setUpdate] = useState({
    title: props.title,
    content: props.content,
  });

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
      .put("http://localhost:5000/notes/" + title, updatedNote)
      .then((res) => {
        console.log(res);
      });

    stopEdit();
  }

  function deleteNote(title) {
    axios.delete("http://localhost:5000/notes/" + title).then((res) => {
      console.log(res);
    });
  }

  return isEditing ? (
    <form className="note">
      <p style={{ fontSize: "0.9rem" }}>Editing note: '{props.title}'</p>
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
          return updateNote(e, props.title);
        }}
      >
        Update
      </button>
      <button onClick={stopEdit}>Go back</button>
    </form>
  ) : (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={startEdit}>
        <EditIcon />
      </button>
      <button
        onClick={() => {
          return deleteNote(props.title);
        }}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;
