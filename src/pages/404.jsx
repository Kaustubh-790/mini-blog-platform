import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search, FileText } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useScrollToTop } from "../hooks/useScrollToTop";

const NotFound = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-river-50/20 to-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-river-50 rounded-full mb-6 animate-bounce">
            <div className="text-6xl font-bold text-river-500">404</div>
          </div>
        </div>

        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
            Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-muted-foreground">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Link to="/">
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>

        <div
          className="mt-12 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <p className="text-sm text-muted-foreground mb-4">
            Or try these popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/search"
              className="flex items-center gap-2 text-river-600 hover:text-river-700 transition-colors duration-200 text-sm"
            >
              <Search className="h-4 w-4" />
              Search Articles
            </Link>
            <Link
              to="/create"
              className="flex items-center gap-2 text-river-600 hover:text-river-700 transition-colors duration-200 text-sm"
            >
              <FileText className="h-4 w-4" />
              Write Article
            </Link>
          </div>
        </div>

        <div className="absolute top-20 left-10 w-20 h-20 bg-river-100 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-16 h-16 bg-river-200 rounded-full opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-5 w-12 h-12 bg-river-300 rounded-full opacity-25 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  );
};

export default NotFound;
