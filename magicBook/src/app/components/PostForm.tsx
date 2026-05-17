import { useState } from 'react';
import { Send, X } from 'lucide-react';

interface PostFormProps {
  onSubmit: (content: string) => void;
  justPosted: boolean;
  onClose?: () => void;
}

export function PostForm({ onSubmit, justPosted, onClose }: PostFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  const charCount = content.length;
  const maxChars = 500;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      )}

      <h2 className="text-gray-900 text-xl font-bold mb-4">写下你的心声</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你想说的话..."
            className="w-full h-48 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            maxLength={maxChars}
            autoFocus
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {charCount}/{maxChars}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            发布后自动匹配相似内容
          </span>

          <button
            type="submit"
            disabled={!content.trim() || justPosted}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
            {justPosted ? '发布成功' : '发布'}
          </button>
        </div>
      </form>
    </div>
  );
}
