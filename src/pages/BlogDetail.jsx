import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../components/FallBackImage";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { useAuth } from "../contexts/AuthContext";

export function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api"
        }/posts/${id}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch post");
      }

      setPost(result.data);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api"
        }/comments/posts/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setNewComment("");
        // Refresh comments or add to list
        fetchPost(); // This will also refresh comments
      } else {
        throw new Error(result.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Post Not Found
          </h1>
          <Button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  return (
    <article className="max-w-4xl mx-auto px-6 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={
                post.author?.avatarUrl ||
                "https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc1Nzc2NDc4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              }
              alt={post.author?.name || "Author"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900">
                By {post.author?.name || "Unknown Author"}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(
                  post.publishedAt || post.createdAt
                ).toLocaleDateString()}{" "}
                •{post.category && ` ${post.category}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentCount || 0}</span>
            </div>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Article Content */}
      <div
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
        dangerouslySetInnerHTML={{
          __html:
            post.bodyHtml ||
            post.bodyMarkdown ||
            "<p>No content available.</p>",
        }}
      />

      {/* Comments Section */}
      <section className="mt-12 border-t border-gray-200 pt-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          Comments ({post.commentCount || 0})
        </h3>

        {/* Add Comment Form */}
        {user && (
          <div className="mb-8">
            <form onSubmit={handleCommentSubmit}>
              <div className="flex items-start gap-3 mb-4">
                <ImageWithFallback
                  src={
                    user.photoURL ||
                    "https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1Nzg1MTI0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  }
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <Textarea
                    placeholder="Add your comment..."
                    className="min-h-20 mb-3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    disabled={!newComment.trim()}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}

        {!user && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-center">
              Please{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline"
              >
                log in
              </button>{" "}
              to leave a comment.
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-3">
                <ImageWithFallback
                  src={
                    comment.author?.avatarUrl ||
                    "https://images.unsplash.com/photo-1719257751404-1dea075324bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbnxlbnwxfHx8fDE3NTc3ODEzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  }
                  alt={comment.author?.name || "Commenter"}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {comment.author?.name || "Anonymous"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
