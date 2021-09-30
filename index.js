const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
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
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
// app.use('/uploads', express.static('uploads'));
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));
app.use(fileUpload());
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });

// const upload = multer({ storage: storage });
// // const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    console.log({file});
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || 
  file.mimetype === 'image/png' || 
  file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// const upload = multer({ dest: "upload/" });
const upload = multer({
  storage: storage
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  // fileFilter: fileFilter
});

app.post("/api/upload", (req, res) => {
  // const {file} = req.body;
  // const file = req?.files.file;
  console.log({req});
  // const filePath = `${__dirname}/uploads/${file.name}`;
  // file.mv(filePath, (err) => {
  //     if(err){
  //         console.log(err);
  //         res.status(500).send({msg: 'Failed to upload image'});
  //     }
  //     const newImg = fs.readFileSync(filePath);
  //     const encImg = newImg.toString('base64');
  //     const image = {
  //         contentType: file.mimetype,
  //         size: file.size,
  //         img: Buffer(encImg, 'base64')
  //     }
  //     console.log({image});
  //     res.status(200).json({msg: 'File uploaded successfully', image});
  // })
  // try {
  //   return res.status(200).json("File uploaded successfully");
  // } catch (error) {
  //   console.error(error);
  // }
});

app.use(rootPath);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(4000, () => {
  console.log("Backend server is running!");
});
