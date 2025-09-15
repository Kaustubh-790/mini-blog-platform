import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { ImageWithFallback } from "../components/FallBackImage";
import api from "../services/api";
import { Edit, Trash2, Calendar, Eye } from "lucide-react";

const Profile = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

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

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = await user.getIdToken();
        await api.deletePost(postId, token);
        setUserPosts(userPosts.filter((post) => post.id !== postId));
      } catch (error) {
        setError(error.message);
      }
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
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Profile Header */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <ImageWithFallback
            src={userProfile?.avatarUrl || user?.photoURL}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {userProfile?.name || user?.displayName || "Anonymous User"}
        </h1>

        {userProfile?.bio && (
          <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto">
            {userProfile.bio}
          </p>
        )}

        <p className="text-gray-500 mb-6">Joined in {joinDate}</p>

        <Button
          onClick={() => navigate("/settings")}
          variant="outline"
          className="flex items-center gap-2 mx-auto"
        >
          <Edit className="w-4 h-4" />
          Edit profile
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "posts"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "about"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              About
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "posts" && (
        <div className="space-y-6">
          {userPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No posts yet</p>
              <Button onClick={() => navigate("/create")}>
                Create your first post
              </Button>
            </div>
          ) : (
            userPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2
                      className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer"
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      {post.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-500 gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.createdAt)}
                      </div>
                      {post.views && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views} views
                        </div>
                      )}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/edit/${post.id}`)}
                      className="p-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
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
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          {userProfile?.bio ? (
            <p className="text-gray-600 leading-relaxed">{userProfile.bio}</p>
          ) : (
            <p className="text-gray-500 italic">
              No bio available. Update your profile to add more information
              about yourself.
            </p>
          )}

          {(userProfile?.twitter ||
            userProfile?.linkedin ||
            userProfile?.instagram) && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Connect</h3>
              <div className="space-y-2">
                {userProfile.twitter && (
                  <a
                    href={userProfile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-700"
                  >
                    Twitter
                  </a>
                )}
                {userProfile.linkedin && (
                  <a
                    href={userProfile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-700"
                  >
                    LinkedIn
                  </a>
                )}
                {userProfile.instagram && (
                  <a
                    href={userProfile.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-700"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
