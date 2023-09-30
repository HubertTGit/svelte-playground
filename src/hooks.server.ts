import { db } from '$lib/firebase';
import { error } from '@sveltejs/kit';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

export async function handle({ event, resolve }) {
	const username = event.params.username;

	if (username) {
		const colRef = collection(db, 'users');
		const queryRef = query(colRef, where('username', '==', username), limit(1));

		const snapshot = await getDocs(queryRef);

		if (!snapshot.docs[0]) {
			throw error(404, `Data does not exist for ${username}`);
		}
	}

	const response = await resolve(event);

	return response;
}
