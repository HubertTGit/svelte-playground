<script lang="ts">
	import { goto } from '$app/navigation';
	import UserLink from '$lib/components/userLink.svelte';
	import { user } from '$lib/firebase';
	import type { PageData } from './$types';

	export let data: PageData;
	function edit() {
		if ($user) {
			goto(`/${data.username}/edit`);
		} else {
			goto('/login');
		}
	}
</script>

<svelte:head>
	<title>{data.username}</title>
	<meta name="description" content={data.bio} />
</svelte:head>

<main class="prose text-center mx-auto mt-8">
	<h1 class="text-7xl text-purple-500">
		@{data.username}
	</h1>

	<img src={data.photoURL ?? '/user.png'} alt="photoURL" width="256" class="mx-auto" />

	<p class="text-xl my-8">{data.bio ?? 'no bio yet...'}</p>
	<ul class="list-none">
		{#each data.links as item}
			<li class="my-4">
				<UserLink {...item} />
			</li>
		{/each}
	</ul>

	<a href="/" on:click|preventDefault={edit} class="link"> EDIT profile</a>
</main>
