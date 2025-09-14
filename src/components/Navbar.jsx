import { Search, User, LogOut, PenTool } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useAuth } from "../contexts/AuthContext";

export function Navbar() {
  const { user, userProfile, logout } = useAuth();

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-foreground rounded-sm transform rotate-45"></div>
          </div>
          <span className="text-xl font-semibold text-foreground">
            StoryStream
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search articles, authors, and topics"
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button variant="default" asChild>
                <Link to="/create" className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  Write
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {userProfile?.name || user.displayName || user.email}
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
