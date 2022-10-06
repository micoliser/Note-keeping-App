import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";
import CreateArea from "./CreateArea";
import DeleteButton from "./Delete";

function App() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({
    title: "",
    content: "",
  });
  const [search, setSearch] = useState(false);
  const [searchedNote, setSearchedNote] = useState("");

  const url = "http://localhost:5000/notes";

  useEffect(() => {
    axios
      .get(url)
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
  }, [notes]);

  function handleAddChange(event) {
    const { name, value } = event.target;
    setNote((previousNote) => {
      return {
        ...previousNote,
        [name]: value,
      };
    });
  }

  function handleSearchChange(event) {
    setSearch(true);
    const { value } = event.target;
    setSearchedNote(value);
  }

  function addNote(event) {
    event.preventDefault();

    axios
      .post(url, note)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setNote({ title: "", content: "" });
  }

  return (
    <div>
      <Header change={handleSearchChange} value={searchedNote} />
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
            return <Note key={index} title={noteTitle} content={noteContent} />;
          })
      ) : (
        notes.map(({ title: noteTitle, content: noteContent }, index) => {
          return <Note key={index} title={noteTitle} content={noteContent} />;
        })
      )}

      {notes.length !== 0 && <DeleteButton />}
      <Footer />
    </div>
  );
}

export default App;
