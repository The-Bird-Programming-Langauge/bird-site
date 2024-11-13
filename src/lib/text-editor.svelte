<script lang="ts">
	import { compileWat } from './compile';

	let code = $state('');
</script>

<div class="flex flex-col">
	<textarea
		rows="20"
		cols="50"
		class="rounded-md border-2 border-black"
		bind:value={code}
		onkeydown={(
			event: KeyboardEvent & {
				currentTarget: EventTarget & HTMLTextAreaElement;
			}
		) => {
			if (event.key === 'Tab') {
				event.preventDefault();
				const start = event.currentTarget.selectionStart;
				const end = event.currentTarget.selectionEnd;
				code = code.slice(0, start) + '\t' + code.slice(end);
			}
		}}
	>
	</textarea>
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
