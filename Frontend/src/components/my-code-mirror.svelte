<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { textEditorCode } from '$lib/text-editor-code';
	import { onDestroy, onMount } from 'svelte';
	import { compileBird, compileWat } from '$lib/compile';
	import type { Unsubscriber } from 'svelte/store';
	import { consoleOutput } from '$lib/console-output';
	import { currentLanguage } from '$lib/current-language';
	import { Button, Select } from 'flowbite-svelte';

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

	let codeType: 'bird' | 'wasm' = 'bird';
	const sub3 = currentLanguage.subscribe((value) => {
		codeType = value;
	});

	onDestroy(() => {
		if (sub) {
			sub();
		}
		if (sub2) {
			sub2();
		}

		if (sub3) {
			sub3();
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
			class="border-primary m-0 flex h-48 flex-grow flex-col overflow-auto rounded-b-[0.5rem] border-2 p-4"
			id="console"
		>
			{#each output as line}
				<p class="whitespace-pre">{line}</p>
			{/each}
		</div>
	</div>
	<div class="flex w-full justify-between gap-2">
		<div class="flex gap-4">
			<Select
				items={[
					{ value: 'bird', name: 'Bird' },
					{ value: 'wasm', name: 'WebAssembly' }
				]}
				bind:value={codeType}
				class="rounded-md"
				onchange={(
					ev: Event & {
						currentTarget: EventTarget & HTMLSelectElement;
					}
				) => {
					if (ev.currentTarget.value === 'bird' || ev.currentTarget.value === 'wasm') {
						currentLanguage.set(ev.currentTarget.value);
					}
				}}
			></Select>
			<Select
				class="rounded-md"
				items={[
					{ value: 'helloWorld', name: 'Hello, World!' },
					{ value: 'fibonacci', name: 'Fibonacci' },
					{ value: 'factorial', name: 'Factorial' }
				]}
				onchange={(
					ev: Event & {
						currentTarget: EventTarget & HTMLSelectElement;
					}
				) => {
					switch (ev.currentTarget.value) {
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
							break;
						case 'factorial':
							textEditorCode.set(`
fn factorial(n: int) -> int {
	if n <= 1 {
		return 1;
	}
	return n * factorial(n - 1);
}
						`);
							break;
						default:
					}
				}}
			></Select>
		</div>
		<div class="flex gap-2">
			<Button
				class="w-fit rounded px-4 py-2 font-bold"
				onclick={() => {
					consoleOutput.set([]);
				}}
			>
				Clear
			</Button>
			<Button
				type="submit"
				class="w-fit rounded px-4 py-2 font-bold"
				onclick={async () => {
					if (codeType === 'bird') {
						await compileBird(code);
					} else {
						await compileWat(code);
					}
				}}
			>
				Run
			</Button>
		</div>
	</div>
</div>
