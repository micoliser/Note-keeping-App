const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:3000",
  "https://notes.samueliwelumo.tech",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

mongoose.connect("mongodb://localhost:27017/noteDB");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send("User registered");
  } catch (err) {
    res.status(400).send("User already exists");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("Invalid credentials");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).send("Invalid credentials");
  const token = jwt.sign({ userId: user._id }, "SECRET_KEY");
  res.json({ token, user });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, "SECRET_KEY", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/notes", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  Note.find({ userId })
    .sort({ createdAt: -1 })
    .exec((err, foundNotes) => {
      if (!err) {
        if (foundNotes.length !== 0) {
          res.send(
            foundNotes.map((note) => {
              return { title: note.title, content: note.content };
            })
          );
        } else {
          res.send("Could not find any note now, add a note and try again");
        }
      }
    });
});

app.post("/notes", authenticateToken, (req, res) => {
  const noteTitle = req.body.title;
  const noteContent = req.body.content;
  const userId = req.user.userId;

  Note.findOne({ title: noteTitle, userId }, (err, foundNote) => {
    if (!err) {
      if (
        !foundNote &&
        noteTitle !== undefined &&
        /^\s*$/.test(noteTitle) !== true
      ) {
        const newNote = new Note({
          title: noteTitle,
          content: noteContent,
          userId: userId,
        });
        newNote.save((err) => {
          if (!err) {
            res.send("successfully added new note '" + noteTitle + "'");
          } else {
            res.send("Could not add a new note right now, try again later");
          }
        });
      } else {
        res
          .status(400)
          .send(
            "Could not add note with '" + noteTitle + "' or note already exists"
          );
      }
    }
  });
});

app.delete("/notes", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  Note.deleteMany({ userId }, (err) => {
    if (!err) {
      res.send("Successfully deleted all notes");
    }
  });
});

app.put("/notes/:noteTitle", authenticateToken, (req, res) => {
  const noteTitle = req.params.noteTitle;

  Note.updateOne(
    { title: noteTitle, userId: req.user.userId },
    { title: req.body.title, content: req.body.content },
    (err) => {
      if (!err) {
        res.send("Successfully updated '" + noteTitle + "'");
      }
    }
  );
});

app.delete("/notes/:noteTitle", authenticateToken, (req, res) => {
  const noteTitle = req.params.noteTitle;
  const userId = req.user.userId;

  Note.findOne({ title: noteTitle, userId }, (err, foundNote) => {
    if (!err) {
      if (foundNote) {
        Note.deleteOne({ title: noteTitle, userId }, (err) => {
          if (!err) {
            res.send("Successfully deleted note '" + noteTitle + "'");
          }
        });
      } else {
        res.send("No such note exists");
      }
    }
  });
});

app.listen(5000, () => {
  console.log("server started on port 5000");
});
