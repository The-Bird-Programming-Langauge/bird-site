<script lang="ts">
	export let title = 'Card';
	export let subtitle = 'Subtitle';
</script>

<div class="w-full rounded-md border border-teal-50 p-6">
	<h2 class="font-bold">{title}</h2>
	<p class="mb-2 text-sm text-slate-300">{subtitle}</p>

	<hr />

	<slot></slot>
</div>
