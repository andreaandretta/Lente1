
import React, { useState, useEffect } from 'react';

const CONTACTS = [
  { number: "+393471234567", name: "Mario Rossi", photo: "https://picsum.photos/200/200?random=1" },
  { number: "+393339876543", name: "Giulia Bianchi", photo: "https://picsum.photos/200/200?random=2" },
  { number: "+393290001112", name: "Luca Verdi", photo: "https://picsum.photos/200/200?random=3" },
];

export const PhoneSimulator: React.FC = () => {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [missedCall, setMissedCall] = useState<typeof CONTACTS[0] | null>(null);
  const [notification, setNotification] = useState(false);
  const [loadingScraper, setLoadingScraper] = useState(false);

  const simulateCall = () => {
    setIsCalling(true);
    setMissedCall(null);
    setNotification(false);
    
    setTimeout(() => {
      setIsCalling(false);
      const randomContact = CONTACTS[Math.floor(Math.random() * CONTACTS.length)];
      setMissedCall(randomContact);
      setLoadingScraper(true);
      
      // Simulate Worker delay
      setTimeout(() => {
        setLoadingScraper(false);
        setNotification(true);
      }, 2000);
    }, 4000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-center justify-center p-4">
      <div className="flex flex-col gap-6 max-w-md">
        <h2 className="text-3xl font-bold text-white">Interactive Simulator</h2>
        <p className="text-slate-400">
          Experience how Lente works in real-time. This virtual environment mimics the Android BroadcastReceiver and WorkManager workflow.
        </p>
        
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h3 className="font-semibold text-indigo-400 mb-2">Instructions</h3>
            <ol className="text-sm text-slate-400 list-decimal list-inside space-y-1">
              <li>Grant permissions in the simulated onboarding.</li>
              <li>Trigger a "Simulated Call".</li>
              <li>Wait for the caller to hang up.</li>
              <li>Observe the Lente scraper extracting the WhatsApp profile.</li>
            </ol>
          </div>
          
          <button 
            disabled={!onboardingDone || isCalling || loadingScraper}
            onClick={simulateCall}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${!onboardingDone ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}
          >
            <i className="fas fa-phone-alt"></i>
            {isCalling ? 'Call Incoming...' : loadingScraper ? 'Scraping WhatsApp...' : 'Simulate Call'}
          </button>
        </div>
      </div>

      {/* Phone Frame */}
      <div className="relative w-[320px] h-[640px] bg-slate-800 rounded-[3rem] border-[8px] border-slate-700 shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-700 rounded-b-2xl z-20"></div>
        
        {/* Screen Content */}
        <div className="absolute inset-0 bg-slate-900 flex flex-col pt-12">
          {!onboardingDone ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl animate-bounce">
                <i className="fas fa-search-plus text-3xl text-white"></i>
              </div>
              <h1 className="text-2xl font-black text-white mb-2">LENTE</h1>
              <p className="text-slate-400 text-sm mb-8">Scopri chi ti chiama tramite la sua foto profilo WhatsApp.</p>
              
              <div className="w-full space-y-3 mb-8">
                <div className="flex items-center gap-3 text-xs text-left bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <i className="fas fa-shield-alt text-indigo-400"></i>
                  <span>Permessi Telefono & Notifiche necessari.</span>
                </div>
              </div>

              <button 
                onClick={() => setOnboardingDone(true)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-colors"
              >
                Inizia Ora
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col relative">
              {/* Status Bar */}
              <div className="flex justify-between px-6 py-2 text-[10px] font-bold text-slate-500">
                <span>12:45</span>
                <div className="flex gap-1">
                  <i className="fas fa-wifi"></i>
                  <i className="fas fa-battery-full"></i>
                </div>
              </div>

              {/* Wallpaper */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-slate-900 -z-10"></div>

              {/* Notification Overlay */}
              {notification && missedCall && (
                <div className="absolute top-12 left-2 right-2 bg-slate-800/95 backdrop-blur-lg border border-slate-700 rounded-2xl p-3 shadow-2xl animate-slide-down flex items-center gap-4 z-50">
                  <img src={missedCall.photo} alt="profile" className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Lente Scraper</p>
                    <p className="text-sm font-bold text-white truncate">{missedCall.name}</p>
                    <p className="text-xs text-slate-400 truncate">{missedCall.number}</p>
                  </div>
                  <button className="bg-green-600 p-2 rounded-lg text-white">
                    <i className="fab fa-whatsapp"></i>
                  </button>
                </div>
              )}

              {/* Call Overlay */}
              {isCalling && (
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-8 z-40">
                  <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mb-6 animate-pulse border-4 border-indigo-500/30">
                    <i className="fas fa-user text-4xl text-slate-400"></i>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Chiamata In Arrivo</h2>
                  <p className="text-slate-400 animate-pulse">+39 347 *** ** 67</p>
                  
                  <div className="mt-20 flex justify-center gap-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                        <i className="fas fa-phone-slash text-xl"></i>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Rifiuta</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                        <i className="fas fa-phone text-xl"></i>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Rispondi</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Main App State */}
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                 <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-center">
                   <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                     <i className="fas fa-check"></i>
                   </div>
                   <p className="text-sm font-semibold text-white">Lente è Attivo</p>
                   <p className="text-xs text-slate-500 mt-1">In attesa di intercettare la prossima chiamata persa...</p>
                 </div>
              </div>

              {/* Home Indicator */}
              <div className="h-1.5 w-32 bg-slate-700 rounded-full mx-auto mb-2"></div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};
