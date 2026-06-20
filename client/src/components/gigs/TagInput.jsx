import { useState } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';

const TagInput = ({ tags = [], onChange, min = 3, max = 5 }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const addTag = (value) => {
    const tag = value.trim().toLowerCase();
    if (!tag) return;
    if (tags.includes(tag)) {
      setError('Tag already exists');
      return;
    }
    if (tags.length >= max) {
      setError(`Maximum ${max} tags allowed`);
      return;
    }
    setError('');
    onChange([...tags, tag]);
    setInput('');
  };

  const removeTag = (index) => {
    onChange(tags.filter((_, i) => i !== index));
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <span key={i} className="inline-flex items-center space-x-1 bg-teal-50 text-gig-teal px-3 py-1 rounded-full text-sm font-medium">
            <span>{tag}</span>
            <button type="button" onClick={() => removeTag(i)} className="hover:text-red-500">
              <FaTimes size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a tag and press Enter"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none text-sm"
        />
        <button
          type="button"
          onClick={() => addTag(input)}
          className="px-3 py-2 bg-gig-teal text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          <FaPlus size={14} />
        </button>
      </div>
      <div className="flex items-center justify-between mt-1">
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <p className="text-gray-400 text-xs ml-auto">{tags.length}/{max} tags</p>
      </div>
    </div>
  );
};

export default TagInput;
