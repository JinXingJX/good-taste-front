import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RichTextEditor from './RichTextEditor';

export default function ContentEditor({ 
  initialContent = '',
  onSave,
  placeholder,
  label,
  isLoading = false
}) {
  const { t } = useTranslation(['admin', 'common']);
  const [content, setContent] = useState(initialContent);
  const [isDirty, setIsDirty] = useState(false);
  
  // Handle content change
  const handleContentChange = (newContent) => {
    setContent(newContent);
    setIsDirty(true);
  };
  
  // Handle save
  const handleSave = () => {
    onSave(content);
    setIsDirty(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {label && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
        </div>
      )}
      
      <div className="p-6">
        <RichTextEditor
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder || t('admin:editor.placeholder')}
        />
        
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={!isDirty || isLoading}
            className={`px-4 py-2 flex items-center rounded-md font-medium ${
              isDirty && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? t('admin:saving') : t('common:buttons.save')}
          </button>
        </div>
      </div>
    </div>
  );
}