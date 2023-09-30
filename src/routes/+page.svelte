<script lang="ts">
	import { goto } from '$app/navigation';
	import { users } from '$lib/firebase';

	function detail(path: string) {
		goto(`/${path}`);
	}
</script>

<div class="overflow-x-auto">
	<table class="table">
		<!-- head -->
		<thead>
			<tr>
				<th>#</th>
				<th>Photo</th>
				<th>username</th>
			</tr>
		</thead>
		<tbody>
			<!-- row 1 -->
			{#each $users as user, index}
				<tr class=" hover:bg-slate-400 cursor-pointer" on:click={() => detail(user.username)}>
					<th>{index + 1}</th>
					<td>
						<div class="avatar">
							<div class="w-8 rounded">
								<img
									src={user.photoURL}
									alt={user.username}
									class="object-cover w-full h-full rounded"
								/>
							</div>
						</div>
					</td>
					<td>{user.username}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
