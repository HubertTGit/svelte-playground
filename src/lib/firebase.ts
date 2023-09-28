import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth, type User, onAuthStateChanged } from 'firebase/auth';
import { writable } from 'svelte/store';

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

/**
 * @returns a store with the current firebase user
 */
function userStore() {
	let unsubscribe: () => void;

	if (!auth || !globalThis.window) {
		console.warn('Auth is not initialized or not in browser');
		const { subscribe } = writable<User | null>(null);
		return {
			subscribe
		};
	}

	const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
		unsubscribe = onAuthStateChanged(auth, (user) => {
			set(user);
		});

		return () => unsubscribe();
	});

	return {
		subscribe
	};
}

export const user = userStore();
