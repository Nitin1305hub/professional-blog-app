const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Authentication Middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }

  res.redirect("/login");
}

// Ownership Middleware
async function isPostOwner(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.redirect("/");
    }

    if (post.user.toString() !== req.session.user.id) {
      return res.send("Access Denied");
    }

    next();
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
}

// Home Page
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render("index", { posts });
  } catch (error) {
    console.log(error);
    res.send("Error loading posts");
  }
});

// Create Post Page
router.get("/posts/new", isAuthenticated, (req, res) => {
  res.render("new");
});

// Save Blog Post
router.post("/posts", isAuthenticated, async (req, res) => {
  try {
    const { title, author, category, content } = req.body;

    await Post.create({
      title,
      author,
      category,
      content,
      user: req.session.user.id,
    });

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send("Error Creating Post");
  }
});

// Single Post Page
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.redirect("/");
    }

    res.render("show", { post });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Edit Page
router.get(
  "/posts/edit/:id",
  isAuthenticated,
  isPostOwner,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("edit", { post });
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  }
);

// Update Post
router.put(
  "/posts/:id",
  isAuthenticated,
  isPostOwner,
  async (req, res) => {
    try {
      const { title, author, category, content } = req.body;

      await Post.findByIdAndUpdate(req.params.id, {
        title,
        author,
        category,
        content,
      });

      res.redirect(`/posts/${req.params.id}`);
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  }
);

// Delete Post
router.delete(
  "/posts/:id",
  isAuthenticated,
  isPostOwner,
  async (req, res) => {
    try {
      await Post.findByIdAndDelete(req.params.id);
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  }
);

module.exports = router;