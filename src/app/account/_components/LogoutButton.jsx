"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import React from "react";
import { LogOut } from "lucide-react";

function LogoutButton() {
  const { currentUser, setCurrentUser } = useAuth();
  const router = useRouter();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("jwt"); // Clear JWT token
    setCurrentUser(null); // Clear current user data
    router.push("/sign-in"); // Redirect to the sign-in page
  };
  return (
    <button
      className="rounded-md bg-red-100 w-full px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-white shadow flex items-center gap-2 hover:bg-red-600"
      onClick={handleLogout}
    >
        <LogOut/>
      Logout
    </button>
  );
}

export default LogoutButton;
