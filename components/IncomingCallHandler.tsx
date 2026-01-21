
import React, { useEffect, useState } from 'react';
import { CallNotificationModal } from './CallNotificationModal';

// Declare global window interface for TypeScript
declare global {
  interface Window {
    handleIncomingCall: (phoneNumber: string) => void;
    handleOutgoingCall: (phoneNumber: string) => void;
  }
}

interface CallInfo {
  phoneNumber: string;
  timestamp: number;
  profilePhoto: string | null;
  callType: 'incoming' | 'outgoing';
}

export const IncomingCallHandler: React.FC = () => {
  const [currentCall, setCurrentCall] = useState<CallInfo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [serviceRunning, setServiceRunning] = useState<boolean>(false);

  // Initialize the global functions that Android will call
  useEffect(() => {
    console.log('[LENTE] IncomingCallHandler initialized');

    // Query service status from Android bridge if available
    try {
      if (window.LenteBridge && typeof window.LenteBridge.isServiceRunning === 'function') {
        const status = window.LenteBridge.isServiceRunning();
        setServiceRunning(Boolean(status));
      }
    } catch (e) {
      console.warn('[LENTE] LenteBridge not available in this environment');
    }

    // Create the global function for INCOMING calls
    window.handleIncomingCall = (phoneNumber: string) => {
      console.log('[LENTE] Received INCOMING call from Android:', phoneNumber);

      // Create call info object
      const callInfo: CallInfo = {
        phoneNumber: phoneNumber,
        timestamp: Date.now(),
        profilePhoto: null,
        callType: 'incoming',
      };

      // Show the modal immediately
      setCurrentCall(callInfo);
      setIsModalVisible(true);

      // Attempt to fetch WhatsApp profile photo (Opzione A)
      attemptWhatsAppLookup(phoneNumber, callInfo);
    };

    // Create the global function for OUTGOING calls
    window.handleOutgoingCall = (phoneNumber: string) => {
      console.log('[LENTE] Received OUTGOING call from Android:', phoneNumber);

      // Create call info object
      const callInfo: CallInfo = {
        phoneNumber: phoneNumber,
        timestamp: Date.now(),
        profilePhoto: null,
        callType: 'outgoing',
      };

      // Show the modal immediately
      setCurrentCall(callInfo);
      setIsModalVisible(true);

      // Attempt to fetch WhatsApp profile photo (Opzione A)
      attemptWhatsAppLookup(phoneNumber, callInfo);
    };

    // Cleanup on unmount
    return () => {
      console.log('[LENTE] IncomingCallHandler unmounted');
      delete window.handleIncomingCall;
      delete window.handleOutgoingCall;
    };
  }, []);

  /**
   * Opzione A: Tentativo di recupero foto da WhatsApp
   *
   * NOTA IMPORTANTE:
   * - WhatsApp Web richiede autenticazione (QR Code scan)
   * - A causa di CORS, non possiamo fare fetch diretto
   * - Questa funzione tenta un approccio con iframe nascosto
   * - Se l'utente non è loggato in WhatsApp Web, questo fallirà
   * - In caso di fallimento, mostriamo solo il numero (Opzione B automatica)
   */
  const attemptWhatsAppLookup = async (phoneNumber: string, callInfo: CallInfo) => {
    try {
      console.log('[LENTE] Attempting WhatsApp lookup for:', phoneNumber);

      // Metodo 1: Tentativo con iframe nascosto (funziona solo se loggato)
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = `https://web.whatsapp.com/send?phone=${phoneNumber.replace(/\+/g, '')}`;
      document.body.appendChild(iframe);

      // Timeout per tentare di catturare informazioni
      setTimeout(() => {
        try {
          // Prova ad accedere al contenuto dell'iframe
          // Questo fallirà a causa di CORS, ma almeno abbiamo provato
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

          if (iframeDoc) {
            console.log('[LENTE] WhatsApp iframe loaded (user might be logged in)');
            // Nota: Non possiamo accedere al DOM dell'iframe a causa di CORS
            // Ma possiamo almeno verificare se l'iframe si è caricato
          }
        } catch (error) {
          console.log('[LENTE] WhatsApp iframe CORS blocked (expected):', error);
        }

        // Rimuovi iframe dopo 3 secondi
        setTimeout(() => {
          document.body.removeChild(iframe);
          console.log('[LENTE] WhatsApp iframe removed');
        }, 3000);
      }, 2000);

      // Metodo 2: Fallback - Usa foto placeholder o icona generica
      // In futuro, qui potremmo integrare un database locale di contatti
      // o un servizio di lookup esterno autorizzato

      console.log('[LENTE] WhatsApp lookup completed (no photo retrieved, CORS blocked)');

    } catch (error) {
      console.error('[LENTE] WhatsApp lookup failed:', error);
    }
  };

  /**
   * Apri WhatsApp Web o App con il numero
   * Usa wa.me che funziona sia su mobile che desktop
   */
  const handleOpenWhatsApp = () => {
    if (!currentCall) return;

    const cleanNumber = currentCall.phoneNumber.replace(/\+/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}`;

    console.log('[LENTE] Opening WhatsApp:', whatsappUrl);

    // Su Android WebView, questo aprirà l'app WhatsApp se installata
    // Altrimenti aprirà WhatsApp Web nel browser

    window.open(whatsappUrl, '_blank');

    // Opzionale: chiudi il modale dopo aver aperto WhatsApp
    // setIsModalVisible(false);
  };

  /**
   * Chiudi il modale
   */
  const handleDismiss = () => {
    console.log('[LENTE] Call notification dismissed');
    setIsModalVisible(false);
    setCurrentCall(null);
  };

  const handleStartService = () => {
    if (window.LenteBridge && typeof window.LenteBridge.startCallService === 'function') {
      window.LenteBridge.startCallService();
      setTimeout(() => {
        try {
          const status = window.LenteBridge!.isServiceRunning();
          setServiceRunning(Boolean(status));
        } catch (e) {}
      }, 500);
    }
  };

  const handleStopService = () => {
    if (window.LenteBridge && typeof window.LenteBridge.stopCallService === 'function') {
      window.LenteBridge.stopCallService();
      setTimeout(() => {
        try {
          const status = window.LenteBridge!.isServiceRunning();
          setServiceRunning(Boolean(status));
        } catch (e) {}
      }, 500);
    }
  };

  return (
    <>
      {/* Modale per la chiamata */}
      <CallNotificationModal
        isVisible={isModalVisible}
        phoneNumber={currentCall?.phoneNumber || ''}
        profilePhoto={currentCall?.profilePhoto || null}
        callType={currentCall?.callType || 'incoming'}
        onOpenWhatsApp={handleOpenWhatsApp}
        onDismiss={handleDismiss}
      />

      {/* Indicatore visivo che il componente è attivo (solo in dev) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg z-50">
          <i className="fas fa-check-circle mr-1"></i>
          Call Handler Active
        </div>
      )}

      {/* Foreground Service status and controls */}
      <div className="fixed bottom-4 right-4 bg-slate-900 border border-indigo-600 rounded-2xl shadow-2xl p-4 z-50">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xl ${serviceRunning ? 'text-green-400' : 'text-red-400'}`}>{serviceRunning ? '✅' : '❌'}</span>
          <span className="text-white text-sm font-semibold">Service Running</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleStartService}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-2 rounded-lg"
          >Start</button>
          <button
            onClick={handleStopService}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-2 rounded-lg"
          >Stop</button>
        </div>
      </div>
    </>
  );
};
