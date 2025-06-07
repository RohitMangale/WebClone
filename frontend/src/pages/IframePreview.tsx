
import React from 'react';
import { Eye } from 'lucide-react';

interface IframePreviewProps {
  html: string | null;
  loading: boolean;
}

const IframePreview: React.FC<IframePreviewProps> = ({ html, loading }) => {
  if (loading) {
    return (
      <div className="w-full h-96 border border-gray-200 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 animate-pulse">Cloning website...</p>
        </div>
      </div>
    );
  }

  if (!html) {
    return (
      <div className="w-full h-96 border border-gray-200 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex flex-col items-center text-center">
          <Eye className="h-12 w-12 text-gray-400 mb-4 animate-pulse" />
          <p className="text-gray-500">Preview will appear here after cloning</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-blue-600" />
          Cloned Website Preview
        </h3>
        <div className="text-sm text-gray-500">
          Scroll to explore the cloned content
        </div>
      </div>
      <iframe
        srcDoc={html}
        className="w-full h-96 md:h-[600px] border border-gray-200 rounded-lg shadow-sm transform transition-all duration-300 hover:shadow-lg"
        title="Cloned Website Preview"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
};

export default IframePreview;