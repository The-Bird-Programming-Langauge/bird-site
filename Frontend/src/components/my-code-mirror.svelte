<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { textEditorCode } from '$lib/text-editor-code';
	import { onDestroy, onMount } from 'svelte';
	import { compileBird } from '$lib/compile';
	import type { Unsubscriber } from 'svelte/store';
	import { consoleOutput } from '$lib/console-output';

	let code = '';
	const sub = textEditorCode.subscribe((value) => {
		code = value || '\n\n\n\n\n\n\n\n\n\n';
	});
	let output: string[] = [];

	let sub2: Unsubscriber;
	onMount(() => {
		let console = document.getElementById('console');
		sub2 = consoleOutput.subscribe((value) => {
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
		if (sub2) {
			sub2();
		}
	});

	onDestroy(sub);
</script>

<div class="flex flex-col gap-4">
	<div class="h-max-full flex flex-col">
		<CodeMirror
			bind:value={code}
			styles={{
				div: {
					'background-color': 'rgb(204 251 241)',
					color: 'color: rgb(51 65 85)'
				}
			}}
		/>
		<div
			class="m-0 flex h-24 flex-grow flex-col overflow-auto rounded-b-[0.5rem] border-2 border-[ligthblue] p-4"
			id="console"
		>
			{#each output as line}
				<p>{line}</p>
			{/each}
		</div>
	</div>
	<div class="flex w-full justify-between gap-2">
		<select
			class="text-slate-200"
			onchange={(ev) => {
				switch (ev.target.value) {
					case 'helloWorld':
						textEditorCode.set(`
print "Hello, World!";
						`);
						break;
					case 'fibonacci':
						textEditorCode.set(`
fn fib(n: int) -> int {
	if n <= 1 {
		return n;
	}
	return fib(n - 1) + fib(n - 2);
}
						`);
					case 'factorial':
						textEditorCode.set(`
fn factorial(n: int) -> int {
	if n <= 1 {
		return 1;
	}
	return n * factorial(n - 1);
}
						`);
					default:
				}
			}}
		>
			<option value="helloWorld">Hello World</option>
			<option value="fibonacci">Fibonacci</option>
			<option value="factorial">Factorial</option>
		</select>
		<div class="flex gap-2">
			<button
				class="w-fit rounded bg-teal-100 px-4 py-2 font-bold text-slate-700 hover:bg-teal-300"
				onclick={() => {
					consoleOutput.set([]);
				}}
			>
				Clear
			</button>
			<button
				type="submit"
				class="w-fit rounded bg-teal-100 px-4 py-2 font-bold text-slate-700 hover:bg-teal-300"
				onclick={async () => {
					await compileBird(code);
				}}
			>
				Run
			</button>
		</div>
	</div>
</div>
