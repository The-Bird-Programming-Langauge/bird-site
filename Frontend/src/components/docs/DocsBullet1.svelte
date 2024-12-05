<script lang="ts">
	export let text = '';
	export let href = '';
</script>

<li class="list-disc">
	<a {href} class="text-2xl hover:cursor-pointer hover:underline">{text}</a>
	<ul class="block pl-10 text-2xl"><slot></slot></ul>
</li>
