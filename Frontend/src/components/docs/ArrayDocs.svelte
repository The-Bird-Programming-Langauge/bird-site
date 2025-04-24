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
	<DocsHeader1 id="arrays">Arrays</DocsHeader1>
	<DocsSection>
		<DocsHeader3>Array Declaration</DocsHeader3>
		<DocsText
			>Arrays hold a collection of elements all of the same type. When declaring an empty array, the
			type must be provided.</DocsText
		>
		<DocsCode>
			{#await getCode('ArrayDeclaration') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>Indexing</DocsHeader3>
		<DocsText>You can access the values in an array by indexing with square brackets.</DocsText>
		<DocsCode>
			{#await getCode('ArrayIndexing') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>The Length Function</DocsHeader3>
		<DocsText
			>You can access the length of the array through the
			<DocsInlineCode>length</DocsInlineCode>
			function.</DocsText
		>
		<DocsCode>
			{#await getCode('ArrayLength') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>The Push Function</DocsHeader3>
		<DocsText
			>You can append elements of the same type into the array by using the
			<DocsInlineCode>push</DocsInlineCode>
			function.</DocsText
		>
		<DocsCode>
			{#await getCode('ArrayPush') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
</Section>
