import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
          </div>
          <span className="text-xl font-semibold text-gray-900">
            StoryStream
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search articles, authors, and topics"
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200 rounded-lg"
            />
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
