import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ImageWithFallback } from "./FallBackImage";
import { User, Settings, LogOut, ChevronDown, Sun, Moon } from "lucide-react";

export function UserDropdown() {
  const { user, userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  if (!user) return null;

  const displayName = userProfile?.name || user.displayName || user.email;
  const avatarUrl = userProfile?.avatarUrl || user.photoURL;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 hover:border-border transition-all duration-200 group"
      >
        <ImageWithFallback
          src={avatarUrl}
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover border-2 border-river-200 shadow-md group-hover:border-river-300 transition-colors duration-200"
        />
        <span className="hidden md:block text-sm font-semibold text-foreground max-w-32 truncate">
          {displayName}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-all duration-200 ${
            isOpen ? "rotate-180 text-river-600" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl z-50 animate-fade-in-up">
          <div className="px-6 py-4 border-b border-border/30">
            <div className="flex items-center gap-4">
              <ImageWithFallback
                src={avatarUrl}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-river-200 shadow-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-6 py-3 text-sm text-foreground hover:bg-river-50/50 hover:text-river-700 transition-all duration-200 group"
            >
              <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              Profile
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-6 py-3 text-sm text-foreground hover:bg-river-50/50 hover:text-river-700 transition-all duration-200 group"
            >
              <Settings className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              Settings
            </Link>

            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-6 py-3 text-sm text-foreground hover:bg-river-50/50 hover:text-river-700 transition-all duration-200 group"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <Sun className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              )}
              {theme === "light" ? "Dark" : "Light"} mode
            </button>

            <hr className="my-2 border-border/30" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-3 text-sm text-destructive hover:bg-destructive/10 transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
