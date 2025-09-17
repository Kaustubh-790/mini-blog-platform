import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArticleCard } from "../components/BlogCard";
import LoadingSpinner from "../components/LoadingSpinner";
import apiService from "../services/api";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useScrollToTop(); // Scroll to top when component mounts or route changes

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  });

  const searchQuery = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const fetchSearchResults = async (page = 1) => {
    // If no search query and no category, show empty state
    if (!searchQuery.trim() && !category.trim()) {
      setPosts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response;

      if (searchQuery.trim()) {
        // Search by query
        response = await apiService.searchPosts(searchQuery, {
          page,
          limit: pagination.limit,
          status: "published",
          sortBy: "publishedAt",
          sortOrder: "desc",
        });
      } else if (category.trim()) {
        // Filter by category
        response = await apiService.getPosts({
          page,
          limit: pagination.limit,
          status: "published",
          category: category,
          sortBy: "publishedAt",
          sortOrder: "desc",
        });
      }

      if (response.success) {
        setPosts(response.data);
        setPagination(response.pagination);
      } else {
        setError("Failed to fetch search results");
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError(err.message || "Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(1);
  }, [searchQuery, category]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchSearchResults(newPage);
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
        className="px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-l-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border-t border-b ${
            i === pagination.page
              ? "text-blue-600 bg-blue-50 border-blue-500"
              : "text-muted-foreground bg-background border-border hover:bg-muted"
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
        className="px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-r-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    );

    return (
      <div className="flex justify-center mt-8">
        <div className="flex">{pages}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold text-foreground">
              {category
                ? `${
                    category.charAt(0).toUpperCase() + category.slice(1)
                  } Articles`
                : "Search Results"}
            </h1>
          </div>

          {searchQuery && (
            <p className="text-lg text-muted-foreground">
              {pagination.total > 0 ? (
                <>
                  Found{" "}
                  <span className="font-semibold">{pagination.total}</span>{" "}
                  result{pagination.total !== 1 ? "s" : ""} for{" "}
                  <span className="font-semibold text-blue-600">
                    "{searchQuery}"
                  </span>
                </>
              ) : (
                <>
                  No results found for{" "}
                  <span className="font-semibold text-blue-600">
                    "{searchQuery}"
                  </span>
                </>
              )}
            </p>
          )}

          {category && !searchQuery && (
            <p className="text-lg text-muted-foreground">
              {pagination.total > 0 ? (
                <>
                  Found{" "}
                  <span className="font-semibold">{pagination.total}</span>{" "}
                  article{pagination.total !== 1 ? "s" : ""} in{" "}
                  <span className="font-semibold text-blue-600">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </>
              ) : (
                <>
                  No articles found in{" "}
                  <span className="font-semibold text-blue-600">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </>
              )}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {!searchQuery.trim() ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Enter a search term
            </h3>
            <p className="text-muted-foreground">
              Use the search bar in the navigation to find articles, authors,
              and topics.
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {category
                ? `No articles found in ${
                    category.charAt(0).toUpperCase() + category.slice(1)
                  }`
                : "No results found"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {category
                ? "This category doesn't have any articles yet. Check back later or browse other categories."
                : "Try searching with different keywords or check your spelling."}
            </p>
            <Button onClick={() => navigate("/")} variant="default">
              Browse All Articles
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ArticleCard
                  key={post._id}
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
              ))}
            </div>
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}
