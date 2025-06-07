"use client";
import React, { useState } from "react";
import URLInput from "./URLInput";
import CloneButton from "./CloneButton";
import IframePreview from "./IframePreview";
import Navbar from "./Navbar";
import { toast } from "sonner";

const Index = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [clonedHTML, setClonedHTML] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const isValidURL = (url: string): boolean => {
    if (!url.trim()) return false;
    if (!url.startsWith("http://") && !url.startsWith("https://")) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleClone = async () => {
    if (!isValidURL(url)) {
    setError("Please enter a valid URL");
  } else {
    setError(undefined);
  }

    setError(undefined);
    setLoading(true);
    setClonedHTML(null);

    try {
      const encodedURL = encodeURIComponent(url);
      const response = await fetch(`http://localhost:8000/clone?url=${encodedURL}`);

      if (!response.ok) {
        throw new Error(`Failed to clone website: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      setClonedHTML(html);
      toast.success("Website cloned successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to clone website";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Clone error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Transform Any Website</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter any public website URL to clone and preview its content. The cloned version will appear below for you to
            explore.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8 transform transition-all duration-300 hover:shadow-xl animate-scale-in">
          <div className="space-y-4">
            <URLInput value={url} onChange={setUrl} error={error} />
            <CloneButton onClick={handleClone} loading={loading} disabled={loading || !url.trim()} />
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transform transition-all duration-300 hover:shadow-xl">
          <IframePreview html={clonedHTML} loading={loading} />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 animate-fade-in">
          Make sure the backend server is running on localhost:8000
        </div>
      </div>
    </div>
  );
};

export default Index;
