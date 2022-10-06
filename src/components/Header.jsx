import React from "react";
import HighlightIcon from "@material-ui/icons/Highlight";

function Header(props) {
  return (
    <header>
      <h1>
        <HighlightIcon />
        Keeper
      </h1>
      <div className="search">
        <input
          onChange={(e) => {
            return props.change(e);
          }}
          type="text"
          name="search"
          value={props.value}
          placeholder="Search notes with title"
        ></input>
        <button>Search</button>
      </div>
    </header>
  );
}

export default Header;
