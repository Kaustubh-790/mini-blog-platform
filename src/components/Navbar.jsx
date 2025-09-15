import { Search, PenTool } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useAuth } from "../contexts/AuthContext";
import { UserDropdown } from "./UserDropdown";
import { useState, useEffect, useRef } from "react";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.trim()) {
      debounceRef.current = setTimeout(() => {
        setIsSearching(true);
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearching(false);
      }, 500);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-foreground rounded-sm transform rotate-45"></div>
          </div>
          <span className="text-xl font-semibold text-foreground">
            ByteBites
          </span>
        </Link>

        <div className="flex-1 max-w-md mx-8">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search articles, authors, and topics"
                className="pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button variant="default" asChild>
                <Link to="/create" className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  Write
                </Link>
              </Button>
              <UserDropdown />
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
