const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    // const existUser = await User.findOne({ email: req.body.email });
    // existUser && res.status(400).json("This email user is already registered");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new user
    const newUser = new User({
      profilePicture: req.body.profilePicture || "",
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    console.log({newUser});
    //save user and respond
    const user = await newUser.save();
    res.status(200).json({...user?._doc, userId: user?._id});
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "This email user is already registered"
    })
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json({massage: "User not found", statusCode: 404});

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json({message: "Wrong password", statusCode: 404})
    console.log({user: user?._doc});
    res.status(200).json({...user?._doc, userId: user?._id})
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
