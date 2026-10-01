import { useEffect, useState } from "react";

function Dashboard({ user, onLogout }) {

    const isAdmin = user.role === "ADMIN";

    const token = localStorage.getItem("token");


    // ========================================
    // STATES
    // ========================================

    const [posts, setPosts] = useState([]);

    const [title, setTitle] = useState("");

    const [content, setContent] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(false);


    // ========================================
    // GET POSTS
    // ========================================

    const loadPosts = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/posts",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(data.message);

                return;
            }

            setPosts(data);

        } catch (error) {

            alert("Cannot connect to backend.");

        }
    };


    // ========================================
    // LOAD POSTS ON PAGE OPEN
    // ========================================

    useEffect(() => {

        loadPosts();

    }, []);


    // ========================================
    // CLEAR FORM
    // ========================================

    const clearForm = () => {

        setTitle("");

        setContent("");

        setEditingId(null);
    };


    // ========================================
    // ADD / UPDATE POST
    // ========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!title.trim() || !content.trim()) {

            alert("Please enter title and content.");

            return;
        }

        setLoading(true);


        try {

            const url = editingId
                ? `http://localhost:5000/api/posts/${editingId}`
                : "http://localhost:5000/api/posts";


            const method = editingId
                ? "PUT"
                : "POST";


            const response = await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        title: title,
                        content: content
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(data.message);

                return;
            }


            alert(data.message);

            clearForm();

            loadPosts();


        } catch (error) {

            alert(
                "Cannot connect to backend."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================
    // START EDITING
    // ========================================

    const handleEdit = (post) => {

        setEditingId(post.id);

        setTitle(post.title);

        setContent(post.content);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // ========================================
    // DELETE POST
    // ========================================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );


        if (!confirmed) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/posts/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(data.message);

                return;
            }


            alert(data.message);

            loadPosts();


        } catch (error) {

            alert(
                "Cannot connect to backend."
            );
        }
    };


    return (

        <div className="dashboard">


            {/* ==================================
                NAVBAR
            ================================== */}

            <header className="navbar">

                <div className="nav-brand">

                    <div className="brand-logo small">
                        🔐
                    </div>

                    <div>

                        <h2>
                            RoleGuard
                        </h2>

                        <span>
                            Command Center
                        </span>

                    </div>

                </div>


                <div className="nav-right">

                    <div className="auth-status">

                        <span className="online-dot"></span>

                        AUTHENTICATED

                    </div>


                    <button
                        className="logout-button"
                        onClick={onLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ==================================
                CONTENT
            ================================== */}

            <main className="dashboard-content">


                {/* WELCOME */}

                <section className="welcome">

                    <div>

                        <div className="eyebrow">
                            ACCESS GRANTED
                        </div>

                        <h1>
                            Welcome, {user.username}
                        </h1>

                        <p>
                            You are currently logged in with{" "}
                            <strong>
                                {user.role}
                            </strong>{" "}
                            privileges.
                        </p>

                    </div>


                    <div className="role-badge">

                        {isAdmin ? "🛡️" : "👁️"}

                        <span>
                            {user.role}
                        </span>

                    </div>

                </section>


                {/* ==================================
                    STATS
                ================================== */}

                <section className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon">
                            🔑
                        </div>

                        <div>

                            <span>
                                AUTHENTICATION
                            </span>

                            <strong>
                                JWT
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            👤
                        </div>

                        <div>

                            <span>
                                CURRENT ROLE
                            </span>

                            <strong>
                                {user.role}
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            📝
                        </div>

                        <div>

                            <span>
                                TOTAL POSTS
                            </span>

                            <strong>
                                {posts.length}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* ==================================
                    ADMIN POST FORM
                ================================== */}

                {isAdmin && (

                    <section className="post-form-card">

                        <div className="section-heading">

                            <div>

                                <div className="eyebrow">
                                    ADMIN TOOLS
                                </div>

                                <h2>
                                    {editingId
                                        ? "Edit Post"
                                        : "Create New Post"}
                                </h2>

                            </div>

                            <div className="lock-icon">
                                {editingId ? "✏️" : "➕"}
                            </div>

                        </div>


                        <form
                            className="post-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="form-field">

                                <label>
                                    Post Title
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter post title"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Post Content
                                </label>

                                <textarea
                                    placeholder="Write your post..."
                                    value={content}
                                    onChange={(e) =>
                                        setContent(e.target.value)
                                    }
                                    rows="4"
                                />

                            </div>


                            <div className="form-actions">

                                <button
                                    type="submit"
                                    className="save-button"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Saving..."
                                        : editingId
                                            ? "✓ Update Post"
                                            : "＋ Add Post"}

                                </button>


                                {editingId && (

                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={clearForm}
                                    >
                                        Cancel
                                    </button>

                                )}

                            </div>

                        </form>

                    </section>

                )}


                {/* ==================================
                    POSTS
                ================================== */}

                <section className="posts-card">

                    <div className="section-heading">

                        <div>

                            <div className="eyebrow">
                                CONTENT
                            </div>

                            <h2>
                                Posts
                            </h2>

                        </div>

                        <div className="posts-count">
                            {posts.length} POSTS
                        </div>

                    </div>


                    <div className="posts-list">

                        {posts.length === 0 ? (

                            <div className="empty-posts">

                                <div>
                                    📝
                                </div>

                                <h3>
                                    No posts available
                                </h3>

                                <p>
                                    Admin can create the first post.
                                </p>

                            </div>

                        ) : (

                            posts.map((post) => (

                                <article
                                    className="post-item"
                                    key={post.id}
                                >

                                    <div className="post-number">
                                        #{post.id}
                                    </div>


                                    <div className="post-body">

                                        <div className="post-top">

                                            <div>

                                                <h3>
                                                    {post.title}
                                                </h3>

                                                <span>
                                                    By {post.author}
                                                </span>

                                            </div>

                                        </div>


                                        <p>
                                            {post.content}
                                        </p>


                                        {isAdmin && (

                                            <div className="post-actions">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEdit(post)
                                                    }
                                                >
                                                    ✏️ Edit
                                                </button>


                                                <button
                                                    className="delete-post-button"
                                                    onClick={() =>
                                                        handleDelete(post.id)
                                                    }
                                                >
                                                    🗑️ Delete
                                                </button>

                                            </div>

                                        )}

                                    </div>

                                </article>

                            ))

                        )}

                    </div>

                </section>


                {/* ==================================
                    ACCESS CONTROL
                ================================== */}

                <section className="access-card">

                    <div className="section-heading">

                        <div>

                            <div className="eyebrow">
                                ROLE PERMISSIONS
                            </div>

                            <h2>
                                Access Control
                            </h2>

                        </div>

                        <div className="lock-icon">
                            🔒
                        </div>

                    </div>


                    {isAdmin ? (

                        <div className="permission">

                            <div className="permission-icon">
                                🛡️
                            </div>

                            <div className="permission-info">

                                <h3>
                                    Administrator Access
                                </h3>

                                <p>
                                    Add, edit and delete posts.
                                </p>

                                <div className="admin-permission-list">

                                    <span>✓ Add Post</span>

                                    <span>✓ Edit Post</span>

                                    <span>✓ Delete Post</span>

                                </div>

                            </div>

                        </div>

                    ) : (

                        <div className="permission">

                            <div className="permission-icon">
                                👁️
                            </div>

                            <div className="permission-info">

                                <h3>
                                    Read-only Access
                                </h3>

                                <p>
                                    You can view posts but cannot
                                    modify them.
                                </p>

                                <div className="readonly">
                                    ✓ Read-only access
                                </div>

                            </div>

                        </div>

                    )}

                </section>


                {/* JWT */}

                <section className="jwt-card">

                    <div>

                        <div className="eyebrow">
                            SECURITY
                        </div>

                        <h3>
                            JWT Session Active
                        </h3>

                        <p>
                            Your authentication session is
                            secured using JSON Web Token.
                        </p>

                    </div>

                    <div className="jwt-text">
                        JWT
                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;