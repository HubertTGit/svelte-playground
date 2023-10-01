<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	export let data: PageData;
</script>

<main class="flex flex-col justify-center items-center">
	<h1>
		current bio <span class="text-green-200">{data.bio}</span>
	</h1>

	<p>status code: {$page.status}</p>
	<p class=" text-error">{$page.form?.problem ?? ''}</p>
	<form method="POST" use:enhance>
		<div class="form-control mb-3">
			<label class="label" for="bio">
				<span class="label-text">Your bio</span>
				<span class="label-text-alt">max 60 chars</span>
			</label>
			<textarea
				class="textarea textarea-bordered h-24"
				placeholder="Bio"
				id="bio"
				name="bio"
				cols="30"
				rows="10"
				value={data.bio}
			/>
		</div>
		<button class="btn btn-primary">UPDATE BIO</button>
	</form>
</main>
