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
import { useScrollToTop } from "../hooks/useScrollToTop";

export function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  useScrollToTop();
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
      console.log("Fetching post with ID:", id);
      const response = await api.getPost(id);
      console.log("Post response:", response);
      setPost(response.data);
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
      <div className="min-h-screen bg-gradient-to-br from-background via-river-50/20 to-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-muted rounded-2xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-river-50/20 to-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
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
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Post Not Found
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              {error}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-river-50/20 to-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
              <svg
                className="h-10 w-10 text-muted-foreground"
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
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Post Not Found
            </h1>
            <Button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-river-50/20 to-background">
      <article className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Home
          </Button>
        </div>

        <header className="mb-8">
          <div className="mb-6 relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <ImageWithFallback
                src={post.featuredImage}
                alt={post.title}
                loading="lazy"
                className="w-full h-auto object-contain bg-gradient-to-br from-river-50 to-river-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto animate-slide-up-delay">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 animate-fade-in-delay">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ImageWithFallback
                    src={
                      post.author?.avatarUrl ||
                      "https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc1Nzc2NDc4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    }
                    alt={post.author?.name || "Author"}
                    className="w-16 h-16 rounded-full object-cover border-3 border-river-200 shadow-lg"
                    loading="lazy"
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground text-lg">
                    By {post.author?.name || "Unknown Author"}
                  </p>
                  <p className="text-muted-foreground">
                    {new Date(
                      post.publishedAt || post.createdAt
                    ).toLocaleDateString()}
                    {post.category && (
                      <span className="ml-2 px-2 py-1 bg-river-50 text-river-700 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 backdrop-blur-sm px-3 py-2 rounded-full border border-border/50">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentCount || 0}</span>
                </div>

                {user && user.uid === post.authorUid && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/edit/${post._id}`)}
                    className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-river-50 text-river-700 rounded-full text-sm font-medium border border-river-200/50 hover:bg-river-100 transition-colors duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-border/50 mb-12">
          <div
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-blockquote:border-l-4 prose-blockquote:border-river-300 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-river-50/50 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{
              __html:
                post.bodyHtml ||
                post.bodyMarkdown ||
                "<p>No content available.</p>",
            }}
          />
        </div>

        <section className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-border/30">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Comments ({post.commentCount || 0})
          </h3>

          {user && (
            <div className="mb-8 bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <form onSubmit={handleCommentSubmit}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <ImageWithFallback
                      src={
                        user.photoURL ||
                        "https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1Nzg1MTI0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      }
                      alt="Your avatar"
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-river-200 shadow-md"
                    />
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your thoughts..."
                      className="min-h-24 mb-4 bg-background/50 border-border/50 focus:border-primary transition-colors duration-200"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      disabled={!newComment.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {!user && (
            <div className="mb-8 p-6 bg-river-50/50 backdrop-blur-sm rounded-xl border border-river-200/50 text-center">
              <p className="text-muted-foreground">
                Please{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-primary hover:text-primary/80 font-semibold underline transition-colors duration-200"
                >
                  log in
                </button>{" "}
                to leave a comment and join the conversation.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {comments && comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={comment._id}
                  className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:shadow-md transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <ImageWithFallback
                        src={
                          comment.author?.avatarUrl ||
                          "https://images.unsplash.com/photo-1719257751404-1dea075324bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTc3ODEzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        }
                        alt={comment.author?.name || "Commenter"}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-river-200 shadow-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-foreground">
                          {comment.author?.name || "Anonymous"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {editingCommentId === comment._id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editingCommentText}
                            onChange={(e) =>
                              setEditingCommentText(e.target.value)
                            }
                            className="min-h-20 text-sm bg-background/50 border-border/50"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEditComment(comment._id)}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                            >
                              <Check className="h-4 w-4" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEditComment}
                              className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {comment.body || comment.content}
                          </p>

                          <div className="flex items-center gap-4">
                            {user && (
                              <button
                                onClick={() => handleLikeComment(comment._id)}
                                className={`flex items-center gap-2 text-sm transition-all duration-200 hover:scale-105 ${
                                  comment.isLikedByUser
                                    ? "text-red-500 hover:text-red-600"
                                    : "text-muted-foreground hover:text-red-500"
                                }`}
                              >
                                <Heart
                                  className={`h-4 w-4 ${
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
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                                  >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(comment._id)
                                    }
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors duration-200"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </>
                              )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-river-50 rounded-full mb-4">
                  <MessageCircle className="h-8 w-8 text-river-500" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  No comments yet
                </h4>
                <p className="text-muted-foreground">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </section>
      </article>
    </div>
  );
}
