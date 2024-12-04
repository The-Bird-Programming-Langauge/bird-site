<script lang="ts">
	import FileUpload from '../components/file-upload.svelte';
	import Header from '../components/header.svelte';
	import { consoleOutput } from '$lib/console-output';
	import { onDestroy, onMount } from 'svelte';
	import MyCodeMirror from '../components/my-code-mirror.svelte';
	import Center from '../components/center.svelte';
	import Squeeze from '../components/squeeze.svelte';
	import type { Unsubscriber } from 'svelte/store';
	// import Card from '../components/card.svelte';
	import Code from '../components/code.svelte';
	import { Card } from 'flowbite-svelte';

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
			subtitle: 'Simple and easy to read',
			code: `
fn add(x: int, y: int) -> int {
  return x + y;
}
		`
		},
		{
			title: 'Modern Features',
			subtitle: 'Novel and Expressive',
			code: `
fn fib(n: int) -> int {
	return match n {
		0 => 0,
		1 => 1,
		else => fib(n - 1) + fib(n - 2),
	}
}`
		},
		{
			title: 'Expressive Types',
			subtitle: 'Static and Strongly Typed',
			code: `
fn add<T>(x: T, y: T) -> T {	
	return x + y;
}
		`
		}
	];
</script>

<Header></Header>
<div class="p-12">
	<Center>
		<Squeeze>
			<div class="flex flex-col gap-12">
				<div>
					<h1>A Fast, Principled, and Web-First Language.</h1>
					<p class="mt-4 self-end text-lg">
						Bird is a fast, principled, and web-first language. It is designed to be compiled to
						WebAssembly and run in the browser. Bird is a statically typed language with a focus on
						simplicity and performance.
					</p>
				</div>

				<div class="grid grid-cols-2 gap-2">
					{#each examples as example}
						<Card class="w-full overflow-scroll">
							<h2>{example.title}</h2>
							<p>{example.subtitle}</p>
							<Code code={example.code}></Code>
						</Card>
					{/each}
				</div>

				<h1 class="text-center">Try out Bird!</h1>
				<div class="flex flex-col gap-4">
					<FileUpload></FileUpload>
					<MyCodeMirror></MyCodeMirror>
				</div>
			</div>
		</Squeeze>
	</Center>
</div>
