<script>
	import { getCode } from '$lib/getCode';
	import { lex } from '$lib/lex';
	import Section from '../section.svelte';
	import DocsCode from './DocsCode.svelte';
	import DocsHeader1 from './DocsHeader1.svelte';
	import DocsHeader2 from './DocsHeader2.svelte';
	import DocsHeader3 from './DocsHeader3.svelte';
	import DocsInlineCode from './DocsInlineCode.svelte';
	import DocsSection from './DocsSection.svelte';
	import DocsText from './DocsText.svelte';
</script>

<Section>
	<DocsHeader1 id="types">Types</DocsHeader1>
	<DocsSection>
		<DocsHeader3 id="primitive-types">Primitive Types</DocsHeader3>
		<DocsText
			>Bird supports the following primitive types:
			<DocsInlineCode>int</DocsInlineCode>,
			<DocsInlineCode>bool</DocsInlineCode>,
			<DocsInlineCode>float</DocsInlineCode>,
			<DocsInlineCode>str</DocsInlineCode>.
		</DocsText>
		<DocsCode>
			{#await getCode('primitiveTypes') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3 id="type-declaration">Type Declaration</DocsHeader3>
		<DocsText>You can create a type identifier to represent a primitive type.</DocsText>
		<DocsCode>
			{#await getCode('typeDeclaration') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
</Section>