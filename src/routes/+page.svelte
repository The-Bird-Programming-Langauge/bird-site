<script lang="ts">
	import TextEditor from '../components/text-editor.svelte';
	import FileUpload from '../components/file-upload.svelte';
	import Header from '../components/header.svelte';
	import { consoleOutput } from '$lib/console-output';
	import { onDestroy } from 'svelte';

	let output: string[] = [];

	const sub = consoleOutput.subscribe((value) => {
		output = value;
	});

	onDestroy(sub);
</script>

<div class="h-full">
	<Header></Header>

	<div class="mb-2">
		<FileUpload></FileUpload>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<TextEditor></TextEditor>
		<div class="flex w-full flex-col gap-4">
			<div class="m-0 flex flex-grow flex-col rounded-md border-2 border-blue-500 p-4">
				{#each output as line}
					<p>{line}</p>
				{/each}
			</div>
			<button
				class="w-1/6 self-end rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
				onclick={() => {
					consoleOutput.set([]);
				}}
			>
				Clear
			</button>
		</div>
	</div>
</div>
