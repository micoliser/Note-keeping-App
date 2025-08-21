import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function DeleteButton() {
  const [deleting, setDelete] = useState(false);

  function handleDelete() {
    setDelete(true);
  }

  function backFromDelete() {
    setDelete(false);
  }

  function deleteAllNotes() {
    const token = localStorage.getItem("token");
    axios
      .delete(`${process.env.REACT_APP_API_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("All notes deleted successfully.");
      })
      .catch((err) => {
        toast.error("Failed to delete notes.");
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
