import React, { useState } from 'react';

export const CallTestingPanel: React.FC = () => {
  const [number, setNumber] = useState('+393331234567');

  const triggerIncoming = () => {
    if (window.handleIncomingCall) window.handleIncomingCall(number);
    else alert('Handler not found!');
  };

  const triggerOutgoing = () => {
    if (window.handleOutgoingCall) window.handleOutgoingCall(number);
    else alert('Handler not found!');
  };

  return (
    <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 w-full">
      <h3 className="text-white font-bold mb-3">🎮 Call Simulator</h3>
      <input 
        type="text" 
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        className="w-full p-2 mb-4 bg-slate-900 text-white rounded border border-slate-600"
      />
      <div className="grid grid-cols-2 gap-4">
        <button onClick={triggerIncoming} className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded font-bold transition">
          📞 INCOMING (Verde)
        </button>
        <button onClick={triggerOutgoing} className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-bold transition">
          📲 OUTGOING (Blu)
        </button>
      </div>
    </div>
  );
};
