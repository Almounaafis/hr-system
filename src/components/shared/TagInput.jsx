import { useState } from 'react';
import { X, Plus } from 'lucide-react';

export function TagInput({ 
  tags, 
  setTags, 
  inputPlaceholder = "ادخل اسم", 
  label = "العناصر" 
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      setTags([...tags, input.trim()]);
      setInput('');
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder={inputPlaceholder}
          className="flex-1 min-w-0 px-4 h-12 border border-input focus:border-primary focus:ring-primary rounded-xl"
        />
        <button
          type="button"
          onClick={addTag}
          className="shrink-0 w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center justify-center"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg"
          >
            <span className="text-sm">{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-primary/80"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
