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
	<DocsHeader1 id="if-statements">If Statements</DocsHeader1>
	<DocsText>Bird uses if statements as a basic form of control flow.</DocsText>
	<DocsCode>
		{#await getCode('basicIfStatement') then code}
			{@html lex(code)}
		{/await}
	</DocsCode>
	<DocsText>Use "else" and "else if" to add additional control flow.</DocsText>
	<DocsCode>
		{#await getCode('complexIfStatement') then code}
			{@html lex(code)}
		{/await}
	</DocsCode>
</Section>