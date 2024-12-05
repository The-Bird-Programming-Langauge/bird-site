<script lang="ts">
	import { consoleOutput } from '$lib/console-output';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import FileUpload from '../components/file-upload.svelte';
	import Header from '../components/header.svelte';
	import MyCodeMirror from '../components/my-code-mirror.svelte';
	import DocsCode from '../components/docs/DocsCode.svelte';
	import Section from '../components/section.svelte';

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

	let examples = [
		{
			title: 'Familiar Syntax',
			subtitle:
				'Bird has a familiar syntax that is easy to read and write.  You can write Bird code in any text editor and compile it to WebAssembly.',
			code: `
fn add(x: int, y: int) -> int {
  return x + y;
}
		`
		},
		{
			title: 'Modern Features',
			subtitle:
				'Bird has modern features like pattern matching, generics, and type inference. Bird is designed to be a modern language that is easy to use and powerful.',
			code: `
fn fib(n: int) -> int {
	return match n {
		0 => 0,
		1 => 1,
		else => fib(n - 1) + fib(n - 2),
	}
}
	`
		},
		{
			title: 'Expressive Types',
			subtitle:
				'Bird has expressive types that make it easy to write safe and efficient code. Bird is a statically typed language that is designed to catch errors at compile time.',
			code: `
fn add<T>(x: T, y: T) -> T {	
	return x + y;
}
		`
		}
	];
</script>

<Header></Header>
<Section color="yellow">
	<div class="flex flex-col gap-12">
		<div class="p-24">
			<h1 class="font-bold">A Fast, Principled, and Web-First Language.</h1>
			<p class="mt-4 self-end text-2xl">
				Bird is a fast, principled, and web-first language. It is designed to be compiled to
				WebAssembly and run in the browser. Bird is a statically typed language with a focus on
				simplicity and performance.
			</p>
		</div>
	</div>
</Section>
<Section color="primary">
	<div class="flex flex-col gap-12">
		<div class="flex flex-col gap-12">
			{#each examples as example}
				<div class="grid grid-cols-2 gap-12">
					<div>
						<h2 class="font-bold text-black">{example.title}</h2>
						<p class="text-2xl">{example.subtitle}</p>
					</div>
					<DocsCode>{example.code}</DocsCode>
				</div>
			{/each}
		</div>
	</div>
</Section>
<Section color="none">
	<h1 class="text-center font-bold">Try out Bird!</h1>
	<div class="flex flex-col gap-4">
		<FileUpload></FileUpload>
		<MyCodeMirror></MyCodeMirror>
	</div>
</Section>
