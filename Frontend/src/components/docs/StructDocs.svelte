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
	<DocsHeader1 id="structs">Structs</DocsHeader1>
	<DocsSection>
		<DocsHeader3>Struct Declarations</DocsHeader3>
		<DocsText
			>Structs provide a way to group related variables and functions into a new user-defined type.</DocsText
		>
		<DocsCode>
			{#await getCode('StructDeclaration') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>Struct Initialization</DocsHeader3>
		<DocsText>
			The compiler generates a constructor for each struct. Fields can be omitted from the
			constructor.</DocsText
		>
		<DocsCode>
			{#await getCode('StructInitialization') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>Methods</DocsHeader3>
		<DocsText>You can add methods to a struct</DocsText>
		<DocsCode>
			{#await getCode('Methods') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>Self</DocsHeader3>
		<DocsText>
			You can access struct data by using the
			<DocsInlineCode>self</DocsInlineCode> keyword
		</DocsText>
		<DocsCode>
			{#await getCode('Self') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
</Section>
