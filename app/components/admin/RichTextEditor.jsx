import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// 注意：此组件需要在实际项目中引入一个富文本编辑器库
// 例如：TinyMCE, CKEditor, Quill, Draft.js 等
// 下面的实现是一个简化版，用于演示目的

export default function RichTextEditor({ value, onChange, placeholder }) {
  const { t } = useTranslation(['admin']);
  const editorRef = useRef(null);
  const [showSource, setShowSource] = useState(false);
  const [content, setContent] = useState(value || '');
  
  // 处理内容变化
  const handleContentChange = (newContent) => {
    setContent(newContent);
    onChange(newContent);
  };
  
  // 添加粗体
  const handleBold = () => {
    document.execCommand('bold', false, null);
    editorRef.current.focus();
    // 实际项目中应该获取编辑器的更新内容并传递给 onChange
  };
  
  // 添加斜体
  const handleItalic = () => {
    document.execCommand('italic', false, null);
    editorRef.current.focus();
  };
  
  // 添加下划线
  const handleUnderline = () => {
    document.execCommand('underline', false, null);
    editorRef.current.focus();
  };
  
  // 添加链接
  const handleLink = () => {
    const url = prompt(t('admin:editor.enterUrl'), 'https://');
    if (url) {
      document.execCommand('createLink', false, url);
    }
    editorRef.current.focus();
  };
  
  // 添加无序列表
  const handleUnorderedList = () => {
    document.execCommand('insertUnorderedList', false, null);
    editorRef.current.focus();
  };
  
  // 添加有序列表
  const handleOrderedList = () => {
    document.execCommand('insertOrderedList', false, null);
    editorRef.current.focus();
  };
  
  // 切换源代码视图
  const handleToggleSource = () => {
    // 如果从编辑视图切换到源码视图，需要先获取当前内容
    if (!showSource) {
      const currentContent = editorRef.current.innerHTML;
      setContent(currentContent);
    }
    setShowSource(!showSource);
  };
  
  // 文本编辑器内容变化处理
  const handleEditorInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange(newContent);
    }
  };
  
  // 源代码文本框变化处理
  const handleSourceInput = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent);
  };
  
  // 同步内容到编辑器
  useEffect(() => {
    if (editorRef.current && !showSource) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, showSource]);
  
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* 工具栏 */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={handleBold}
          className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
          title={t('admin:editor.bold')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={handleItalic}
          className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
          title={t('admin:editor.italic')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={handleUnderline}
          className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
          title={t('admin:editor.underline')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <span className="border-r border-gray-300 mx-1 h-6"></span>
        
        <button
          type="button"
          onClick={handleLink}
          className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
          title={t('admin:editor.link')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={handleUnorderedList}
          className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
          title={t('admin:editor.bulletList')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={handleOrderedList}
          className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
          title={t('admin:editor.numberedList')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <span className="border-r border-gray-300 mx-1 h-6"></span>
        
        <button
          type="button"
          onClick={handleToggleSource}
          className={`p-2 rounded-md hover:bg-gray-200 ${
            showSource ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
          }`}
          title={t('admin:editor.toggleSource')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      </div>
      
      {/* 编辑区域 */}
      {showSource ? (
        <textarea
          value={content}
          onChange={handleSourceInput}
          className="w-full p-4 min-h-[300px] resize-y border-0 focus:ring-0 focus:outline-none"
          placeholder={placeholder}
        ></textarea>
      ) : (
        <div
          ref={editorRef}
          contentEditable
          className="w-full p-4 min-h-[300px] focus:outline-none"
          onInput={handleEditorInput}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      )}
    </div>
  );
}