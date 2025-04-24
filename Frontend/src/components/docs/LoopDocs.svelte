<script>
	import { getCode } from '$lib/getCode';
	import { lex } from '$lib/lex';
	import Section from '../section.svelte';
	import DocsCode from './DocsCode.svelte';
	import DocsHeader1 from './DocsHeader1.svelte';
	import DocsHeader3 from './DocsHeader3.svelte';
	import DocsSection from './DocsSection.svelte';
	import DocsText from './DocsText.svelte';
</script>

<Section>
	<DocsHeader1 id="loops">Loops</DocsHeader1>
	<DocsSection>
		<DocsHeader3 id="for-loops">For Loops</DocsHeader3>
		<DocsText
			>For loops allow you to iterate over a sequence or range of values, executing a block of code
			for each iteration.</DocsText
		>
		<DocsCode>
			{#await getCode('forLoops') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3 id="while-loops">While Loops</DocsHeader3>
		<DocsText
			>Continue to loop until the while loop condition becomes false or the loop exits.</DocsText
		>
		<DocsCode>
			{#await getCode('whileLoops') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3 id="continue-and-break">Continue and Break</DocsHeader3>
		<DocsText
			>Continue and break add additional control flow functionality to loops. If you want to
			immediately skip to the next loop iteraction, use continue.</DocsText
		>
		<DocsCode>
			{#await getCode('continueStatement') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
		<DocsText>If you want to immediately exit the loop, use break.</DocsText>
		<DocsCode>
			{#await getCode('breakStatement') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
</Section>
