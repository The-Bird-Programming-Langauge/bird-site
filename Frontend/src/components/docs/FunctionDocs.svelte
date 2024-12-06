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
	<DocsHeader1 id="functions">Functions</DocsHeader1>
	<DocsSection>
		<DocsHeader2 id="function-declarations">Function Declarations</DocsHeader2>
		<DocsText>
			Functions in Bird are declared using the <DocsInlineCode>fn</DocsInlineCode> keyword followed by
			the function name and parameters. The function body is enclosed in curly braces.
		</DocsText>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>Void Functions</DocsHeader3>
		<DocsText>
			Void functions do not return a value. The return type can be omitted from the function
			declaration.
		</DocsText>
		<DocsCode>
			{#await getCode('voidFunctionDeclarations') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>Functions with Return Types</DocsHeader3>
		<DocsText>
			Functions can have return types. The return type must by specified after the function name and
			parameters.
		</DocsText>
		<DocsCode>
			{#await getCode('functionDeclarationWithReturnType') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader2 id="function-calls">Function Calls</DocsHeader2>
		<DocsText>
			Functions in Bird are called using the function name followed by the arguments enclosed in
			parentheses.
		</DocsText>
		<DocsCode>
			{#await getCode('functionCalls') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
</Section>
