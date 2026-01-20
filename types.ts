
export interface AndroidFile {
  name: string;
  path: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'json';
  content: string;
}

export interface ContactInfo {
  number: string;
  name: string;
  photoUrl: string;
}

declare global {
  interface Window {
    LenteBridge?: {
      startCallService: () => void;
      stopCallService: () => void;
      isServiceRunning: () => boolean;
    };
    handleIncomingCall?: (phoneNumber: string) => void;
    handleOutgoingCall?: (phoneNumber: string) => void;
  }
}
