
import React from 'react';
import { Globe } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-white animate-pulse" />
            <h1 className="text-white text-xl font-bold">Website Cloner</h1>
          </div>
          <div className="hidden md:block">
            <div className="text-white/80 text-sm">
              Clone any public website instantly
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
