
import React, { useState } from 'react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { GeminiAIPanel } from './components/GeminiAIPanel';
import { DeploymentGuide } from './components/DeploymentGuide';
import { IncomingCallHandler } from './components/IncomingCallHandler';
import { CallTestingPanel } from './components/CallTestingPanel';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'ai' | 'deploy'>('simulator');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <i className="fas fa-search-plus text-white text-xl"></i>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">LENTE</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded border border-slate-700 text-xs font-mono text-slate-400">v1.0.0-PRO</span>
            </div>
            
            <div className="flex gap-1 bg-slate-800 p-1 rounded-xl overflow-x-auto">
              <button 
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'simulator' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                <i className="fas fa-mobile-alt mr-2"></i>Simulator
              </button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'code' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                <i className="fas fa-code mr-2"></i>Android Code
              </button>
              <button 
                onClick={() => setActiveTab('deploy')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'deploy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                <i className="fas fa-rocket mr-2"></i>Deploy Guide
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'ai' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                <i className="fas fa-magic mr-2"></i>AI Analysis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start p-6">
        <div className="w-full max-w-7xl h-full">
          {activeTab === 'simulator' && <PhoneSimulator />}
          {activeTab === 'code' && <CodeExplorer />}
          {activeTab === 'ai' && <GeminiAIPanel />}
          {activeTab === 'deploy' && <DeploymentGuide />}
        </div>
      </main>

      {/* Incoming Call Handler - Always mounted to receive Android calls */}
      <IncomingCallHandler />

      {/* Call Testing Panel - Only visible in development mode */}
      <CallTestingPanel />

      {/* Footer */}
      <footer className="p-6 border-t border-slate-800 bg-slate-900/30 text-center text-slate-500 text-sm">
        <p>© 2024 LENTE Project • Built with React & Android Kotlin Best Practices</p>
      </footer>
    </div>
  );
};

export default App;
