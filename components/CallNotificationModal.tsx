
import React from 'react';

interface CallNotificationModalProps {
  isVisible: boolean;
  phoneNumber: string;
  profilePhoto: string | null;
  callType: 'incoming' | 'outgoing';
  onOpenWhatsApp: () => void;
  onDismiss: () => void;
}

export const CallNotificationModal: React.FC<CallNotificationModalProps> = ({
  isVisible,
  phoneNumber,
  profilePhoto,
  callType,
  onOpenWhatsApp,
  onDismiss,
}) => {
  if (!isVisible) return null;

  // Dynamic content based on call type
  const isOutgoing = callType === 'outgoing';
  const iconColor = isOutgoing ? 'bg-blue-500' : 'bg-green-500';
  const iconBorder = isOutgoing ? 'border-blue-500' : 'border-green-500';
  const title = isOutgoing ? 'STAI CHIAMANDO...' : 'CHIAMATA IN CORSO';
  const subtitle = isOutgoing ? 'Vuoi scrivere su WhatsApp invece?' : 'Chiamata rilevata da Android';
  const numberLabel = isOutgoing ? 'Numero che stai chiamando' : 'Numero chiamante';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl border border-slate-700 p-8 max-w-md w-full mx-4 animate-scaleIn">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 ${iconColor} rounded-full mb-4 animate-pulse`}>
            <i className="fas fa-phone text-white text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>

        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className={`w-32 h-32 rounded-full border-4 ${iconBorder} shadow-lg object-cover`}
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-slate-600 bg-slate-700 flex items-center justify-center">
              <i className="fas fa-user text-slate-400 text-5xl"></i>
            </div>
          )}
        </div>

        {/* Phone Number */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-center border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">{numberLabel}</p>
          <p className="text-2xl font-mono font-bold text-white tracking-wider">{phoneNumber}</p>
        </div>

        {/* WhatsApp Info */}
        <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <i className="fab fa-whatsapp text-green-400 text-2xl mt-1"></i>
            <div className="flex-1">
              <p className="text-sm text-green-400 font-semibold mb-1">
                {isOutgoing ? "💡 Suggerimento WhatsApp" : "WhatsApp Quick Access"}
              </p>
              <p className="text-xs text-slate-400">
                {isOutgoing
                  ? "Evita la chiamata! Scrivi direttamente su WhatsApp senza salvare il numero in rubrica."
                  : profilePhoto
                  ? "Profilo trovato! Clicca per aprire la chat."
                  : "Clicca per cercare questo numero su WhatsApp."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onOpenWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <i className="fab fa-whatsapp text-xl"></i>
            <span>{isOutgoing ? "Scrivi su WhatsApp" : "Apri WhatsApp"}</span>
          </button>
          <button
            onClick={onDismiss}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            <i className="fas fa-info-circle mr-1"></i>
            {isOutgoing
              ? "Questa notifica viene attivata dall'OutgoingCallReceiver di Android"
              : "Questa notifica viene attivata dal PhoneStateListener di Android"}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
