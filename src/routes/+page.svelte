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

<Header></Header>

<FileUpload></FileUpload>

<div class="grid grid-cols-2 gap-6">
	<TextEditor></TextEditor>
	<div class="m-0 flex w-full flex-col rounded-md border-2 border-black p-4">
		{#each output as line}
			<p>{line}</p>
		{/each}
	</div>
</div>
