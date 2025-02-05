<script>
	import CodeMirror from 'svelte-codemirror-editor';
	import { textEditorCode } from '$lib/text-editor-code';
	import { oneDarkTheme } from '@codemirror/theme-one-dark';
	import Terminal from '../../components/terminal.svelte';
	import Header from '../../components/header.svelte';
	import BirdButton from '../../components/BirdButton.svelte';
	import { consoleOutput } from '$lib/console-output';
	import { compileBird } from '$lib/compile';
	import { TabItem, Tabs } from 'flowbite-svelte';
	import { currentCompiledWat } from '$lib/current-compiled-wat';
</script>

<div class="flex min-h-full flex-col">
	<Header></Header>
	<div class="flex grow">
		<div class="grid w-full grid-cols-3">
			<CodeMirror
				extensions={[oneDarkTheme]}
				basic
				bind:value={$textEditorCode}
				tabSize={8}
				class="col-span-2 *:h-full"
				styles={{
					div: {
						'font-size': '1rem'
					}
				}}
			></CodeMirror>
			<div class="h-full bg-slate-900">
				<Tabs contentClass="" tabStyle="underline">
					<TabItem
						title="Result"
						open
						activeClasses="p-4 text-primary-500"
						inactiveClasses="p-4 text-gray-400"
					>
						<div class="h-full">
							<Terminal></Terminal>
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
	</div>
	<div class="bg-primary-700 flex items-end justify-end p-6">
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
