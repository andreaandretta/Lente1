import React, { useEffect, useState } from 'react';
import { CallNotificationModal } from './CallNotificationModal';

// 1. Define types for global window access
declare global {
  interface Window {
    handleIncomingCall: (number: string) => void;
    handleOutgoingCall: (number: string) => void;
  }
}

export const IncomingCallHandler: React.FC = () => {
  const [callState, setCallState] = useState<{
    isVisible: boolean;
    number: string;
    type: 'incoming' | 'outgoing';
  }>({ isVisible: false, number: '', type: 'incoming' });

  // 2. FORCE ATTACH TO WINDOW ON MOUNT
  useEffect(() => {
    console.log("⚡ REGISTERING HANDLERS...");
    
    window.handleIncomingCall = (number: string) => {
      console.log("📞 Incoming call detected:", number);
      setCallState({ isVisible: true, number, type: 'incoming' });
    };

    window.handleOutgoingCall = (number: string) => {
      console.log("📲 Outgoing call detected:", number);
      setCallState({ isVisible: true, number, type: 'outgoing' });
    };

    // Cleanup
    return () => {
      console.log("Cleaning up handlers");
    };
  }, []);

  return (
    <CallNotificationModal 
      isVisible={callState.isVisible}
      phoneNumber={callState.number}
      callType={callState.type}
      profilePhoto={null}
      onOpenWhatsApp={() => window.open(`https://wa.me/${callState.number.replace('+', '')}`, '_blank')}
      onDismiss={() => setCallState(prev => ({ ...prev, isVisible: false }))}
    />
  );
};
