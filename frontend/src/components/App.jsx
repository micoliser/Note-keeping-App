import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "../pages/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

function App() {
  const [search, setSearch] = useState(false);
  const [searchedNote, setSearchedNote] = useState("");

  function handleSearchChange(event) {
    setSearch(true);
    const { value } = event.target;
    setSearchedNote(value);
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                handleSearchChange={handleSearchChange}
                searchedNote={searchedNote}
              />
            }
          >
            <Route
              index
              element={<Home searchedNote={searchedNote} search={search} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
