<script lang="ts">
	import Center from './center.svelte';
	import Squeeze from './squeeze.svelte';
	export let color: 'yellow' | 'primary' | 'none' = 'primary';
</script>

{#if color === 'primary'}
	<div class="bg-primary-400 p-12">
		<Center>
			<Squeeze>
				<slot></slot>
			</Squeeze>
		</Center>
	</div>
{:else if color === 'yellow'}
	<div class="bg-orange-400 p-12">
		<Center>
			<Squeeze>
				<slot></slot>
			</Squeeze>
		</Center>
	</div>
{:else}
	<div class="p-12">
		<Center>
			<Squeeze>
				<slot></slot>
			</Squeeze>
		</Center>
	</div>
{/if}
