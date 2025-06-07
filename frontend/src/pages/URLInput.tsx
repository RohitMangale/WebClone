import React from 'react';
import { Link } from 'lucide-react';

interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const URLInput: React.FC<URLInputProps> = ({ value, onChange, error }) => {
  const validateURL = (url: string): string | undefined => {
    if (!url.trim()) return 'URL is required';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'URL must start with http:// or https://';
    }
    try {
      new URL(url);
      return undefined;
    } catch {
      return 'Please enter a valid URL';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const currentError = validateURL(value);

  return (
    <div className="w-full">
      <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
        Website URL
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Link className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="url-input"
          type="url"
          value={value}
          onChange={handleChange}
          placeholder="https://example.com"
          className={`w-full pl-10 pr-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform  ${
            error || currentError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
          }`}
        />
      </div>
      {(error || currentError) && (
        <p className="mt-2 text-sm text-red-600 animate-fade-in">{error || currentError}</p>
      )}
    </div>
  );
};

export default URLInput;