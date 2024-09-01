const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
dotenv.config();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const empRoutess = require("./routes/employeeRoutes");
const multer = require("multer");
app.use(express.json());
app.use(
  cors({
    "Access-Control-Allow-Origin": "http://localhost:3000",
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.error(`Failed to Connect - ${error}`);
  });

mongoose.connection.on("error", (err) => console.error(err));
mongoose.connection.on("disconnected", () =>
  console.log("Mongo DB disconnected")
);
// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Save file with a unique name
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(
        new Error("Only .png, .jpg, and .jpeg formats are allowed!"),
        false
      );
    }
    cb(null, true);
  },
});

app.use("/user", userRoutes);
app.use("/emp", empRoutess);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running at -> http://localhost:${PORT}`);
});
