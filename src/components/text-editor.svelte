<script lang="ts">
	import { textEditorCode } from '$lib/text-editor-code';
	import { onDestroy } from 'svelte';
	import { compileWat } from '../lib/compile';

	let code = '';
	const sub = textEditorCode.subscribe((value) => {
		code = value;
	});

	onDestroy(sub);
</script>

<div class="m-0 flex flex-col p-0">
	<textarea rows="20" class="m-0 rounded-md border-2 border-black" bind:value={code}> </textarea>
	<button
		type="submit"
		class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
		onclick={async () => {
			await compileWat(code);
		}}
	>
		Run
	</button>
</div>
