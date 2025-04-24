<script>
	import { getCode } from '$lib/getCode';
	import { lex } from '$lib/lex';
	import Section from '../section.svelte';
	import DocsCode from './DocsCode.svelte';
	import DocsHeader1 from './DocsHeader1.svelte';
	import DocsText from './DocsText.svelte';
</script>

<Section>
	<DocsHeader1 id="print-statement">Print Statement</DocsHeader1>
	<DocsText>Use a print statement to print a value.</DocsText>
	<DocsCode>
		{#await getCode('printStatement') then code}
			{@html lex(code)}
		{/await}
	</DocsCode>
</Section>
