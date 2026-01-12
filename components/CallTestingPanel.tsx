
import React, { useState } from 'react';

/**
 * CallTestingPanel - Componente per testare le chiamate in arrivo
 *
 * Questo componente permette di simulare chiamate in arrivo per testare
 * il sistema senza bisogno di un telefono reale o emulatore Android.
 *
 * UTILIZZO IN DEV MODE:
 * - Inserisci un numero di telefono nel formato +39...
 * - Clicca "Simula Chiamata"
 * - Verrà chiamata window.handleIncomingCall() come farebbe Android
 *
 * IN PRODUZIONE:
 * Questo pannello viene nascosto automaticamente quando NODE_ENV !== 'development'
 */
export const CallTestingPanel: React.FC = () => {
  const [testNumber, setTestNumber] = useState('+393471234567');

  const simulateIncomingCall = () => {
    if (typeof window.handleIncomingCall === 'function') {
      console.log('[TEST] Simulating incoming call from:', testNumber);
      window.handleIncomingCall(testNumber);
    } else {
      console.error('[TEST] window.handleIncomingCall is not defined!');
      alert('ERROR: window.handleIncomingCall is not defined. Make sure IncomingCallHandler is mounted.');
    }
  };

  const testNumbers = [
    { label: 'Numero Italiano', value: '+393471234567' },
    { label: 'Numero USA', value: '+15551234567' },
    { label: 'Numero UK', value: '+447911123456' },
    { label: 'Numero Corto', value: '+391234567' },
  ];

  // Hide in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-slate-900 border border-indigo-600 rounded-2xl shadow-2xl p-6 max-w-sm z-[999]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="text-white font-bold text-lg">Call Tester</h3>
        <span className="ml-auto text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">DEV</span>
      </div>

      <div className="space-y-3">
        {/* Quick Test Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {testNumbers.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setTestNumber(item.value)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg transition-all border border-slate-700"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Custom Number Input */}
        <div>
          <label className="text-xs text-slate-400 block mb-2">Numero personalizzato:</label>
          <input
            type="text"
            value={testNumber}
            onChange={(e) => setTestNumber(e.target.value)}
            placeholder="+39..."
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Simulate Button */}
        <button
          onClick={simulateIncomingCall}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <i className="fas fa-phone-alt"></i>
          <span>Simula Chiamata</span>
        </button>

        {/* Console Test Info */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-2">
            <i className="fas fa-terminal mr-1"></i>
            Test dalla Console:
          </p>
          <code className="text-xs text-green-400 bg-slate-950 block p-2 rounded font-mono whitespace-pre-wrap break-all">
            window.handleIncomingCall('{testNumber}')
          </code>
        </div>
      </div>
    </div>
  );
};
