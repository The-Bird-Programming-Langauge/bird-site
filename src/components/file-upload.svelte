<script lang="ts">
	import { uploadWasm } from '../lib/compile';
	let files: FileList | null = $state(null);
</script>

<input bind:files type="file" id="file" accept=".wasm" />
<button
	type="submit"
	class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
	onclick={async () => {
		if (!files) return;
		if (files.length === 0) return;
		const arrayBuffer = await files.item(0)!.arrayBuffer();
		await uploadWasm(arrayBuffer);
	}}
>
	Upload & Run
</button>
