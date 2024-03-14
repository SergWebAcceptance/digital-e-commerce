import React, { useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";

function ContactDetailsForm() {
  const { currentUser, fetchCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      // Call your API function to update user details
      //await updateUserDetails({ name, email, oldPassword, newPassword, userId: currentUser.id });
      const response = await fetch("/api/user-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          oldPassword,
          newPassword,
          userId: currentUser.id,
        }),
      });
      if (response.ok) {
        setFormSuccess("Your details have been successfully updated.");
        setTimeout(function () {
          fetchCurrentUser();
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to update user details:", error);
      setFormError("Failed to update details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">
        Update Your Contact Details
      </h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid gap-6 mb-6 lg:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
        </div>
        <div className="grid gap-6 mb-6 lg:grid-cols-2">
          <div>
            <label
              htmlFor="oldPassword"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Update Details
        </button>
      </form>
      {formError && <p className="mt-4 text-red-600">{formError}</p>}
      {formSuccess && <p className="mt-4 text-green-600">{formSuccess}</p>}
    </div>
  );
}

export default ContactDetailsForm;
