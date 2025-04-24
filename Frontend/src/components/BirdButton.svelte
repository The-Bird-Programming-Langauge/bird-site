<script lang="ts">
	import { Button } from 'flowbite-svelte';

	export let onclick: (() => void) | (() => Promise<void>);
	export let type: 'submit' | 'reset' | 'button' | null | undefined = 'button';
	export let color: 'primary' | 'dark' | 'yellow' = 'primary';
</script>

{#if color == 'primary'}
	<Button {onclick} class="bg-primary-700 w-fit rounded px-4 py-2 font-bold" {type}>
		<slot></slot>
	</Button>
{:else if color == 'dark'}
	<Button {onclick} class="bg-color-dark w-fit rounded px-4 py-2 font-bold" {type}>
		<slot></slot>
	</Button>
{:else if color == 'yellow'}
	<Button {onclick} class="w-fit rounded bg-yellow-300 px-4 py-2 font-bold" {type}>
		<slot></slot>
	</Button>
{/if}
