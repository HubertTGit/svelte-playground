import type { IUserData } from '$lib/firebase';
import { adminDB } from '$lib/server/admin';
import type { PageServerLoad } from './$types';
import { error, redirect, type Actions, fail } from '@sveltejs/kit';

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

export const actions = {
	default: async ({ locals, request, params }) => {
		const uid = locals.usedID;

		const data = await request.formData();
		const bio = data.get('bio') as string;

		const userRef = adminDB.collection('users').doc(uid!);
		const { username } = (await userRef.get()).data() as IUserData;

		if (params.username !== username) {
			throw error(401, 'this user does not belong to you');
		}

		if (bio.length > 60) {
			return fail(400, { problem: 'bio is too long' });
		}

		await userRef.update({ bio });
	}
} satisfies Actions;
