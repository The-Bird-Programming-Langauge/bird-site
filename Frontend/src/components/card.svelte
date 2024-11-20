<script lang="ts">
	export let title = 'Card';
	export let subtitle = 'Subtitle';
</script>

<div class="overflow-scroll rounded-md border border-primary p-6">
	<h2 class="font-bold">{title}</h2>
	<p class="mb-2 text-sm text-medium-light">{subtitle}</p>

	<hr />

	<slot></slot>
</div>
