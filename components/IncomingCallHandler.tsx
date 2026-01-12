
import React, { useEffect, useState } from 'react';
import { CallNotificationModal } from './CallNotificationModal';

// Declare global window interface for TypeScript
declare global {
  interface Window {
    handleIncomingCall: (phoneNumber: string) => void;
  }
}

interface CallInfo {
  phoneNumber: string;
  timestamp: number;
  profilePhoto: string | null;
}

export const IncomingCallHandler: React.FC = () => {
  const [currentCall, setCurrentCall] = useState<CallInfo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Initialize the global function that Android will call
  useEffect(() => {
    console.log('[LENTE] IncomingCallHandler initialized');

    // Create the global function for Android to call
    window.handleIncomingCall = (phoneNumber: string) => {
      console.log('[LENTE] Received call from Android:', phoneNumber);

      // Create call info object
      const callInfo: CallInfo = {
        phoneNumber: phoneNumber,
        timestamp: Date.now(),
        profilePhoto: null, // Will be populated by WhatsApp lookup
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

  return (
    <>
      {/* Modale per la chiamata */}
      <CallNotificationModal
        isVisible={isModalVisible}
        phoneNumber={currentCall?.phoneNumber || ''}
        profilePhoto={currentCall?.profilePhoto || null}
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
    </>
  );
};
