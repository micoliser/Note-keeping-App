import React, { useState } from "react";
import axios from "axios";

function DeleteButton() {
  const [deleting, setDelete] = useState(false);

  function handleDelete() {
    setDelete(true);
  }

  function backFromDelete() {
    setDelete(false);
  }

  function deleteAllNotes() {
    axios.delete("http://localhost:5000/notes").then((res) => {
      console.log(res);
    });

    backFromDelete();
  }

  return deleting ? (
    <div className="delete">
      <p>Are you sure you want to delete all notes? action cannot be undone</p>
      <button onClick={deleteAllNotes}>Yes, Delete</button>
      <button onClick={backFromDelete}>No, Go back</button>
    </div>
  ) : (
    <button className="delete-all" onClick={handleDelete}>
      Delete all notes
    </button>
  );
}

export default DeleteButton;
