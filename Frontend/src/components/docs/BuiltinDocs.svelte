<script>
	import { getCode } from '$lib/getCode';
	import { lex } from '$lib/lex';
	import Section from '../section.svelte';
	import DocsCode from './DocsCode.svelte';
	import DocsHeader1 from './DocsHeader1.svelte';
	import DocsHeader3 from './DocsHeader3.svelte';
	import DocsInlineCode from './DocsInlineCode.svelte';
	import DocsSection from './DocsSection.svelte';
	import DocsText from './DocsText.svelte';
</script>

<Section>
	<DocsHeader1 id="builtins">Builtins</DocsHeader1>
	<DocsSection>
		<DocsHeader3>
			<DocsInlineCode>length</DocsInlineCode>
		</DocsHeader3>
		<DocsText>The length function allows you to access the length of arrays or strings.</DocsText>
		<DocsCode>
			{#await getCode('Length') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>
			<DocsInlineCode>push</DocsInlineCode>
		</DocsHeader3>
		<DocsText
			>The push function allows you to append elements of the same type to an array.</DocsText
		>
		<DocsCode>
			{#await getCode('ArrayPush') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>
			<DocsInlineCode>gc</DocsInlineCode>
		</DocsHeader3>
		<DocsText>The gc function runs the garbage collector manually.</DocsText>
		<DocsCode>
			{#await getCode('Gc') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>
			<DocsInlineCode>iter</DocsInlineCode>
		</DocsHeader3>
		<DocsText>The iter function turns arrays and strings into iterators.</DocsText>
		<DocsCode>
			{#await getCode('iter') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
</Section>
