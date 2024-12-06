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
	<DocsHeader1 id="comments">Comments</DocsHeader1>
	<DocsSection>
		<DocsHeader3 id="single-line-comments">Single Line Comments</DocsHeader3>
		<DocsText
			>Comment out single lines using the
			<DocsInlineCode>//</DocsInlineCode>
			prefix.</DocsText
		>
		<DocsCode>
			{#await getCode('singleLineComment') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3 id="multi-line-comments">Multi-Line Comments</DocsHeader3>
		<DocsText
			>Comment out multiple lines using the <DocsInlineCode>/*</DocsInlineCode> prefix in combination
			with the <DocsInlineCode>*/</DocsInlineCode> suffix.</DocsText
		>
		<DocsCode>
			{#await getCode('multiLineComment') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
</Section>