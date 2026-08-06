import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { AIRewordTextarea } from './AIRewordTextarea';

interface InputWithSuggestionsProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChangeValue: (val: string) => void;
  suggestions: string[];
  id: string;
}

export const InputWithSuggestions: React.FC<InputWithSuggestionsProps> = ({
  value,
  onChangeValue,
  suggestions,
  id,
  placeholder,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unselectedSuggestions = suggestions.filter((s) => s !== value);
  const showPopover = isFocused && unselectedSuggestions.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        {...props}
        id={id}
        list={`${id}-datalist`}
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        className={className}
      />
      <datalist id={`${id}-datalist`}>
        {suggestions.map((item, idx) => (
          <option key={idx} value={item} />
        ))}
      </datalist>

      {showPopover && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-slate-900/95 border border-blue-500/40 rounded-xl p-2.5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-300 uppercase tracking-wider mb-2 px-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Click example to populate (or type your own):</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
            {unselectedSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChangeValue(item);
                  setIsFocused(false);
                }}
                className="text-left text-xs px-3 py-1.5 rounded-lg border bg-slate-800/90 border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:border-blue-500/50 hover:text-white transition flex items-center gap-1.5"
              >
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface TextareaWithSuggestionsProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChangeValue: (val: string) => void;
  suggestions: string[];
  id: string;
  rows?: number;
}

export const TextareaWithSuggestions: React.FC<TextareaWithSuggestionsProps> = ({
  value,
  onChangeValue,
  suggestions,
  id,
  rows = 4,
  placeholder,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unselectedSuggestions = suggestions.filter((s) => s !== value);
  const showPopover = isFocused && unselectedSuggestions.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <AIRewordTextarea
        {...props}
        id={id}
        rows={rows}
        value={value}
        onValueChange={onChangeValue}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        className={className}
      />

      {showPopover && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-slate-900/95 border border-blue-500/40 rounded-xl p-2.5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-300 uppercase tracking-wider mb-2 px-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Click example response to populate (or type your own):</span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {unselectedSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChangeValue(item);
                  setIsFocused(false);
                }}
                className="w-full text-left text-xs p-2 rounded-lg bg-slate-800/90 border border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:border-blue-500/50 hover:text-white transition leading-relaxed"
              >
                "{item}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
