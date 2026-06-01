
# Professional Blog App

A full-stack blogging platform built using **Node.js**, **Express.js**, **MongoDB**, **EJS**, and **Cloudinary**. Users can create, manage, and interact with blog posts through a modern and responsive interface.

---

## Features

### Authentication & Authorization

* User Registration
* User Login
* User Logout
* Password Hashing using bcryptjs
* Session-Based Authentication
* Protected Routes
* Post Ownership Authorization

### Blog Management

* Create Blog Posts
* View Blog Posts
* Edit Blog Posts
* Delete Blog Posts
* Individual Post Pages

### Media Upload

* Image Upload using Cloudinary
* Secure Cloud Storage
* Image Preview on Home and Post Pages

### Social Features

* Comments System
* Like / Unlike Posts
* User Profile Page

### Search & Filter

* Search Posts by Title
* Search Posts by Author
* Search Posts by Content
* Category-Based Filtering

### User Profiles

* Profile Page for Every User
* Total Posts Count
* View All Posts Created by a User

### UI Features

* Responsive Design
* Modern Navigation Bar
* Blog Cards Layout
* Clean User Experience

---

## Tech Stack

### Frontend

* HTML
* CSS
* EJS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* Express Session
* bcryptjs

### File Upload

* Cloudinary
* Multer
* Streamifier

### Additional Packages

* Method Override
* Connect Mongo
* Dotenv

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/professional-blog-app.git
```

Move into the project folder:

```bash
cd professional-blog-app
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Running the Project

Start the application:

```bash
npm start
```

For development:

```bash
npm run dev
```

Application runs on:

```text
http://localhost:3000
```

---

## Project Structure

```text
professional-blog-app/
│
├── config/
│   └── cloudinary.js
│
├── models/
│   ├── Post.js
│   └── User.js
│
├── routes/
│   ├── authRoutes.js
│   └── postRoutes.js
│
├── views/
│   ├── index.ejs
│   ├── show.ejs
│   ├── new.ejs
│   ├── edit.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── profile.ejs
│
├── public/
│   └── css/
│       └── style.css
│
├── .env
├── app.js
├── package.json
├── README.md
│
└── node_modules/
```

---

## Core Functionalities

### User Authentication

Users can register and log in securely. Passwords are encrypted before being stored in MongoDB.

### Blog Post Management

Authenticated users can create posts. Only the creator of a post can edit or delete it.

### Image Upload

Users can upload images while creating posts. Images are stored on Cloudinary and displayed throughout the application.

### Comments

Users can comment on blog posts. Each comment stores the username and creation date.

### Likes

Users can like and unlike blog posts. Like counts are updated dynamically.

### Search and Category Filter

Users can quickly find relevant posts using keyword search and category filtering.

### User Profiles

Each user has a dedicated profile page displaying their information and all posts authored by them.

---

## Future Improvements

* Dashboard Analytics
* Bookmark Posts
* Edit Profile
* Profile Pictures
* Dark Mode
* Rich Text Editor
* Notifications
* Admin Panel

---

## Author

**Nitin Singh**

Full Stack Developer

GitHub: https://github.com/Nitin1305hub
