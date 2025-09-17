import { Search, PenTool } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useAuth } from "../contexts/AuthContext";
import { UserDropdown } from "./UserDropdown";
import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "./FallBackImage";

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
    <header className="bg-card/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/50 px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <ImageWithFallback
            src={"/logo.png"}
            alt="ByteBites"
            className="w-12 h-12 rounded-xl object-contain"
          />
          <span className="text-2xl font-bold text-foreground font-heading">
            ByteBites
          </span>
        </Link>

        <div className="flex-1 max-w-lg mx-8">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles, authors, and topics..."
                className="pl-12 pr-12 py-3 w-full bg-background/50 border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-200"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-river-600"></div>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="default"
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Link to="/create" className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  Write
                </Link>
              </Button>
              <UserDropdown />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="hover:bg-river-50 hover:text-river-700 transition-colors duration-200"
              >
                <Link to="/login">Log In</Link>
              </Button>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
