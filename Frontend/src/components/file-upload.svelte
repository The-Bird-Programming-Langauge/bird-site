<script lang="ts">
	import { currentLanguage } from '$lib/current-language';
	import { onDestroy } from 'svelte';
	import { uploadBird, uploadWasm } from '../lib/compile';
	import { Fileupload, Label } from 'flowbite-svelte';
	import BirdButton from './BirdButton.svelte';

	let files: FileList | undefined = $state(undefined);

	let codeType: 'bird' | 'wasm' = $state('bird');
	const sub = currentLanguage.subscribe((value) => {
		codeType = value;
	});

	onDestroy(sub);
</script>

<div class="flex gap-2 self-end">
	<div>
		{#if codeType === 'bird'}
			<div class="flex flex-row">
				<Label for="bird file upload">Bird File Upload</Label>
				<Fileupload
					bind:files
					type="file"
					accept=".bird"
					id="bird file upload"
					aria-label="bird file upload"
				/>
			</div>
		{:else}
			<div class="flex flex-row">
				<Label for="wasm file upload">Wasm File Upload</Label>
				<Fileupload
					bind:files
					type="file"
					accept=".wasm"
					id="wasm file upload"
					aria-label="wasm file upload"
				/>
			</div>
		{/if}
	</div>
	<BirdButton
		type="submit"
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
	</BirdButton>
</div>
