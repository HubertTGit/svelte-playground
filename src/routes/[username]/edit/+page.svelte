<script lang="ts">
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { user, db, userData, type ILink } from '$lib/firebase';
	import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
	import UserLink from '$lib/components/userLink.svelte';
	import SortableList from '$lib/components/sortableList.svelte';

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

	async function deleteLink(item: ILink): Promise<void> {
		const userRef = doc(db, 'users', $user!.uid);
		await updateDoc(userRef, {
			links: arrayRemove(item)
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

	async function updateSort(event: CustomEvent) {
		await updateDoc(doc(db, 'users', $user!.uid), {
			links: event.detail
		});
	}

	async function publish(event: any) {
		await updateDoc(doc(db, 'users', $user!.uid), {
			published: !$userData?.published
		});
	}
</script>

<main class="max-w-xl mx-auto">
	{#if $userData?.username === $page.params.username}
		<h1 class="mx-2 text-2xl font-bold mt-8 mb-4 text-center">Edit your Profile</h1>

		<h2 class=" text-green-600 text-3xl text-center">@{$userData?.username}</h2>

		<!-- published -->
		<div class=" m-auto">
			<div class="form-control">
				<label class="cursor-pointer label">
					<span class="label-text">publish</span>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						checked={$userData.published}
						on:change={publish}
					/>
				</label>
			</div>
		</div>

		<!-- sortable list -->
		<SortableList list={$userData.links} let:index let:item on:sort={updateSort}>
			<div class="relative group">
				<UserLink {...item} />

				<button
					class="btn btn-sm btn-error invisible group-hover:visible transition-all absolute -right-10 top-0 z-10"
					on:click={() => deleteLink(item)}>delete</button
				>
			</div>
		</SortableList>
		<!-- sortable list -->

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
