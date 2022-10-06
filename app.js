const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const cors = require('cors');
const corsOptions = {
    origin:'http://localhost:3000',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static("public"));

app.use(cors(corsOptions));

mongoose.connect("mongodb://localhost:27017/noteDB");

const noteSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Note = mongoose.model("Note", noteSchema);

app.get("/notes", (req, res) => {
  Note.find({}, (err, foundNotes) => {
    if (!err) {
      if (foundNotes.length !== 0) {
        res.send(foundNotes.map(note => {
          return {title: note.title, content: note.content}
        }));
      } else {
        res.send("Could not find any note now, add a note and try again");
      }
    }
  });
});

app.post("/notes", (req, res) => {
  const noteTitle = req.body.title;
  const noteContent = req.body.content;

  Note.findOne({title: noteTitle}, (err, foundNote) => {
    if (!err) {
      if (!foundNote && noteTitle !== undefined && /^\s*$/.test(noteTitle) !== true) {
        const newNote = new Note ({
          title: noteTitle,
          content: noteContent
        });
        newNote.save((err) => {
          if (!err) {
            res.send("successfully added new note '" + noteTitle + "'");
          } else {
            res.send("Could not add a new note right now, try again later");
          }
        });
      } else {
        res.send("Could not add note with '" + noteTitle + "' or note already exists");
      }
    }
  });
});

app.delete("/notes", (req, res) => {
  Note.deleteMany({}, (err) => {
    if (!err) {
      res.send("Successfully deleted all notes");
    }
  })
})

app.put("/notes/:noteTitle", (req, res) => {
  const noteTitle = req.params.noteTitle;

  Note.updateOne({title: noteTitle}, {title: req.body.title, content: req.body.content}, (err) => {
    if (!err) {
      res.send("Successfully updated '" + noteTitle + "'")
    }
  });
});

app.delete("/notes/:noteTitle", (req, res) => {

  const noteTitle = req.params.noteTitle;

  Note.findOne({title: noteTitle}, (err, foundNote) => {
    if (!err) {
      if (foundNote) {
        Note.deleteOne({title: noteTitle}, (err) => {
          if (!err) {
            res.send("Successfully deleted note '" + noteTitle +"'" )
          }
        })
      } else {
        res.send("No such note exists");
      }
    }
  })
})



app.listen(5000, () => {
  console.log("server started on port 5000");
});
