<script lang="ts">
	import { uploadWasm } from '../lib/compile';
	let files: FileList | null = $state(null);
</script>

<div class="self-end">
	<input bind:files type="file" id="file" accept=".wasm" />
	<button
		type="submit"
		class="rounded bg-teal-100 px-4 py-2 font-bold text-slate-700 hover:bg-teal-300"
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
