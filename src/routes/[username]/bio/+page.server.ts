import type { IUserData } from '$lib/firebase';
import { adminDB } from '$lib/server/admin';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load = (async ({ locals, params }) => {
	const uid = locals.usedID;

	if (!uid) {
		throw redirect(301, '/login');
	}

	const userDoc = await adminDB.collection('users').doc(uid!).get();
	const { bio, username } = userDoc.data() as IUserData;
	if (params.username !== username) {
		throw error(401, 'this user does not belong to you');
	}

	return { bio };
}) satisfies PageServerLoad;
