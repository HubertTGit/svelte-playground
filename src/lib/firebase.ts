import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { collection, doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { getAuth, type User, onAuthStateChanged } from 'firebase/auth';
import { derived, writable, type Readable } from 'svelte/store';

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

export interface IUserData {
	username: string;
	photoURL: string | null;
	published: boolean;
	bio: string;
	links: ILink[];
}

export interface ILink {
	title: string;
	url: string;
	icon: string;
	id?: string;
}

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

function docStore<T>(path: string) {
	let unsubscribe: () => void;

	const docRef = doc(db, path);

	const { subscribe } = writable<T | null>(null, (set) => {
		unsubscribe = onSnapshot(docRef, (snap) => {
			set(snap.data() as T | null);
		});

		return () => unsubscribe();
	});

	return {
		subscribe,
		ref: docRef,
		id: docRef.id
	};
}

function collectionStore<T>(path: string) {
	let unsubscribe: () => void;

	const colRef = collection(db, path);

	const { subscribe } = writable<T[]>([], (set) => {
		unsubscribe = onSnapshot(colRef, (snap) => {
			set(snap.docs.map((doc) => doc.data() as T));
		});

		return () => unsubscribe();
	});

	return {
		subscribe
	};
}

export const userData: Readable<IUserData | null> = derived(user, ($user, set) => {
	if ($user) {
		return docStore<IUserData>(`users/${$user.uid}`).subscribe(set);
	} else {
		set(null);
	}
});

export const users: Readable<IUserData[]> = collectionStore<IUserData>('users');
