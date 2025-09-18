import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { ImageWithFallback } from "../components/FallBackImage";
import api from "../services/api";
import { Edit, Trash2, Calendar, Eye } from "lucide-react";
import { useScrollToTop } from "../hooks/useScrollToTop";

const Profile = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  useScrollToTop();

  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchUserPosts();
  }, [user, navigate]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const response = await api.getUserPosts(token);

      if (response.success) {
        setUserPosts(response.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const handleDeletePost = async (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    try {
      const token = await user.getIdToken();
      await api.deletePost(postToDelete, token);
      setUserPosts(userPosts.filter((post) => post.id !== postToDelete));
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const joinDate = userProfile?.createdAt
    ? formatDate(userProfile.createdAt)
    : "2024";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-river-50/20 to-background">
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl border border-border/50 max-w-md w-full p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Delete Post
              </h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-10 px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground hover:bg-muted transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePost}
                className="flex-1 h-10 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-12 animate-slide-up">
          <div className="mb-8">
            <ImageWithFallback
              src={userProfile?.avatarUrl || user?.photoURL}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-river-200 shadow-2xl"
            />
          </div>

          <h1 className="text-5xl font-bold text-foreground mb-4">
            {userProfile?.name || user?.displayName || "Anonymous User"}
          </h1>

          {userProfile?.bio && (
            <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed">
              {userProfile.bio}
            </p>
          )}

          <div className="flex items-center justify-center gap-2 mb-8">
            <p className="text-muted-foreground">Joined in {joinDate}</p>
          </div>

          <Button
            onClick={() => navigate("/settings")}
            variant="outline"
            className="flex items-center gap-2 mx-auto bg-card/50 backdrop-blur-sm border-border/50 hover:bg-river-50 hover:border-river-200 hover:text-river-700 transition-all duration-200 hover:scale-105"
          >
            <Edit className="w-4 h-4" />
            Edit profile
          </Button>
        </div>

        {error && (
          <div className="mb-8 animate-fade-in">
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <p className="text-destructive font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 animate-fade-in-up">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-2 border border-border/50 shadow-lg">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === "posts"
                    ? "bg-river-500 text-black/80 shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === "about"
                    ? "bg-river-500 text-black/80 shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                About
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "posts" && (
          <div className="space-y-6 animate-fade-in-up">
            {userPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-river-50 rounded-full mb-6">
                  <Edit className="w-10 h-10 text-river-500" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  No posts yet
                </h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                  Start sharing your thoughts and stories with the community
                </p>
                <Button
                  onClick={() => navigate("/create")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Create your first post
                </Button>
              </div>
            ) : (
              userPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2
                        className="text-2xl font-bold text-foreground mb-3 hover:text-river-600 cursor-pointer transition-colors duration-200"
                        onClick={() => navigate(`/blog/${post.id}`)}
                      >
                        {post.title}
                      </h2>
                      <div className="flex items-center text-sm text-muted-foreground gap-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.createdAt)}
                        </div>
                        {post.views && (
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {post.views} views
                          </div>
                        )}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            post.status === "published"
                              ? "bg-river-100 text-river-700 border border-river-200"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/edit/${post.id}`)}
                        className="p-2 hover:bg-river-50 hover:border-river-200 hover:text-river-700 transition-all duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-river-50 text-river-700 text-xs rounded-full font-medium border border-river-200/50"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg animate-fade-in-up">
            <h2 className="text-3xl font-bold text-foreground mb-6">About</h2>
            {userProfile?.bio ? (
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                {userProfile.bio}
              </p>
            ) : (
              <p className="text-muted-foreground italic text-lg mb-8">
                No bio available. Update your profile to add more information
                about yourself.
              </p>
            )}

            {(userProfile?.twitter ||
              userProfile?.linkedin ||
              userProfile?.instagram) && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Connect
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {userProfile.twitter && (
                    <a
                      href={userProfile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-card/30 backdrop-blur-sm rounded-xl border border-border/30 hover:bg-river-50/50 hover:border-river-200 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </div>
                      <span className="font-medium text-foreground group-hover:text-river-700 transition-colors duration-200">
                        Twitter
                      </span>
                    </a>
                  )}
                  {userProfile.linkedin && (
                    <a
                      href={userProfile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-card/30 backdrop-blur-sm rounded-xl border border-border/30 hover:bg-river-50/50 hover:border-river-200 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </div>
                      <span className="font-medium text-foreground group-hover:text-river-700 transition-colors duration-200">
                        LinkedIn
                      </span>
                    </a>
                  )}
                  {userProfile.instagram && (
                    <a
                      href={userProfile.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-card/30 backdrop-blur-sm rounded-xl border border-border/30 hover:bg-river-50/50 hover:border-river-200 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z" />
                        </svg>
                      </div>
                      <span className="font-medium text-foreground group-hover:text-river-700 transition-colors duration-200">
                        Instagram
                      </span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
