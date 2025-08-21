import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import { toast } from "react-hot-toast";
import axios from "axios";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import DeleteButton from "../components/Delete";

function Home({ searchedNote, search }) {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  const url = `${process.env.REACT_APP_API_URL}/notes`;
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (typeof res.data === "string") {
          setNotes([]);
        } else {
          setNotes(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleAddChange(event) {
    const { name, value } = event.target;
    setNote((previousNote) => {
      return {
        ...previousNote,
        [name]: value,
      };
    });
  }

  function addNote(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .post(url, note, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Note added successfully");
        setNotes((prevNotes) => [note, ...prevNotes]);
        setNote({ title: "", content: "" });
      })
      .catch((err) => {
        toast.error(
          "Failed to add note: " + (err.response?.data || err.message)
        );
      });
  }
  return (
    <>
      <CreateArea change={handleAddChange} add={addNote} value={note} />
      {notes.length === 0 ? (
        <div className="no-notes">
          <p>No available notes</p>
        </div>
      ) : search ? (
        notes
          .filter(({ title }) => {
            return title.toLowerCase().includes(searchedNote.toLowerCase());
          })
          .map(({ title: noteTitle, content: noteContent }, index) => {
            return (
              <Note
                key={index}
                title={noteTitle}
                content={noteContent}
                setNotes={setNotes}
              />
            );
          })
      ) : (
        notes.map(({ title: noteTitle, content: noteContent }, index) => {
          return (
            <Note
              key={index}
              title={noteTitle}
              content={noteContent}
              setNotes={setNotes}
            />
          );
        })
      )}

      {notes.length !== 0 && <DeleteButton setNotes={setNotes} />}
    </>
  );
}

export default Home;
