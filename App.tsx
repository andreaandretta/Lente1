
import React, { useState } from 'react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { GeminiAIPanel } from './components/GeminiAIPanel';
import { DeploymentGuide } from './components/DeploymentGuide';
import { IncomingCallHandler } from './components/IncomingCallHandler';
import { CallTestingPanel } from './components/CallTestingPanel';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col items-center">
      {/* HEADER */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-400">LENTE v2.0</h1>
        <p className="text-slate-400">Click-to-Chat System Active</p>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-md bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-700">
        <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Pannello di Controllo</h2>
        
        {/* I COMPONENTI REALI */}
        <IncomingCallHandler />
        <CallNotificationModal />
        
        {/* QUESTO DEVE ESSERE VISIBILE SEMPRE */}
        <div className="mt-4">
          <CallTestingPanel />
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
