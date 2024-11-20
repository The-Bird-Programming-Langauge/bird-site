<script lang="ts">
	import { uploadWasm } from '../lib/compile';
	let files: FileList | null = $state(null);
</script>

<div class="self-end">
	<input bind:files type="file" id="file" accept=".wasm" />
	<button
		type="submit"
		class="rounded bg-primary px-4 py-2 font-bold text-dark hover:bg-accent"
		onclick={async () => {
			if (!files) return;
			if (files.length === 0) return;
			const arrayBuffer = await files.item(0)!.arrayBuffer();
			await uploadWasm(arrayBuffer);
		}}
	>
		Upload & Run
	</button>
</div>
