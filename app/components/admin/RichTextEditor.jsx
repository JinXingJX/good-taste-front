import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// WARNING: This component uses deprecated APIs and has potential security risks.
// It is strongly recommended to replace this with a modern rich text editor library
// like TipTap, Slate, Quill, TinyMCE, etc.

export default function RichTextEditor({ value, onChange, placeholder }) {
  const { t } = useTranslation(['admin']);
  const editorRef = useRef(null);
  const [showSource, setShowSource] = useState(false);
  const [content, setContent] = useState(value || '');

  // [...] (Event handlers using document.execCommand)

  // WARNING: document.execCommand is obsolete and should not be used.
  // Modern browsers may not support it consistently, and it lacks features.
  const handleBold = () => {
    document.execCommand('bold', false, null);
    editorRef.current.focus();
  };
  // ... other execCommand handlers (handleItalic, handleUnderline, etc.) ...

  const handleToggleSource = () => {
    if (!showSource) {
      const currentContent = editorRef.current.innerHTML;
      setContent(currentContent);
    }
    setShowSource(!showSource);
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange(newContent); // Propagate changes up
    }
  };

  const handleSourceInput = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent); // Propagate changes up
  };

  useEffect(() => {
    // Sync external value changes to the editor *only if not in source mode*
    if (editorRef.current && !showSource && editorRef.current.innerHTML !== value) {
        // Be cautious with direct manipulation, might interfere with editor state
        editorRef.current.innerHTML = value || '';
        // Update local state if necessary, though onChange should handle parent state
        // setContent(value || '');
    } else if (showSource && content !== value) {
        // Sync external value to textarea if in source mode
        setContent(value || '');
    }
  }, [value]); // Dependency array includes 'value' and 'showSource'

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar (Buttons using handleBold, handleItalic etc.) */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* ... Toolbar buttons ... */}
         <button
          type="button"
          onClick={handleToggleSource}
          className={`p-2 rounded-md hover:bg-gray-200 ${
            showSource ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
          }`}
          title={t('admin:editor.toggleSource')}
        >
           {/* ... icon ... */}
        </button>
      </div>

      {/* Editing Area */}
      {showSource ? (
        <textarea
          value={content} // Use state for controlled component
          onChange={handleSourceInput}
          className="w-full p-4 min-h-[300px] resize-y border-0 focus:ring-0 focus:outline-none font-mono text-sm"
          placeholder={placeholder}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          className="w-full p-4 min-h-[300px] focus:outline-none prose max-w-none" // Added Tailwind Prose for basic styling
          onInput={handleEditorInput}
          // WARNING: Using dangerouslySetInnerHTML with contentEditable and execCommand
          // can be a security risk (XSS). Proper sanitization is crucial if keeping this pattern,
          // but replacement with a library that handles this is safer.
          dangerouslySetInnerHTML={{ __html: value || '' }} // Initialize with prop value
        />
      )}
    </div>
  );
}