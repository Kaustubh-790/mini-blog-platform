import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../components/FallBackImage";
import {
  MessageCircle,
  Share2,
  Bookmark,
  ArrowLeft,
  Heart,
  Edit,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/posts/${id}`
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

  const fetchComments = async () => {
    try {
      const response = await api.getComments(id);
      console.log("Comments response:", response);
      if (response.success) {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const token = await user.getIdToken();
      const response = await api.createComment(id, newComment, token);

      if (response.success) {
        setNewComment("");
        fetchComments();
        fetchPost();
      } else {
        throw new Error(response.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const comment = comments.find((c) => c._id === commentId);

      if (comment.isLikedByUser) {
        await api.unlikeComment(commentId, token);
      } else {
        await api.likeComment(commentId, token);
      }

      fetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
      alert("Failed to update like. Please try again.");
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.body || comment.content);
  };

  const handleSaveEditComment = async (commentId) => {
    if (!user || !editingCommentText.trim()) return;

    try {
      const token = await user.getIdToken();
      const response = await api.updateComment(
        commentId,
        editingCommentText,
        token
      );

      if (response.success) {
        setEditingCommentId(null);
        setEditingCommentText("");
        fetchComments();
      } else {
        throw new Error(response.error || "Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment. Please try again.");
    }
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return;

    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const token = await user.getIdToken();
      const response = await api.deleteComment(commentId, token);

      if (response.success) {
        fetchComments();
        fetchPost();
      } else {
        throw new Error(response.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
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
        <div className="mb-4 relative flex justify-center">
          <ImageWithFallback
            src={post.featuredImage}
            loading="lazy"
            className="rounded-lg max-h-100 w-full object-cover shadow-md"
          />
        </div>
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
              loading="lazy"
            />
            <div>
              <p className="font-medium text-gray-900">
                By {post.author?.name || "Unknown Author"}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(
                  post.publishedAt || post.createdAt
                ).toLocaleDateString()}{" "}
                â€¢{post.category && ` ${post.category}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentCount || 0}</span>
            </div>

            {user && user.uid === post.authorUid && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/edit/${post._id}`)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            )}

            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        </div>

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

      <div
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
        dangerouslySetInnerHTML={{
          __html:
            post.bodyHtml ||
            post.bodyMarkdown ||
            "<p>No content available.</p>",
        }}
      />

      <section className="mt-12 border-t border-gray-200 pt-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          Comments ({post.commentCount || 0})
        </h3>

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

        <div className="space-y-6">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-3">
                <ImageWithFallback
                  src={
                    comment.author?.avatarUrl ||
                    "https://images.unsplash.com/photo-1719257751404-1dea075324bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTc3ODEzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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

                  {editingCommentId === comment._id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        className="min-h-16 text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveEditComment(comment._id)}
                          className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEditComment}
                          className="flex items-center gap-1"
                        >
                          <X className="h-3 w-3" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700 text-sm leading-relaxed mb-2">
                        {comment.body || comment.content}
                      </p>

                      <div className="flex items-center gap-3">
                        {user && (
                          <button
                            onClick={() => handleLikeComment(comment._id)}
                            className={`flex items-center gap-1 text-xs transition-colors ${
                              comment.isLikedByUser
                                ? "text-red-500 hover:text-red-600"
                                : "text-gray-500 hover:text-red-500"
                            }`}
                          >
                            <Heart
                              className={`h-3 w-3 ${
                                comment.isLikedByUser ? "fill-current" : ""
                              }`}
                            />
                            <span>{comment.likeCount || 0}</span>
                          </button>
                        )}

                        {user &&
                          comment.author &&
                          user.uid === comment.authorUid && (
                            <>
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                              >
                                <Edit className="h-3 w-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </button>
                            </>
                          )}
                      </div>
                    </>
                  )}
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
