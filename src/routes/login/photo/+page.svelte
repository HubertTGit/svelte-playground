<script lang="ts">
	import { user, storage, db, userData } from '$lib/firebase';
	import CheckAuth from '$lib/components/authCheck.svelte';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	import { doc, updateDoc } from 'firebase/firestore';

	let isUploading = false;
	let imgUrl: string | null = null;

	async function upload(e: any) {
		const file = e.target.files[0];
		imgUrl = URL.createObjectURL(file);
		isUploading = true;

		const storgeRef = ref(storage, `users/${$user!.uid}/profile.png`);
		const result = await uploadBytes(storgeRef, file);
		imgUrl = await getDownloadURL(result.ref);

		await updateDoc(doc(db, 'users', $user!.uid), {
			photoURL: imgUrl
		});

		isUploading = false;
	}
</script>

<CheckAuth>
	<img
		src={imgUrl ?? $userData?.photoURL ?? '/user.png'}
		alt="photoURL"
		width="256"
		height="256"
		class="mx-auto"
	/>
	<label for="photoURL" class="label">
		<span class="label-text">Pick a file</span>
	</label>
	<input
		type="file"
		name="photoURL"
		id="photoURL"
		multiple={false}
		on:change={upload}
		class="file-input file-input-bordered w-full max-w-xs"
		accept="image/png, image/jpeg, image/gif, image/webp"
	/>
	{#if isUploading}
		<p>Uploading...</p>
		<progress class="progress progress-info w-56 mt-6" />
	{/if}
</CheckAuth>
