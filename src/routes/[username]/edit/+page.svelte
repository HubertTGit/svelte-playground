<script lang="ts">
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { user, db, userData } from '$lib/firebase';
	import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	const icons = ['Twitter', 'YouTube', 'TikTok', 'LinkedIn', 'GitHub', 'Custom'];

	const formData = writable({
		icon: 'custom',
		title: '',
		url: 'https://'
	});

	let showForm = false;

	$: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
	$: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
	$: formIsValid = urlIsValid && titleIsValid;

	async function addLink() {
		const userRef = doc(db, 'users', $user!.uid);
		await updateDoc(userRef, {
			links: arrayUnion({ ...$formData, id: Math.random().toString(36).substring(7) })
		});

		formData.set({
			icon: 'custom',
			title: '',
			url: 'https://'
		});
	}

	async function deleteLink(id: string) {
		const userRef = doc(db, 'users', $user!.uid);
		await updateDoc(userRef, {
			links: arrayRemove({ id })
		});
	}

	function cancelLink() {
		formData.set({
			icon: 'custom',
			title: '',
			url: 'https://'
		});
		showForm = false;
	}
</script>

<main class="max-w-xl mx-auto">
	{#if $userData?.username === $page.params.username}
		<h1 class="mx-2 text-2xl font-bold mt-8 mb-4 text-center">Edit your Profile</h1>

		<!-- INSERT sortable list -->
		{#if showForm}
			<form on:submit|preventDefault={addLink}>
				<select name="icon" class="select select-sm" bind:value={$formData.icon}>
					{#each icons as icon}
						<option value={icon.toLocaleLowerCase()}>{icon}</option>
					{/each}
				</select>

				<input
					type="text"
					name="title"
					placeholder="Title"
					class="input input-sm"
					bind:value={$formData.title}
					class:input-error={!titleIsValid}
				/>

				<input
					type="text"
					name="url"
					placeholder="url"
					class="input input-sm"
					bind:value={$formData.url}
					class:input-error={!urlIsValid}
				/>

				<div class="my-4">
					{#if !titleIsValid}
						<p class="text-error text-xs">Must have valid title</p>
					{/if}
					{#if !urlIsValid}
						<p class="text-error text-xs">Must have a valid URL</p>
					{/if}
					{#if formIsValid}
						<p class="text-success text-xs">Looks good!</p>
					{/if}
				</div>

				<button type="submit" disabled={!formIsValid} class="btn btn-success block">add link</button
				>

				<button type="button" class="btn btn-secondary my-4" on:click={cancelLink}>Cancel</button>
			</form>
		{:else}
			<button
				class="btn btn-outline btn-info block mx-auto my-4"
				on:click={() => (showForm = true)}
			>
				Add Link
			</button>
		{/if}
	{/if}
</main>