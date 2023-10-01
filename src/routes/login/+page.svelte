<script lang="ts">
	import { auth, user } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

	async function signInHandler() {
		const credential = await signInWithPopup(auth, new GoogleAuthProvider());
		const tokenId = await credential.user.getIdToken();

		console.log(tokenId);

		const res = await fetch('/api/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ tokenId })
		});
	}

	async function signOutHandler() {
		const rest = await fetch('/api/signin', {
			method: 'DELETE'
		});
		await signOut(auth);
	}
</script>

{#if $user}
	<h2 class="card-title">Welcome, {$user.displayName}</h2>
	<p class="text-center text-success">You are logged in</p>
	<button on:click={signOutHandler} class="btn btn-primary">Sign out</button>
{:else}
	<button on:click={signInHandler} class="btn btn-primary">Sign in with Google</button>
{/if}
