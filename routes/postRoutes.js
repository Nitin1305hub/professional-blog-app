const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image buffer to Cloudinary
function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "devblog_posts" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
}

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

// Home Page with Search and Category Filter
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });

    res.render("index", {
      posts,
      search,
      category,
    });
  } catch (error) {
    console.log(error);
    res.send("Error loading posts");
  }
});

// Create Post Page
router.get("/posts/new", isAuthenticated, (req, res) => {
  res.render("new");
});

// Save Blog Post with Image Upload
router.post(
  "/posts",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, author, category, content } = req.body;

      let imageUrl = "";
      let imagePublicId = "";

      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      }

      await Post.create({
        title,
        author,
        category,
        content,
        imageUrl,
        imagePublicId,
        user: req.session.user.id,
      });

      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.send("Error Creating Post");
    }
  }
);
// User Profile Page
router.get("/profile/:id", async (req, res) => {
  try {
    const profileUser = await User.findById(req.params.id);

    if (!profileUser) {
      return res.redirect("/");
    }

    const posts = await Post.find({ user: req.params.id }).sort({
      createdAt: -1,
    });

    res.render("profile", {
      profileUser,
      posts,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
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

// Add Comment
router.post("/posts/:id/comments", isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.redirect("/");
    }

    post.comments.push({
      text: req.body.comment,
      user: req.session.user.id,
      username: req.session.user.username,
    });

    await post.save();

    res.redirect(`/posts/${req.params.id}`);
  } catch (error) {
    console.log(error);
    res.send("Error adding comment");
  }
});

// Like / Unlike Post
router.post("/posts/:id/like", isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.redirect("/");
    }

    const userId = req.session.user.id;

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.redirect(`/posts/${req.params.id}`);
  } catch (error) {
    console.log(error);
    res.send("Error liking post");
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