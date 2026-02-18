import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await registerUser({ name, surname, email, password });
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registartion Failed");
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
    <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8">
      <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

      <p className="text-gray-400 text-center mb-8">
        Join us and start sharing{" "}
        <span className="text-blue-400">your stories today.</span>
      </p>

      {error && (
        <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-2 text-gray-300">First Name</label>
          <input
            type="text"
            placeholder="Enter first name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-300">Surname</label>
          <input
            type="text"
            placeholder="Enter surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-300">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition duration-200"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  </div>
);
};

export default Register;
