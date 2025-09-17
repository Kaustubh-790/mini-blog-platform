import React, { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Hash,
  Trash2,
  Link,
  Image,
  X,
  Check,
  Upload,
} from "lucide-react";

const TextEditor = ({
  value,
  onChange,
  placeholder = "Start writing your content...",
  height = "400px",
  readOnly = false,
}) => {
  const editorRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (
      isClient &&
      editorRef.current &&
      value &&
      !editorRef.current.innerHTML
    ) {
      editorRef.current.innerHTML = value;
    }
  }, [isClient, value]);

  const executeCommand = (command, value = null) => {
    if (readOnly) return;

    document.execCommand(command, false, value);
    editorRef.current?.focus();

    if (onChange) {
      onChange(editorRef.current?.innerHTML || "");
    }
  };

  const insertLink = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    setLinkText(selectedText || "");
    setLinkUrl("");
    setShowLinkModal(true);
  };

  const insertImage = () => {
    setImageUrl("");
    setImageAlt("");
    setShowImageModal(true);
  };

  const handleLinkSubmit = () => {
    if (linkUrl.trim()) {
      if (linkText.trim()) {
        const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">${linkText}</a>`;
        executeCommand("insertHTML", link);
      } else {
        executeCommand("createLink", linkUrl);
      }
      setShowLinkModal(false);
      setLinkUrl("");
      setLinkText("");
    }
  };

  const handleImageSubmit = () => {
    if (imageUrl.trim()) {
      const img = `<img src="${imageUrl}" alt="${
        imageAlt || "Image"
      }" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1em 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />`;
      executeCommand("insertHTML", img);
      setShowImageModal(false);
      setImageUrl("");
      setImageAlt("");
    }
  };

  const closeModals = () => {
    setShowLinkModal(false);
    setShowImageModal(false);
    setLinkUrl("");
    setLinkText("");
    setImageUrl("");
    setImageAlt("");
  };

  const insertHeading = (level) => {
    const heading = `<h${level}>Heading ${level}</h${level}>`;
    executeCommand("insertHTML", heading);
  };

  const insertQuote = () => {
    const quote = `<blockquote style="border-left: 4px solid #ccc; margin: 1em 0; padding-left: 1em; color: #666; font-style: italic;">Quote text</blockquote>`;
    executeCommand("insertHTML", quote);
  };

  const insertCode = () => {
    const code = `<pre style="background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; padding: 1em; margin: 1em 0; overflow-x: auto;"><code>Code here</code></pre>`;
    executeCommand("insertHTML", code);
  };

  const handleInput = (e) => {
    if (editorRef.current) {
      editorRef.current.style.direction = "ltr";
      editorRef.current.style.unicodeBidi = "normal";
    }

    if (onChange) {
      onChange(editorRef.current?.innerHTML || "");
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    executeCommand("insertText", text);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          executeCommand("bold");
          break;
        case "i":
          e.preventDefault();
          executeCommand("italic");
          break;
        case "u":
          e.preventDefault();
          executeCommand("underline");
          break;
        default:
          break;
      }
    }

    if (e.key === "Enter") {
      const selection = window.getSelection();
      if (selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      let listItem = range.commonAncestorContainer;

      while (listItem && listItem.nodeType !== Node.ELEMENT_NODE) {
        listItem = listItem.parentNode;
      }

      while (listItem && listItem.tagName !== "LI") {
        listItem = listItem.parentNode;
      }

      if (listItem) {
        const list = listItem.parentNode;
        const newItem = document.createElement("li");
        newItem.innerHTML = "<br>";

        if (listItem.nextSibling) {
          list.insertBefore(newItem, listItem.nextSibling);
        } else {
          list.appendChild(newItem);
        }

        const newRange = document.createRange();
        newRange.setStart(newItem, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        e.preventDefault();
      }
    }
  };

  const handleFocus = () => {
    if (editorRef.current) {
      editorRef.current.style.direction = "ltr";
      editorRef.current.style.unicodeBidi = "normal";
    }
  };

  if (!isClient) {
    return (
      <div className="text-editor">
        <div
          className="border rounded-lg p-4 bg-muted"
          style={{ minHeight: height }}
        >
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {(showLinkModal || showImageModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl border border-border/50 max-w-md w-full p-6 animate-fade-in-up">
            {showLinkModal && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Link className="w-5 h-5 text-river-600" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Insert Link
                  </h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Link Text
                  </label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Link text (optional)"
                    className="w-full h-10 px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full h-10 px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={closeModals}
                    className="flex-1 h-10 px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground hover:bg-muted transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLinkSubmit}
                    className="flex-1 h-10 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Insert
                  </button>
                </div>
              </div>
            )}

            {showImageModal && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Image className="w-5 h-5 text-river-600" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Insert Image
                  </h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full h-10 px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Describe the image"
                    className="w-full h-10 px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={closeModals}
                    className="flex-1 h-10 px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground hover:bg-muted transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImageSubmit}
                    className="flex-1 h-10 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Insert
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 p-3 bg-card/30 backdrop-blur-sm border-b border-border/30">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => executeCommand("bold")}
              title="Bold (Ctrl+B)"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200"
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("italic")}
              title="Italic (Ctrl+I)"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200"
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("underline")}
              title="Underline (Ctrl+U)"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200"
            >
              <Underline size={14} />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("strikeThrough")}
              title="Strikethrough"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200"
            >
              <Type size={14} />
            </button>
          </div>

          <div className="w-px h-6 bg-border/50 mx-2" />

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertHeading(1)}
              title="Heading 1"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200 text-xs font-bold"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => insertHeading(2)}
              title="Heading 2"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200 text-xs font-bold"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertHeading(3)}
              title="Heading 3"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200 text-xs font-bold"
            >
              H3
            </button>
          </div>

          <div className="w-px h-6 bg-border/50 mx-2" />

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => executeCommand("justifyLeft")}
              title="Align Left"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200"
            >
              <AlignLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("justifyCenter")}
              title="Align Center"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200"
            >
              <AlignCenter size={14} />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("justifyRight")}
              title="Align Right"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200"
            >
              <AlignRight size={14} />
            </button>
          </div>

          <div className="w-px h-6 bg-border/50 mx-2" />

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={insertQuote}
              title="Quote"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200"
            >
              <Quote size={14} />
            </button>
            <button
              type="button"
              onClick={insertCode}
              title="Code Block"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200"
            >
              <Code size={14} />
            </button>
          </div>

          <div className="w-px h-6 bg-border/50 mx-2" />

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={insertLink}
              title="Insert Link"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200"
            >
              <Link size={14} />
            </button>
            <button
              type="button"
              onClick={insertImage}
              title="Insert Image"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-river-50 hover:border-river-200 hover:text-river-600 transition-all duration-200"
            >
              <Image size={14} />
            </button>
          </div>

          <div className="w-px h-6 bg-border/50 mx-2" />

          <button
            type="button"
            onClick={() => executeCommand("removeFormat")}
            title="Remove Formatting"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 border border-border/50 text-foreground hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-all duration-200"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div
          ref={editorRef}
          contentEditable={!readOnly}
          suppressContentEditableWarning={true}
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          data-placeholder={placeholder}
          dir="ltr"
          className="min-h-[400px] p-6 text-foreground bg-background/50 focus:outline-none focus:ring-0 prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-blockquote:border-l-4 prose-blockquote:border-river-300 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-river-50/50 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-img:rounded-lg prose-img:shadow-md"
          style={{ minHeight: height }}
        />
      </div>
    </div>
  );
};

export default TextEditor;
