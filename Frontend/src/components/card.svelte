<script lang="ts">
	export let title = 'Card';
	export let subtitle = 'Subtitle';
</script>

<div class="border-primary rounded-md border p-6">
	<h2 class="font-bold">{title}</h2>
	<p class="text-medium-light mb-2 text-sm">{subtitle}</p>

	<hr />

	<slot></slot>
</div>
