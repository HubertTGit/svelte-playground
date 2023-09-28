import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAyTEMNYKBxn9nNe323BvxblIw8wR4L_-4',
	authDomain: 'ai-testing-396020.firebaseapp.com',
	projectId: 'ai-testing-396020',
	storageBucket: 'ai-testing-396020.appspot.com',
	messagingSenderId: '1087361350826',
	appId: '1:1087361350826:web:de09d0c487a4e739ce64d3',
	measurementId: 'G-4R57R1NMPY'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
