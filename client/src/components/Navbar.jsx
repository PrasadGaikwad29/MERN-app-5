import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        padding: "12px",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Link to="/">Home</Link>
      </div>

      <div>
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <span style={{ margin: "0 8px" }}>|</span>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span style={{ marginRight: "16px", fontWeight: "bold" }}>
              Welcome, {user.name || user.email}
            </span>

            {/* My Blogs for BOTH user and admin */}
            <Link to="/userdashboard/myblogs">My Blogs</Link>
            <span style={{ margin: "0 8px" }}>|</span>

            {/* Admin Dashboard only for admin */}
            {user.role === "admin" && (
              <>
                <Link to="/admindashboard">Admin Dashboard</Link>
                <span style={{ margin: "0 8px" }}>|</span>
              </>
            )}

            <Link to="/create">Create</Link>
            <span style={{ margin: "0 8px" }}>|</span>

            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
