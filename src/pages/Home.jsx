import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArticleCard } from "../components/BlogCard";
import LoadingSpinner from "../components/LoadingSpinner";
import apiService from "../services/api";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function Home() {
  const navigate = useNavigate();
  useScrollToTop();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  });

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getPosts({
        page,
        limit: pagination.limit,
        status: "published",
        sortBy: "publishedAt",
        sortOrder: "desc",
      });

      if (response.success) {
        setPosts(response.data);
        setPagination(response.pagination);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPosts(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.page - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-card/50 backdrop-blur-sm border border-border/50 rounded-l-xl hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
            i === pagination.page
              ? "text-primary bg-gradient-to-r from-river-50 to-river-100 border border-river-200 shadow-sm"
              : "text-muted-foreground bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-accent/50"
          }`}
        >
          {i}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.totalPages}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-card/50 backdrop-blur-sm border border-border/50 rounded-r-xl hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
      >
        Next
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    );

    return (
      <div className="flex justify-center mt-12">
        <nav
          className="flex items-center gap-1 bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-2 shadow-lg"
          aria-label="Pagination"
        >
          {pages}
        </nav>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-river-50/30 to-background">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-river-50/50 via-transparent to-river-100/30"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Discover Amazing
                <span className="bg-gradient-to-r from-river-600 to-river-800 bg-clip-text text-foreground">
                  {" "}
                  Stories
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Explore compelling articles, insights, and stories from our
                vibrant community of writers and creators.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-muted-foreground mt-4">
              Loading amazing stories...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-river-50/30 to-background">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-river-50/50 via-transparent to-river-100/30"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-river-50 text-river-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-river-500 rounded-full animate-pulse"></div>
                Welcome to ByteBites
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Discover Amazing
                <span className="bg-gradient-to-r from-river-600 to-river-800 bg-clip-text text-foreground">
                  {" "}
                  Stories
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Explore compelling articles, insights, and stories from our
                vibrant community of writers and creators.
              </p>
            </div>
          </div>
        </div>
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-destructive/10 rounded-full mb-6">
            <svg
              className="h-10 w-10 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            Oops! Something went wrong
          </h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
            {error}
          </p>
          <button
            onClick={() => fetchPosts(pagination.page)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-river-50/30 to-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-river-50/50 via-transparent to-river-100/30"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight ${
                hasAnimated ? "animate-slide-up" : ""
              }`}
            >
              Discover Amazing
              <span className="bg-gradient-to-r from-river-600 to-river-800 bg-clip-text text-foreground">
                {" "}
                Stories
              </span>
            </h1>
            <p
              className={`text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed ${
                hasAnimated ? "animate-slide-up-delay" : ""
              }`}
            >
              Explore compelling articles and stories from our vibrant community
              of writers and creators.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 bg-river-50 rounded-full mb-6 ${
                hasAnimated ? "animate-bounce" : ""
              }`}
            >
              <svg
                className="h-10 w-10 text-river-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              No Stories Yet
            </h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Be the first to share your story with our amazing community of
              readers!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <div
                  key={post._id}
                  className={hasAnimated ? "animate-fade-in-up" : ""}
                  style={
                    hasAnimated ? { animationDelay: `${index * 100}ms` } : {}
                  }
                >
                  <ArticleCard
                    id={post._id}
                    title={post.title}
                    description={post.excerpt || "No description available"}
                    author={{
                      name: post.author?.name || "Anonymous",
                      avatar: post.author?.avatarUrl || null,
                      date: new Date(
                        post.publishedAt || post.createdAt
                      ).toLocaleDateString(),
                    }}
                    image={
                      post.featuredImage ||
                      "https://images.unsplash.com/photo-1612969306393-ba0aaef5ed90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHJlYWRpbmclMjBib29rJTIwc3Rvcnl0ZWxsaW5nfGVufDF8fHx8MTc1Nzg1MTIzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    }
                    category={post.category}
                    tags={post.tags}
                  />
                </div>
              ))}
            </div>
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}
