<script lang="ts">
	import { compileBird, compileWat } from '$lib/compile';
	import { consoleOutput } from '$lib/console-output';
	import { currentLanguage } from '$lib/current-language';
	import { getCode } from '$lib/getCode';
	import { lex } from '$lib/lex';
	import { textEditorCode } from '$lib/text-editor-code';
	import { get_extensions } from '$lib/codemirror/codemirror_helpers';
	import { oneDarkTheme } from '@codemirror/theme-one-dark';
	import { Label, Select } from 'flowbite-svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import CodeMirror from 'svelte-codemirror-editor';
	import BirdButton from '../components/BirdButton.svelte';
	import DocsCode from '../components/docs/DocsCode.svelte';
	import FileUpload from '../components/file-upload.svelte';
	import Header from '../components/header.svelte';
	import Section from '../components/section.svelte';
	import Terminal from '../components/terminal.svelte';
	import DocsText from '../components/docs/DocsText.svelte';

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
			path: 'familiarSyntax'
		},
		{
			title: 'Modern Features',
			subtitle:
				'Bird has modern features like pattern matching, generics, and type inference. Bird is designed to be a modern language that is easy to use and powerful.',
			path: 'modernFeatures'
		},
		{
			title: 'Expressive Types',
			subtitle:
				'Bird has expressive types that make it easy to write safe and efficient code. Bird is a statically typed language that is designed to catch errors at compile time.',
			path: 'expressiveTypes'
		}
	];
</script>

<Header></Header>
<Section color="yellow">
	<div class="flex flex-col gap-12">
		<div class="xl:p-24">
			<h1 class="font-bold">
				A Fast, Principled, and <span class="underline">Web-First</span> Language.
			</h1>
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
				<div class="grid grid-cols-1 gap-12 xl:grid-cols-2">
					<div>
						<h2 class="font-bold text-black">{example.title}</h2>
						<p class="text-2xl">{example.subtitle}</p>
					</div>
					<DocsCode>
						{#await getCode(example.path) then code}
							{@html lex(code)}
						{/await}
					</DocsCode>
				</div>
			{/each}
		</div>
	</div>
</Section>
<Section color="none">
	<div class="flex flex-col gap-12">
		<div class="xl:p-24">
			<div class="mb-6">
				<h1 class="font-bold">Bird is a Web-First Language.</h1>
				<p class="mt-4 self-end text-2xl">
					Bird is a web-first language that is designed to be compiled to WebAssembly and run in the
					browser. Bird is a statically typed language with a focus on simplicity and performance.
				</p>
			</div>
			<div class="mb-6">
				<h2 class="font-bold">What is WebAssembly?</h2>
				<p class="mt-4 self-end text-2xl">
					WebAssembly (wasm) is a new type of code that can be run in modern web browsers. It is a
					low-level assembly-like language that is designed to be fast and efficient. WebAssembly is
					designed to allow developers to write code in languages like C and C++ and compile it to
					run in the browser.
				</p>
				<p class="mt-4 self-end text-2xl">
					Check out more about WebAssembly <a
						href="https://webassembly.org/"
						class="decoration-primary-500 text-primary-700 underline">here</a
					>.
				</p>
			</div>
			<div class="mb-6">
				<h2 class="font-bold">With the power of WebAssembly!</h2>
				<p class="mt-4 self-end text-2xl">
					With the power of WebAssembly, Bird can run in the browser at near-native speeds. This
					makes it possible to write high-performance web applications in Bird that run in the
					browser.
				</p>
			</div>
		</div>
	</div>
</Section>

<Section color="yellow">
	<h1 class="text-center font-bold">Try out Bird!</h1>
	<div class="flex flex-col gap-4">
		<FileUpload></FileUpload>
		<div>
			<CodeMirror
				extensions={[
					...get_extensions(), // Apply extensions for additional functionality like syntax highlighting.
					oneDarkTheme
				]}
				bind:value={$textEditorCode}
				tabSize={4}
				styles={{
					div: {
						'font-size': '1.5rem'
					}
				}}
			></CodeMirror>
			<Terminal></Terminal>
		</div>
		<div class="flex justify-between">
			<div class="flex gap-4">
				<Label for="language">Language</Label>
				<Select
					id="language"
					items={[
						{ value: 'bird', name: 'Bird' },
						{ value: 'wasm', name: 'WebAssembly' }
					]}
					bind:value={$currentLanguage}
					class="rounded-md"
					onchange={(ev: Event & { currentTarget: EventTarget & HTMLSelectElement }) => {
						if (ev.currentTarget.value === 'bird' || ev.currentTarget.value === 'wasm') {
							currentLanguage.set(ev.currentTarget.value);
						}
					}}
				></Select>
				<Label for="code examples">Code Examples</Label>
				<Select
					id="code examples"
					class="rounded-md"
					items={[
						{ value: 'helloWorld', name: 'Hello, World!' },
						{ value: 'fibonacci', name: 'Fibonacci' },
						{ value: 'factorial', name: 'Factorial' },
						{ value: '3or5', name: 'Challenge: 3 or 5' },
						{ value: 'climbingStairs', name: 'Challenge: Climbing Stairs' },
						{ value: 'preorderSearch', name: 'Challenge: Preorder Search' },
						{ value: 'isEven', name: 'Challenge: Is Even' },
						{ value: 'add', name: 'Challenge: Add Two Numbers' }
					]}
					onchange={async (ev: Event & { currentTarget: EventTarget & HTMLSelectElement }) => {
						textEditorCode.set(await getCode(ev.currentTarget.value));
					}}
				></Select>
			</div>
			<BirdButton
				onclick={async () => {
					$consoleOutput = [];
					if ($currentLanguage === 'bird') {
						await compileBird($textEditorCode);
					} else {
						await compileWat($textEditorCode);
					}
				}}>Run</BirdButton
			>
		</div>
	</div>
</Section>

<Section>
	<div class="flex justify-center">
		<div>
			<h2>Still here?</h2>
			<DocsText
				>Check out the
				<a href="/playground" class="text-white underline"> playground! </a>
			</DocsText>
		</div>
	</div>
</Section>
