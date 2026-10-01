const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());


// ========================================
// DEMO POSTS
// ========================================

let posts = [
    {
        id: 1,
        title: "Welcome to RoleGuard",
        content: "This is the first post in the JWT role-based application.",
        author: "Admin"
    },
    {
        id: 2,
        title: "Viewer Access",
        content: "Viewers can read posts but cannot edit or delete them.",
        author: "Admin"
    }
];


// ========================================
// LOGIN
// ========================================

app.post("/api/login", (req, res) => {

    const { username, role } = req.body;

    if (!username || username.trim() === "") {

        return res.status(400).json({
            message: "Username is required"
        });
    }

    if (role !== "ADMIN" && role !== "VIEWER") {

        return res.status(400).json({
            message: "Invalid role"
        });
    }

    const token = jwt.sign(
        {
            username: username,
            role: role
        },
        JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    res.json({
        message: "Login successful",
        token: token,
        user: {
            username: username,
            role: role
        }
    });
});


// ========================================
// JWT MIDDLEWARE
// ========================================

function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}


// ========================================
// GET ALL POSTS
// ADMIN + VIEWER
// ========================================

app.get(
    "/api/posts",
    verifyToken,
    (req, res) => {

        res.json(posts);
    }
);


// ========================================
// ADD POST
// ADMIN ONLY
// ========================================

app.post(
    "/api/posts",
    verifyToken,
    (req, res) => {

        if (req.user.role !== "ADMIN") {

            return res.status(403).json({
                message: "Only Admin can add posts"
            });
        }

        const { title, content } = req.body;

        if (!title || !content) {

            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const newPost = {

            id:
                posts.length > 0
                    ? Math.max(...posts.map(post => post.id)) + 1
                    : 1,

            title: title,

            content: content,

            author: req.user.username
        };

        posts.push(newPost);

        res.status(201).json({
            message: "Post added successfully",
            post: newPost
        });
    }
);


// ========================================
// EDIT POST
// ADMIN ONLY
// ========================================

app.put(
    "/api/posts/:id",
    verifyToken,
    (req, res) => {

        if (req.user.role !== "ADMIN") {

            return res.status(403).json({
                message: "Only Admin can edit posts"
            });
        }

        const postId = Number(req.params.id);

        const { title, content } = req.body;

        const post = posts.find(
            post => post.id === postId
        );

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (!title || !content) {

            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        post.title = title;

        post.content = content;

        res.json({
            message: "Post updated successfully",
            post: post
        });
    }
);


// ========================================
// DELETE POST
// ADMIN ONLY
// ========================================

app.delete(
    "/api/posts/:id",
    verifyToken,
    (req, res) => {

        if (req.user.role !== "ADMIN") {

            return res.status(403).json({
                message: "Only Admin can delete posts"
            });
        }

        const postId = Number(req.params.id);

        const postExists = posts.some(
            post => post.id === postId
        );

        if (!postExists) {

            return res.status(404).json({
                message: "Post not found"
            });
        }

        posts = posts.filter(
            post => post.id !== postId
        );

        res.json({
            message: "Post deleted successfully"
        });
    }
);


// ========================================
// PROTECTED PROFILE
// ========================================

app.get(
    "/api/profile",
    verifyToken,
    (req, res) => {

        res.json({
            message: "Protected data accessed successfully",
            user: req.user
        });
    }
);


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log(
        `Backend running on http://localhost:${PORT}`
    );

});