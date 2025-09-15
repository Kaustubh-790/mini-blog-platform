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
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      const img = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto; border-radius: 4px; margin: 1em 0;" />`;
      executeCommand("insertHTML", img);
    }
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
          className="border rounded-lg p-4 bg-gray-50"
          style={{ minHeight: height }}
        >
          <p className="text-gray-500">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-editor">
      <style jsx>{`
        .text-editor .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          padding: 8px;
          border: 1px solid #ccc;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          background-color: #f8f9fa;
        }

        .text-editor .toolbar button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .text-editor .toolbar button:hover {
          background-color: #e9ecef;
          border-color: #007bff;
        }

        .text-editor .toolbar button.active {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }

        .text-editor .toolbar .separator {
          width: 1px;
          height: 24px;
          background-color: #ddd;
          margin: 0 4px;
        }

        .text-editor .editor {
          min-height: ${height};
          padding: 16px;
          border: 1px solid #ccc;
          border-radius: 0 0 8px 8px;
          font-size: 16px;
          line-height: 1.6;
          outline: none;
          background: white;
          direction: ltr;
          text-align: left;
          unicode-bidi: normal;
        }

        .text-editor .editor:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .text-editor .editor ul,
        .text-editor .editor ol {
          margin: 1em 0;
          padding-left: 2em;
        }

        .text-editor .editor li {
          margin: 0.5em 0;
          line-height: 1.6;
        }

        .text-editor .editor ul li {
          list-style-type: disc;
        }

        .text-editor .editor ol li {
          list-style-type: decimal;
        }

        .text-editor .editor[contenteditable="false"] {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        .text-editor .editor:empty:before {
          content: attr(data-placeholder);
          color: #999;
          font-style: italic;
        }

        .text-editor .editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }

        .text-editor .editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }

        .text-editor .editor h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }

        .text-editor .editor blockquote {
          border-left: 4px solid #ccc;
          margin: 1em 0;
          padding-left: 1em;
          color: #666;
          font-style: italic;
        }

        .text-editor .editor pre {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 1em;
          margin: 1em 0;
          overflow-x: auto;
        }

        .text-editor .editor code {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 3px;
          padding: 2px 4px;
          font-family: "Courier New", monospace;
        }

        .text-editor .editor ul,
        .text-editor .editor ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }

        .text-editor .editor li {
          margin: 0.25em 0;
        }

        .text-editor .editor img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 1em 0;
        }

        .text-editor .editor a {
          color: #007bff;
          text-decoration: underline;
        }

        .text-editor .editor a:hover {
          color: #0056b3;
        }

        .text-editor .editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }

        .text-editor .editor table td,
        .text-editor .editor table th {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        .text-editor .editor table th {
          background-color: #f5f5f5;
          font-weight: bold;
        }

        .text-editor .custom-buttons {
          margin-top: 8px;
          display: flex;
          gap: 8px;
        }

        .text-editor .custom-buttons button {
          padding: 6px 12px;
          font-size: 14px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .text-editor .custom-buttons button:hover {
          background-color: #e9ecef;
          border-color: #007bff;
        }
      `}</style>

      <div className="toolbar">
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          title="Underline (Ctrl+U)"
        >
          <Underline size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("strikeThrough")}
          title="Strikethrough"
        >
          <Type size={16} />
        </button>

        <div className="separator" />

        <button
          type="button"
          onClick={() => insertHeading(1)}
          title="Heading 1"
        >
          <Hash size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertHeading(2)}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => insertHeading(3)}
          title="Heading 3"
        >
          H3
        </button>

        <div className="separator" />

        <button
          type="button"
          onClick={() => executeCommand("justifyLeft")}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("justifyCenter")}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("justifyRight")}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>

        <div className="separator" />

        <button type="button" onClick={insertQuote} title="Quote">
          <Quote size={16} />
        </button>
        <button type="button" onClick={insertCode} title="Code Block">
          <Code size={16} />
        </button>

        <div className="separator" />

        <button
          type="button"
          onClick={() => executeCommand("removeFormat")}
          title="Remove Formatting"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div
        ref={editorRef}
        className="editor"
        contentEditable={!readOnly}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        data-placeholder={placeholder}
        dir="ltr"
        style={{ minHeight: height }}
      />

      <div className="custom-buttons">
        <button
          type="button"
          onClick={insertLink}
          className="bg-blue-100 text-blue-700 hover:bg-blue-200"
        >
          Insert Link
        </button>
        <button
          type="button"
          onClick={insertImage}
          className="bg-green-100 text-green-700 hover:bg-green-200"
        >
          Insert Image
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
