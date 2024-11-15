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

<div class="flex flex-col gap-4">
	<div class="m-0 flex flex-col rounded-md border-2 border-blue-500 p-4">
		<textarea
			rows="20"
			class="m-0 text-lg outline-none"
			bind:value={code}
			onkeydown={(
				ev: KeyboardEvent & {
					currentTarget: EventTarget & HTMLTextAreaElement;
				}
			) => {
				if (ev.key === 'Tab') {
					ev.preventDefault();
					const start = ev.currentTarget.selectionStart;
					const end = ev.currentTarget.selectionEnd;
					ev.currentTarget.value =
						ev.currentTarget.value.substring(0, start) +
						'\t' +
						ev.currentTarget.value.substring(end);

					ev.currentTarget.selectionEnd = start + 1;
				}
			}}
		>
		</textarea>
	</div>
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
