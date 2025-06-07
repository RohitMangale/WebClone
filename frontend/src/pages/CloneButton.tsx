
import React from 'react';
import { Download } from 'lucide-react';

interface CloneButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
}

const CloneButton: React.FC<CloneButtonProps> = ({ onClick, loading, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-102 ${
        disabled || loading
          ? 'bg-gray-400 cursor-not-allowed scale-100'
          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
      }`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Cloning...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Download className="w-5 h-5 mr-2" />
          Clone Website
        </div>
      )}
    </button>
  );
};

export default CloneButton;