import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Save, Upload, Send, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import TextEditor from "../components/TextEditor";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function CreateBlog() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
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
        alert(`Error uploading image: ${error.message}`);
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
        alert("Please log in to save your blog post.");
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
        alert(
          isEditMode
            ? "Blog updated and published successfully!"
            : "Blog published successfully!"
        );
        navigate(`/blog/${isEditMode ? id : response.data.id}`);
      } else {
        alert(
          isEditMode
            ? "Draft updated successfully!"
            : "Draft saved successfully!"
        );
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert(`Error saving blog: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const renderPreview = () => {
    return (
      <div className="space-y-6">
        {(imagePreview || blogData.coverImageUrl) && (
          <img
            src={imagePreview || blogData.coverImageUrl}
            alt={blogData.coverImageAlt || "Cover"}
            className="w-full h-64 object-cover rounded-lg"
          />
        )}
        <h1 className="text-3xl font-bold">
          {blogData.title || "Your Blog Title"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {blogData.excerpt || "Your blog excerpt..."}
        </p>
        <div
          className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic"
          dangerouslySetInnerHTML={{
            __html:
              blogData.content || "<p>Start writing your blog content...</p>",
          }}
        />
        {blogData.tags && (
          <div className="flex flex-wrap gap-2">
            {blogData.tags.split(",").map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
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
      <div className="max-w-full mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Update your blog post"
            : "Share your thoughts and stories with the community"}
        </p>
      </div>

      <div className="flex gap-8 h-screen">
        <div className="w-1/2 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              type="text"
              placeholder="Enter your blog title..."
              value={blogData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <Input
              type="text"
              placeholder="Add tags..."
              value={blogData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Content</label>
            <TextEditor
              key={isEditMode ? `edit-${editId}` : "create"}
              value={blogData.content}
              onChange={(content) => handleInputChange("content", content)}
              placeholder="Start writing your masterpiece..."
              height="500px"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <Textarea
              placeholder="Write a short description of your blog..."
              value={blogData.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={blogData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full p-2 border rounded-md bg-input-background"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Cover Image
            </label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="secondary"
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
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">Click to upload cover image</p>
                  <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
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
                <div className="text-center py-2">
                  <p className="text-sm text-blue-600">
                    Uploading and optimizing image...
                  </p>
                </div>
              )}
            </div>
          </div>

          {blogData.coverImageUrl && (
            <div>
              <label className="block text-sm font-medium mb-2">
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
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>

            <Button
              onClick={() => handleSave("published")}
              disabled={isUploading || !blogData.title.trim()}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>

        <div className="w-1/2 border-l pl-8">
          <div className="sticky top-0 bg-white pb-4 mb-6">
            <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
            <p className="text-sm text-gray-600">
              Your content will be rendered here as you type.
            </p>
          </div>

          <div className="overflow-y-auto h-full">{renderPreview()}</div>
        </div>
      </div>
    </div>
  );
}
