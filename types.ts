
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
