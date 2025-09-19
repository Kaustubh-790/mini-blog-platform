import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Save,
  Upload,
  Send,
  Eye,
  EyeOff,
  ArrowLeft,
  Image,
  Tag,
  FileText,
  Type,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import TextEditor from "../components/TextEditor";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function CreateBlog() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  useScrollToTop();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);

  const editId = id || searchParams.get("edit");
  const isEditMode = Boolean(editId);

  const [blogData, setBlogData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    category: "General",
    coverImage: null,
    coverImageUrl: null,
    coverImageAlt: "",
    status: "draft",
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  const categories = [
    "General",
    "Technology",
    "Travel",
    "Food",
    "Lifestyle",
    "Business",
    "Health",
    "Education",
    "Entertainment",
    "Sports",
  ];

  useEffect(() => {
    if (isEditMode && editId) {
      fetchBlogData();
    }
  }, [isEditMode, editId]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getPost(editId);

      if (response.success) {
        const post = response.data;
        const newBlogData = {
          title: post.title || "",
          excerpt: post.excerpt || "",
          content: post.content || post.bodyHtml || "",
          tags: post.tags ? post.tags.join(", ") : "",
          category: post.category || "General",
          coverImage: null,
          coverImageUrl: post.featuredImage || null,
          coverImageAlt: post.featuredImageAlt || "",
          status: post.status || "draft",
        };
        setBlogData(newBlogData);

        if (post.featuredImage) {
          setImagePreview(post.featuredImage);
        }
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
      setError("Failed to load blog data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBlogData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setIsUploading(true);

        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append("image", file);

        const token = await user.getIdToken();
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/uploads`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to upload image");
        }

        setBlogData((prev) => ({
          ...prev,
          coverImage: file,
          coverImageUrl: result.data.url,
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
        setError(`Error uploading image: ${error.message}`);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = async (publishStatus = "draft") => {
    try {
      setIsUploading(true);

      if (!user) {
        setError("Please log in to save your blog post.");
        return;
      }

      const postData = {
        title: blogData.title,
        bodyHtml: blogData.content,
        excerpt: blogData.excerpt,
        category: blogData.category,
        tags: blogData.tags
          ? blogData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
        status: publishStatus,
        featuredImage: blogData.coverImageUrl,
        featuredImageAlt: blogData.coverImageAlt,
      };

      const token = await user.getIdToken();

      let response;
      if (isEditMode) {
        response = await api.updatePost(editId, postData, token);
      } else {
        response = await api.createPost(postData, token);
      }

      if (publishStatus === "published") {
        // Show success message and navigate
        const successMessage = isEditMode
          ? "Blog updated and published successfully!"
          : "Blog published successfully!";
        setError(null); // Clear any previous errors

        // Debug: Log the response to check structure
        console.log("Response data:", response.data);
        const postId = isEditMode ? id : response.data._id;
        console.log("Navigating to post ID:", postId);

        navigate(`/blog/${postId}`);
      } else {
        // Show success message for draft
        const successMessage = isEditMode
          ? "Draft updated successfully!"
          : "Draft saved successfully!";
        setError(null); // Clear any previous errors
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      setError(`Error saving blog: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const renderPreview = () => {
    return (
      <div className="space-y-6">
        {(imagePreview || blogData.coverImageUrl) && (
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={imagePreview || blogData.coverImageUrl}
              alt={blogData.coverImageAlt || "Cover"}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>
        )}

        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {blogData.title || "Your Blog Title"}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {blogData.excerpt || "Your blog excerpt..."}
          </p>
        </div>

        <div
          className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-blockquote:border-l-4 prose-blockquote:border-river-300 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-river-50/50 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{
            __html:
              blogData.content ||
              "<p class='text-center text-muted-foreground italic'>Start writing your blog content...</p>",
          }}
        />

        {blogData.tags && (
          <div className="flex flex-wrap justify-center gap-2 pt-4 border-t border-border/30">
            {blogData.tags.split(",").map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-river-50 text-river-700 rounded-full text-sm font-medium border border-river-200/50"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-river-50/20 to-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-river-50 rounded-full mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Loading your blog
              </h3>
              <p className="text-muted-foreground">
                Preparing your creative workspace...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-river-50/20 to-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
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
              Oops! Something went wrong
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              {error}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-river-50/20 to-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </Button>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-river-50 text-river-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {isEditMode ? "Edit Mode" : "Create Mode"}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {isEditMode ? "Edit Your" : "Create Your"}
              <span className="bg-gradient-to-r from-river-600 to-river-800 bg-clip-text text-foreground">
                {" "}
                Blog
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isEditMode
                ? "Refine and perfect your blog post"
                : "Share your thoughts and stories with the community"}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 animate-fade-in">
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
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-destructive hover:text-destructive/80 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6 animate-fade-in-up">
            {/* Title Field */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Type className="w-4 h-4 text-river-600" />
                Blog Title
              </label>
              <Input
                type="text"
                placeholder="Enter your captivating title..."
                value={blogData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="text-lg font-medium"
              />
            </div>

            {/* Tags Field */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Tag className="w-4 h-4 text-river-600" />
                Tags
              </label>
              <Input
                type="text"
                placeholder="technology, web development, tutorial..."
                value={blogData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Separate tags with commas
              </p>
            </div>

            {/* Content Field */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <FileText className="w-4 h-4 text-river-600" />
                Content
              </label>
              <TextEditor
                key={isEditMode ? `edit-${editId}` : "create"}
                value={blogData.content}
                onChange={(content) => handleInputChange("content", content)}
                placeholder="Start writing your masterpiece..."
                height="400px"
              />
            </div>

            {/* Excerpt Field */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <FileText className="w-4 h-4 text-river-600" />
                Excerpt
              </label>
              <Textarea
                placeholder="Write a compelling description that will make readers want to read more..."
                value={blogData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Category Field */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Calendar className="w-4 h-4 text-river-600" />
                Category
              </label>
              <select
                value={blogData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full h-11 px-4 py-2 border-2 border-border rounded-lg bg-card text-foreground focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-200"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image Field */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Image className="w-4 h-4 text-river-600" />
                Cover Image
              </label>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setImagePreview(null);
                        setBlogData((prev) => ({
                          ...prev,
                          coverImage: null,
                          coverImageUrl: null,
                          coverImageAlt: "",
                        }));
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-river-200 rounded-xl p-8 text-center cursor-pointer hover:border-river-400 hover:bg-river-50/50 transition-all duration-200 group"
                  >
                    <Upload className="mx-auto h-12 w-12 text-river-400 mb-4 group-hover:text-river-600 transition-colors duration-200" />
                    <p className="text-foreground font-medium">
                      Click to upload cover image
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {isUploading && (
                  <div className="text-center py-3 bg-river-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-river-600"></div>
                      <p className="text-sm text-river-600 font-medium">
                        Uploading and optimizing image...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Alt Text Field */}
            {blogData.coverImageUrl && (
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Image className="w-4 h-4 text-river-600" />
                  Image Alt Text
                </label>
                <Input
                  type="text"
                  placeholder="Describe the image for accessibility..."
                  value={blogData.coverImageAlt}
                  onChange={(e) =>
                    handleInputChange("coverImageAlt", e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Help screen readers understand your image
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSave("draft")}
                  disabled={isUploading}
                  className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>

                <Button
                  onClick={() => handleSave("published")}
                  disabled={isUploading || !blogData.title.trim()}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Send className="h-4 w-4" />
                  Publish Blog
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="sticky top-8">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-river-600" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Live Preview
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  See how your story will look to readers
                </p>
              </div>

              <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30 shadow-lg max-h-[80vh] overflow-y-auto">
                {renderPreview()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
