import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Upload, Send, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import RichTextEditor from "../components/RichTextEditor";
import { useAuth } from "../contexts/AuthContext";

export default function CreateBlog() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [blogData, setBlogData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    category: "General",
    coverImage: null,
    status: "draft",
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

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

  const handleInputChange = (field, value) => {
    setBlogData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBlogData((prev) => ({
        ...prev,
        coverImage: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (publishStatus = "draft") => {
    try {
      setIsUploading(true);

      if (!user) {
        alert("Please log in to save your blog post.");
        return;
      }

      // Prepare data for API
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
      };

      // Get auth token
      const token = await user.getIdToken();

      // Call API to create post
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api"
        }/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save blog post");
      }

      if (publishStatus === "published") {
        alert("Blog published successfully!");
        navigate("/");
      } else {
        alert("Draft saved successfully!");
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
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Cover"
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

  return (
    <div className="max-w-full mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Blog Post
        </h1>
        <p className="text-gray-600">
          Share your thoughts and stories with the community
        </p>
      </div>

      <div className="flex gap-8 h-screen">
        {/* Left Side - Editor */}
        <div className="w-1/2 space-y-6 overflow-y-auto">
          {/* Title */}
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

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <Input
              type="text"
              placeholder="Add tags..."
              value={blogData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
            />
          </div>

          {/* Content Editor */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Content</label>
            <RichTextEditor
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
                      setBlogData((prev) => ({ ...prev, coverImage: null }));
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
            </div>
          </div>

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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                {showPreview ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Your content will be rendered here as you type.
            </p>
          </div>

          <div className="overflow-y-auto h-full">
            {showPreview ? (
              renderPreview()
            ) : (
              <div className="text-center text-gray-500 py-20">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click "Show Preview" to see your content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
