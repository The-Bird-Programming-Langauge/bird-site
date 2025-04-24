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
	<DocsHeader1 id="namespaces">Namespaces</DocsHeader1>
  <DocsText>
    Namespaces allow you to encapsulate a group of declarative statements. Statements that can be created in namespaces include variable declarations, structs, types, functions, and other namespaces.
  </DocsText>

	<DocsSection>
		<DocsHeader3>Namespace Creation</DocsHeader3>
		<DocsText>
			To create a namespace, use the <DocsInlineCode>namespace</DocsInlineCode> keyword followed by the namespace identifier followed by a block of namespace statements.
		</DocsText>
		<DocsCode>
			{#await getCode('namespaceCreation') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>

	<DocsSection>
		<DocsHeader3>Accessing Namespace Statements</DocsHeader3>
		<DocsText>
			To access the identifiers created within a namespace, you must use a prefix before the identifier. This prefix uses the <DocsInlineCode>::</DocsInlineCode> operator to sepparate the namespace from the identifer. Additionally, if an identifer is within a doubly nested namespace, you will need to specify each namespace layer.
		</DocsText>
    <DocsCode>
      {#await getCode('accessingNamespaceStatements') then code}
        {@html lex(code)}
      {/await}
    </DocsCode>
	</DocsSection>
</Section>