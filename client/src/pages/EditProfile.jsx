import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function EditProfile() {
  const { user, token, editProfile } = useAuth(); // make sure this matches context

  const [name, setName] = useState(user?.name || "");
  const [surname, setSurname] = useState(user?.surname || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const res = await api.put(
        "/auth/edit-profile",
        { name, surname },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      editProfile(res.data.user);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email (Readonly) */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Surname */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Surname</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed text-gray-300"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

          {message && (
            <p className="text-green-400 text-sm text-center">{message}</p>
          )}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
