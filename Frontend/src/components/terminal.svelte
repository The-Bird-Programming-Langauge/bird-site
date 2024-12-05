<script lang="ts">
	import { consoleOutput } from '$lib/console-output';
</script>

<div class="bg-color-dark m-0 flex h-full flex-grow flex-col overflow-auto p-4">
	{#each $consoleOutput as line}
		<p class="text-color-on-dark whitespace-pre text-xl">{line}</p>
	{/each}
</div>
