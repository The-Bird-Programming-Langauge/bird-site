<script lang="ts">
	import FileUpload from '../components/file-upload.svelte';
	import Header from '../components/header.svelte';
	import { consoleOutput } from '$lib/console-output';
	import { onDestroy, onMount } from 'svelte';
	import MyCodeMirror from '../components/my-code-mirror.svelte';
	import Center from '../components/center.svelte';
	import Squeeze from '../components/squeeze.svelte';
	import type { Unsubscriber, Writable } from 'svelte/store';

	let output: string[] = [];

	let sub: Unsubscriber;
	onMount(() => {
		let console = document.getElementById('console');
		sub = consoleOutput.subscribe((value) => {
			output = value;

			if (console) {
				console.scrollTop = console.scrollHeight - console.clientHeight;
			}
		});
	});

	onDestroy(() => {
		if (sub) {
			sub();
		}
	});
</script>

<Center>
	<Squeeze>
		<div class="mb-4">
			<Header></Header>
		</div>

		<div class="mb-2">
			<FileUpload></FileUpload>
		</div>

		<div class="flex flex-col gap-4">
			<MyCodeMirror></MyCodeMirror>
			<div class="flex w-full flex-col gap-4">
				<div
					class="m-0 flex h-96 flex-grow flex-col overflow-scroll rounded-md border-2 border-blue-500 p-4"
					id="console"
				>
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
	</Squeeze>
</Center>
