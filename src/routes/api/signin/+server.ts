import { adminAuth } from '$lib/server/admin';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { tokenId } = await request.json();
	const expiresIn = 60 * 60 * 24 * 5 * 1000;

	const decodedToken = await adminAuth.verifyIdToken(tokenId);

	if (new Date().getTime() / 1000 - decodedToken.auth_time < 5 * 60) {
		const cookie = await adminAuth.createSessionCookie(tokenId, { expiresIn });

		const options = { maxAge: expiresIn, httpOnly: true, secure: true, path: '/' };
		cookies.set('__session', cookie, options);

		return json({ status: 'signin' });
	} else {
		throw error(401, 'Recent sign in required!');
	}
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete('__session', { path: '/' });
	return json({ status: 'signout' });
};
