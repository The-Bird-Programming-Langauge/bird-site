<script lang="ts">
	import { currentLanguage } from '$lib/current-language';
	import { onDestroy } from 'svelte';
	import { uploadBird, uploadWasm } from '../lib/compile';
	import { Fileupload } from 'flowbite-svelte';
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
			<Fileupload bind:files type="file" id="file" accept=".bird" />
		{:else}
			<Fileupload bind:files type="file" id="file" accept=".wasm" />
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
