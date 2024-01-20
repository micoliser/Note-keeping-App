import React from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import { useState } from "react";

function CreateArea(props) {
  const [isExpanded, setExpanded] = useState(false);
  function expand() {
    setExpanded(true);
  }
  return (
    <div>
      <form className="create-note">
        {isExpanded && (
          <input
            onChange={(e) => {
              return props.change(e);
            }}
            value={props.value.title}
            name="title"
            placeholder="Title"
          />
        )}

        <textarea
          onChange={(e) => {
            return props.change(e);
          }}
          onClick={expand}
          value={props.value.content}
          name="content"
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
        />
        <Zoom in={isExpanded}>
          <Fab>
            <AddIcon
              onClick={(e) => {
                return props.add(e);
              }}
            />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
