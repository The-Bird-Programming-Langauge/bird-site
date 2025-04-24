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
	<DocsHeader1 id="import-statements">Import Statements</DocsHeader1>
  <DocsText>
    Import statements allow you to import standard library statements directly into the current file so that you can use pre-made functions without having to implement them.
  </DocsText>

	<DocsSection>
		<DocsHeader3>Importing Statements</DocsHeader3>
		<DocsText>
			To import standard library statements, use the <DocsInlineCode>import</DocsInlineCode> keyword followed by the namespace paths to the standard library statements.
		</DocsText>
		<DocsCode>
			{#await getCode('importingStatements') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>

	<DocsSection>
		<DocsHeader3>Importing Namespaces</DocsHeader3>
		<DocsText>
			You can also import entire standard library namespaces which includes all the the statements within the namespace.
		</DocsText>
    <DocsCode>
      {#await getCode('importingNamespaces') then code}
        {@html lex(code)}
      {/await}
    </DocsCode>
	</DocsSection>

	<DocsSection>
		<DocsHeader3>Importing with the From Keyword</DocsHeader3>
		<DocsText>
			The <DocsInlineCode>from</DocsInlineCode> keyword allows you to specify the namespace prefix of import paths.
		</DocsText>
    <DocsCode>
      {#await getCode('importingWithTheFromKeyword') then code}
        {@html lex(code)}
      {/await}
    </DocsCode>
	</DocsSection>
</Section>