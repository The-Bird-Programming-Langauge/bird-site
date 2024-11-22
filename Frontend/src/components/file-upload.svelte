<script lang="ts">
	import { compileBird, uploadBird, uploadWasm } from '../lib/compile';
	import { currentLanguage } from '$lib/current-language';
	import { onDestroy } from 'svelte';
	import { text } from '@sveltejs/kit';
	let files: FileList | null = $state(null);

	let codeType: 'bird' | 'wasm' = $state('bird');
	const sub = currentLanguage.subscribe((value) => {
		codeType = value;
	});

	onDestroy(sub);
</script>

<div class="self-end">
	{#if codeType === 'bird'}
		<input bind:files type="file" id="file" accept=".bird" />
	{:else}
		<input bind:files type="file" id="file" accept=".wasm" />
	{/if}
	<button
		type="submit"
		class="rounded bg-teal-100 px-4 py-2 font-bold text-slate-700 hover:bg-teal-300"
		onclick={async () => {
			if (!files) return;
			if (files.length === 0) return;

			if (codeType === 'bird') {
				const code = await files.item(0)!.text();
				await uploadBird(code);
				return;
			}

			const arrayBuffer = await files.item(0)!.arrayBuffer();
			await uploadWasm(arrayBuffer);
		}}
	>
		Upload & Run
	</button>
</div>
