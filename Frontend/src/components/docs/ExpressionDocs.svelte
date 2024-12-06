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
	<DocsHeader1 id="expressions">Expressions</DocsHeader1>
	<DocsText>Expressions types can be used in combination to return a desired value after undergoing an operation. Supported arithemtic operators:
		<DocsInlineCode>+</DocsInlineCode>,
		<DocsInlineCode>-</DocsInlineCode>,
		<DocsInlineCode>*</DocsInlineCode>,
		<DocsInlineCode>/</DocsInlineCode>,
		<DocsInlineCode>%</DocsInlineCode>.
	</DocsText>
	<DocsSection>
		<DocsHeader3 id="arithmetic-expressions">Arithmetic Expressions</DocsHeader3>
		<DocsText>Birds supports basic arithmetic operators to perform calculations on numeric values.</DocsText>
		<DocsCode>
			{#await getCode('arithmeticExpressions') then code} 
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3 id="comparison-expressions">Comparison Expressions</DocsHeader3>
		<DocsText>Comparison expressions return a boolean type indicating the relationship between two values.</DocsText>
        <DocsText>Comparison operators:
			<DocsInlineCode>&lt;</DocsInlineCode>,
			<DocsInlineCode>&gt;</DocsInlineCode>,
			<DocsInlineCode>&lt;=</DocsInlineCode>,
			<DocsInlineCode>&gt;=</DocsInlineCode>. 
        </DocsText>
        <DocsText>Equality operators:
			<DocsInlineCode>==</DocsInlineCode>,
			<DocsInlineCode>!=</DocsInlineCode>.
		</DocsText>
		<DocsCode>
			{#await getCode('comparisonExpressions') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3 id="ternary-expressions">Ternary Expressions</DocsHeader3>
		<DocsText>Given an input condition to a ternary expression, the expression will return one of two options based on the condition.</DocsText>
		<DocsCode>
			{#await getCode('ternaryExpressions') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
</Section>