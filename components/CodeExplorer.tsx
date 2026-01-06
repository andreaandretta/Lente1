
import React, { useState } from 'react';
import { ANDROID_FILES } from '../constants/androidProject';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState(ANDROID_FILES[4]); // Default to MainActivity.kt

  return (
    <div className="flex flex-col h-[700px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-800 flex flex-col bg-slate-950/50">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Files</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {ANDROID_FILES.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${selectedFile.path === file.path ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <i className={`${file.language === 'kotlin' ? 'fas fa-file-code text-orange-400' : 'fas fa-file-alt text-slate-500'}`}></i>
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">{selectedFile.path}</span>
            </div>
            <button 
              onClick={() => {
                const blob = new Blob([selectedFile.content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = selectedFile.name;
                a.click();
              }}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <i className="fas fa-download mr-1"></i> Download
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-6 bg-[#0d1117] font-mono text-sm leading-relaxed">
            <pre className="text-slate-300">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
