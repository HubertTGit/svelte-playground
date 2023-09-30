import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import type { PageLoad } from './$types';
import { db } from '$lib/firebase';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const { username } = params;

	const colRef = collection(db, 'users');
	const queryRef = query(colRef, where('username', '==', username), limit(1));

	const snapshot = await getDocs(queryRef);

	if (!snapshot.docs[0]) {
		throw error(404, 'Data does not exist');
	}

	const data = snapshot.docs[0].data();
	const exists = snapshot.docs[0].exists();

	if (!exists) {
		throw error(404, 'User does not exist');
	}

	if (!data.published) {
		throw error(403, `data user for ${username} is not public`);
	}

	return {
		username: data.username,
		photoURL: data.photoURL,
		bio: data.bio,
		links: data.links ?? []
	};
}) satisfies PageLoad;
