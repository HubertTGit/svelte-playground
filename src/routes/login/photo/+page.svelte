<script lang="ts">
	import { userData } from '$lib/firebase';
	import CheckAuth from '$lib/components/authCheck.svelte';
</script>

<CheckAuth>
	<h3>Photo</h3>
	{#if $userData}
		<p>{$userData.username}</p>
		<p>{$userData.bio}</p>
	{/if}
</CheckAuth>
