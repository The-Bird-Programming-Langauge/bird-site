<script lang="ts">
	import Center from '../../components/center.svelte';
	import Header from '../../components/header.svelte';
	import Section from '../../components/section.svelte';
	import StillHere from '../../components/still-here.svelte';
	import TableOfContents from './table-of-contents.svelte';
</script>

<Header></Header>

<Section color="yellow">
	<Center>
		<h1 class="font-bold">Bird's Documentation</h1>
	</Center>
</Section>
<TableOfContents></TableOfContents>

<StillHere color="none"></StillHere>
