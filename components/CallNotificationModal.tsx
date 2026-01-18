import React from 'react';

interface CallNotificationModalProps {
  isVisible: boolean;
  phoneNumber: string;
  callType: 'incoming' | 'outgoing';
  profilePhoto: string | null;
  onOpenWhatsApp: () => void;
  onDismiss: () => void;
}

export const CallNotificationModal: React.FC<CallNotificationModalProps> = ({
  isVisible,
  phoneNumber,
  callType,
  profilePhoto,
  onOpenWhatsApp,
  onDismiss,
}) => {
  if (!isVisible) return null;

  const isIncoming = callType === 'incoming';
  const bgColor = isIncoming ? 'bg-green-600' : 'bg-blue-600';
  const icon = isIncoming ? '📞' : '📲';
  const title = isIncoming ? 'Incoming Call' : 'Outgoing Call';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${bgColor} rounded-xl p-8 text-white text-center max-w-sm w-full mx-4 shadow-2xl`}>
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-lg font-mono mb-6 opacity-90">{phoneNumber}</p>
        
        {profilePhoto && (
          <img 
            src={profilePhoto} 
            alt="Profile" 
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={onOpenWhatsApp}
            className="flex-1 bg-white text-green-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition"
          >
            💬 WhatsApp
          </button>
          <button
            onClick={onDismiss}
            className="flex-1 bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition"
          >
            ✕ Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
