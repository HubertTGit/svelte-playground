<script lang="ts">
	import { goto } from '$app/navigation';
	import { user, userData, auth } from '$lib/firebase';
	import { page } from '$app/stores';

	function navigate(path: string) {
		if ($userData) {
			goto(`/${$userData.username}${path}`);
		}
	}

	async function logout() {
		await auth.signOut();
		goto('/login');
	}
</script>

<header class=" flex p-3 justify-between items-center">
	<div />

	<div class="flex justify-center items-center gap-2">
		<button
			on:click={() => navigate('')}
			class="btn btn-ghost"
			class:btn-active={$page.url.pathname === `/${$page.params.username}`}>👁️ view</button
		>
		<button
			on:click={() => navigate('/edit')}
			class="btn btn-ghost"
			class:btn-active={$page.url.pathname === `/${$page.params.username}/edit`}
			disabled={!!!$user}>🔗 edit</button
		>
		<button
			on:click={() => navigate('/bio')}
			class="btn btn-ghost"
			class:btn-active={$page.url.pathname === `/${$page.params.username}/bio`}
			disabled={!!!$user}>🍪 SSR edit</button
		>
	</div>

	{#if $user}
		<button class="btn btn-sm btn-outline" on:click={logout}>logout</button>
	{:else}
		<a class="btn btn-sm btn-outline" href="/login">login</a>
	{/if}
</header>
<slot />
