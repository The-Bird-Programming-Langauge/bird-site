<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { textEditorCode } from '$lib/text-editor-code';
	import { onDestroy } from 'svelte';
	import { compileWat } from '$lib/compile';

	let code = '';
	const sub = textEditorCode.subscribe((value) => {
		code = value || '\n\n\n\n\n\n\n\n\n\n';
	});

	onDestroy(sub);
</script>

<div class="h-max-full flex flex-col gap-4">
	<CodeMirror bind:value={code} styles={{ div: { 'background-color': 'white' } }} />
	<button
		type="submit"
		class="w-1/6 self-end rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
		onclick={async () => {
			await compileWat(code);
		}}
	>
		Run
	</button>
</div>
