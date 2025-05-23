<script lang="ts">
	import { compileBird } from '$lib/compile';
	import { consoleOutput } from '$lib/console-output';
	import { currentCompiledWat } from '$lib/current-compiled-wat';
	import { textEditorCode } from '$lib/text-editor-code';
	import { get_extensions } from '$lib/codemirror/codemirror_helpers';
	import { oneDarkTheme } from '@codemirror/theme-one-dark';
	import { Label, Select, TabItem, Tabs } from 'flowbite-svelte';
	import CodeMirror from 'svelte-codemirror-editor';
	import BirdButton from '../../components/BirdButton.svelte';
	import Header from '../../components/header.svelte';
	import { getCode } from '$lib/getCode';

	let pressed = new Set<string>();
	async function handleKeys() {
		if ((pressed.has('Meta') || pressed.has('Control')) && pressed.has('Enter')) {
			$consoleOutput = [];
			await compileBird($textEditorCode);
		}
	}
</script>

<svelte:body
	onkeydown={(e) => {
		pressed.add(e.key);
		handleKeys();
	}}
	onkeyup={(e) => {
		pressed.delete(e.key);
	}}
/>

<div class="flex min-h-full flex-col">
	<Header></Header>

	<div class="flex w-full grow bg-[#282c34]">
		<CodeMirror
			extensions={[
				...get_extensions(), // Apply extensions for additional functionality like syntax highlighting.
				oneDarkTheme
			]}
			basic
			bind:value={$textEditorCode}
			tabSize={4}
			class="col-span-2 flex w-full  *:w-full"
			styles={{
				div: {
					'font-size': '1rem'
				}
			}}
		></CodeMirror>
	</div>
	<div class="bg-slate-900">
		<div class="bg-primary-400 flex items-end justify-end p-2">
			<div class="flex flex-row gap-4">
				<Label for="code examples">Code Examples</Label>
				<Select
					id="code examples"
					class="rounded-md"
					items={[
						{ value: 'helloWorld', name: 'Hello, World!' },
						{ value: 'fibonacci', name: 'Fibonacci' },
						{ value: 'factorial', name: 'Factorial' },
						{ value: 'sestosaVVirginica', name: 'Logistic Regression: Sestosa Virginica' },
						{ value: 'sestosaVVersicolor', name: 'Logistic Regression: Sestosa Versicolor' },
						{ value: 'versicolorVVirginica', name: 'Logistic Regression: Versicolor Virginica' },
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
				<BirdButton
					color="dark"
					onclick={async () => {
						$consoleOutput = [];
						await compileBird($textEditorCode);
					}}
				>
					Run
				</BirdButton>
			</div>
		</div>
		<Tabs contentClass="" tabStyle="underline">
			<TabItem
				title="Result"
				open
				activeClasses="p-4 text-primary-500"
				inactiveClasses="p-4 text-gray-400"
			>
				<div class="h-full">
					{#each $consoleOutput as line}
						<div class="m-0 whitespace-pre p-4">
							<p class="text-color-on-dark">{line}</p>
						</div>
					{/each}
				</div>
			</TabItem>
			<TabItem
				title="Compiled WebAssembly"
				activeClasses="p-4 text-primary-500"
				inactiveClasses="p-4 text-gray-400"
			>
				<div class="m-0 whitespace-pre p-4">
					<p class="text-color-on-dark text-xl">{$currentCompiledWat}</p>
				</div>
			</TabItem>
		</Tabs>
	</div>
</div>
