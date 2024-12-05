<script lang="ts">
	import { Button } from 'flowbite-svelte';

	export let onclick: (() => void) | (() => Promise<void>);
	export let type: 'submit' | 'reset' | 'button' | null | undefined = 'button';
</script>

<Button {onclick} class="w-fit rounded px-4 py-2 font-bold " {type}>
	<slot></slot>
</Button>
