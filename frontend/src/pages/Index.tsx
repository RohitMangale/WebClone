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
  const [scrapedHTML, setScrapedHTML] = useState<string | null>(null);
  const [geminiHTML, setGeminiHTML] = useState<string | null>(null);
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
      return;
    } else {
      setError(undefined);
    }

    setLoading(true);
    setScrapedHTML(null);
    setGeminiHTML(null);

    try {
      const encodedURL = encodeURIComponent(url);
      const response = await fetch(`http://localhost:8000/clone?url=${encodedURL}`);

      if (!response.ok) {
        throw new Error(`Failed to clone website: ${response.status} ${response.statusText}`);
      }

      const { scraped_html, gemini_html } = await response.json();
      setScrapedHTML(scraped_html);
      setGeminiHTML(gemini_html);
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Transform Any Website</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter a public website URL to preview both the raw scraped version and Gemini-generated reconstruction.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8 transform transition-all duration-300 hover:shadow-xl animate-scale-in">
          <div className="space-y-4">
            <URLInput value={url} onChange={setUrl} error={error} />
            <CloneButton onClick={handleClone} loading={loading} disabled={loading || !url.trim()} />
          </div>
        </div>

        {/* Preview Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">🧱 Raw Scraped Version</h3>
            <IframePreview html={scrapedHTML} loading={loading} />
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">🤖 Gemini Generated Version</h3>
            <IframePreview html={geminiHTML} loading={loading} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 animate-fade-in">
          Ensure the backend is running at <code>localhost:8000</code> and returns both versions.
        </div>
      </div>
    </div>
  );
};

export default Index;
