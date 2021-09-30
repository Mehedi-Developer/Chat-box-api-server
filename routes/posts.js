const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post by post id and userId

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json({message: err.message, statusCode: 500});
  }
});

//update a post by post id and userId

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json({message: "The post has been updated", statusCode: 200});
    } else {
      res.status(403).json({message: "You can update only your post", statusCode: 403});
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post by post id and userId

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json({message: "The post has been deleted", statusCode: 200});
    } else {
      res.status(403).json({message: "You can delete only your post", statusCode: 403});
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like / dislike a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json({message: "The post has been liked", statusCode: 200});
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({message: "The post has been disliked", statusCode: 200});
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post by post id

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts by userId

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const followingFriendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    const followerFriendPosts = await Promise.all(
      currentUser.followers.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...followingFriendPosts,...followerFriendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's all posts

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
