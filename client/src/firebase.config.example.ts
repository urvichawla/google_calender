import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'your-api-key',
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'your-auth-domain',
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'your-project-id',
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'your-storage-bucket',
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'your-sender-id',
	appId: process.env.REACT_APP_FIREBASE_APP_ID || 'your-app-id',
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'your-measurement-id',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };

