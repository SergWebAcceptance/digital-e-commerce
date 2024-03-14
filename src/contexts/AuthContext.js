'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}





export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = () => {
    setLoading(true);
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      fetch(`http://localhost:1337/api/users/me`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => response.json())
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((error) => console.error("Failed to fetch user", error))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  

  const value = {
    currentUser,
    setCurrentUser,
    fetchCurrentUser, // Expose fetchCurrentUser for manual calls
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div className="loading">Loading...</div>}
    </AuthContext.Provider>
  );
};
