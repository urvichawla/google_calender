/// <reference types="react-scripts" />

declare var process: {
  env: {
    REACT_APP_API_URL?: string;
    REACT_APP_CALENDAR_APP_URL?: string;
    REACT_APP_FIREBASE_API_KEY?: string;
    REACT_APP_FIREBASE_AUTH_DOMAIN?: string;
    REACT_APP_FIREBASE_PROJECT_ID?: string;
    REACT_APP_FIREBASE_STORAGE_BUCKET?: string;
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID?: string;
    REACT_APP_FIREBASE_APP_ID?: string;
    REACT_APP_FIREBASE_MEASUREMENT_ID?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  };
};

declare module '*.txt' {
  const content: string;
  export default content;
}
