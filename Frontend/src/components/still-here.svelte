<script lang="ts">
	import DocsText from './docs/DocsText.svelte';
	import Section from './section.svelte';

	export let color: 'yellow' | 'none' | 'primary' = 'none';
</script>

<Section {color}>
	<div class="flex justify-center">
		<div>
			<h2>Still here?</h2>
			<DocsText
				>Check out the
				<a href="/playground" class=" text-lack underline"> playground! </a>
			</DocsText>
		</div>
	</div>
</Section>
