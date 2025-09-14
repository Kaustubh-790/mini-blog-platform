import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import apiService from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get Firebase ID token
          const token = await firebaseUser.getIdToken();

          // Sync user with backend
          const profileData = await apiService.syncUser(token);

          setUser(firebaseUser);
          setUserProfile(profileData.data);
        } catch (error) {
          console.error("Error syncing user with backend:", error);
          // Still set the Firebase user even if backend sync fails
          setUser(firebaseUser);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      try {
        const token = await user.getIdToken();
        const profileData = await apiService.getCurrentUser(token);
        setUserProfile(profileData.data);
      } catch (error) {
        console.error("Error refreshing user profile:", error);
      }
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    logout,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
