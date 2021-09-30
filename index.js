const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const rootPath = require("./routes/rootPath");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const router = express.Router();
const path = require("path");
const cors = require('cors');
const bodyParser = require("body-parser");
dotenv.config();
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
// app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
// app.use('/uploads', express.static('uploads'));
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));
app.use(fileUpload());
app.use(rootPath);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.listen(4000, () => {
  console.log("Backend server is running!");
});
