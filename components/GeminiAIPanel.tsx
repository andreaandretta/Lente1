
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

export const GeminiAIPanel: React.FC = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Explain the architecture of this Android Lente app. 
        Focus on how CallReceiver, WhatsAppScraperWorker, and Jsoup work together 
        to extract the profile image. Be concise and technical.`,
      });
      setAnalysis(response.text || "No response received.");
    } catch (error) {
      setAnalysis("Error: Make sure the API key is configured correctly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center">
        <h2 className="text-4xl font-black text-white mb-4">Gemini Insight</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Use the power of AI to understand the deep technical implementation and resilience of the Lente scraper logic.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8">
          {!analysis && !loading ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-brain text-4xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Request System Analysis</h3>
              <p className="text-slate-400 mb-8 px-12 text-sm">
                The model will analyze the provided Kotlin source code and explain the flow from hardware interruption to network scraping.
              </p>
              <button 
                onClick={analyzeCode}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
              >
                Start Analysis
              </button>
            </div>
          ) : loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-indigo-400 font-bold animate-pulse">Gemini is reading the project files...</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-indigo-400 font-bold m-0 uppercase tracking-widest text-sm">System Architecture Report</h3>
                <button onClick={() => setAnalysis(null)} className="text-xs text-slate-500 hover:text-white">Clear</button>
              </div>
              <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
              <div className="mt-8 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
                 <p className="text-xs text-indigo-300 font-mono italic">
                   Note: This analysis is generated in real-time by gemini-3-flash-preview based on the Kotlin source snippets provided in the explorer.
                 </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
