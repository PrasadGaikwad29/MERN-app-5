import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>
      <Link to={"/"}>Blogs</Link>
      <span style={{ marginLeft: "16px" }}>
        {!user ? (
          <>
            <Link to={"/login"}>Login</Link>
            <span style={{ margin: "0 8px" }}>|</span>
            <Link to={"/register"}>Register</Link>
          </>
        ) : (
          <>
            <Link to={"/create"}>create</Link>
            <span style={{ margin: "0 8px" }}>|</span>

            <button onClick={logout}>Logout</button>
          </>
        )}
      </span>
    </nav>
  );
};

export default Navbar;
