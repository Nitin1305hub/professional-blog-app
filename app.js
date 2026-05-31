const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
require("dotenv").config();

const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

// Make user available in all EJS files
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// EJS setup
app.set("view engine", "ejs");

// Routes
app.use("/", postRoutes);
app.use("/", authRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});