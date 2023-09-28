<script lang="ts">
	import AuthCheck from '$lib/components/authCheck.svelte';
	import { db, user, userData } from '$lib/firebase';
	import { doc, getDoc, writeBatch } from 'firebase/firestore';

	let username = '';
	let isAvailable = false;
	let loading = false;

	let debounceTimer: NodeJS.Timeout;

	const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

	$: isValid = username?.length > 2 && username.length < 16 && re.test(username);
	$: isTouched = username.length > 0;
	$: isTaken = isValid && !isAvailable && !loading;

	function checkAvailability() {
		loading = true;
		clearTimeout(debounceTimer);

		debounceTimer = setTimeout(async () => {
			let userRef = doc(db, 'usernames', username);
			let exist = await getDoc(userRef).then((doc) => doc.exists());

			isAvailable = !exist;
			loading = false;
		}, 1000);
	}

	async function submitUsername() {
		let batch = writeBatch(db);

		batch.set(doc(db, 'usernames', username), { uid: $user?.uid });
		batch.set(doc(db, 'users', $user!.uid), {
			username,
			photoURL: $user?.photoURL ?? null,
			published: true,
			bio: 'I am the Walrus',
			links: [
				{
					title: 'Test Link',
					url: 'https://kung.foo',
					icon: 'custom'
				}
			]
		});

		await batch.commit();

		username = '';
		isAvailable = false;
	}
</script>

<AuthCheck>
	{#if $userData?.username}
		<p>@{$userData.username}</p>
		<p>Username already set can not be changed</p>
		<a href="/login/photo" class="link">Set your photo</a>
	{:else}
		<h3>Username</h3>
		<form on:submit|preventDefault={submitUsername}>
			<input
				type="text"
				class="w-full input"
				bind:value={username}
				on:input={checkAvailability}
				class:input-error={!isValid && isTouched}
				class:input-warning={isTaken}
				class:input-success={isAvailable && isValid && !loading}
			/>
			<div class="my-4 min-h-16 px-8 w-full">
				{#if loading}
					<p class="text-secondary">Checking availability of @{username}...</p>
				{/if}

				{#if !isValid && isTouched}
					<p class="text-error text-sm">must be 3-16 characters long, alphanumeric only</p>
				{/if}

				{#if isValid && !isAvailable && !loading}
					<p class="text-warning text-sm">
						@{username} is not available
					</p>
				{/if}

				{#if isAvailable}
					<button class="btn btn-success">Confirm username @{username} </button>
				{/if}
			</div>
		</form>
	{/if}
</AuthCheck>
