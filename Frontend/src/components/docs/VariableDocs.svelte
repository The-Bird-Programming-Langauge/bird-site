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
	<DocsHeader1 id="variables">Variables</DocsHeader1>
	<DocsSection>
		<DocsHeader2 id="variable-declaration">Variable Declaration</DocsHeader2>
		<DocsText
			>Bird has mutable and imutable variables. Types can be explicitly declared or inferred
			automatically. Values must be assigned during declaration.</DocsText
		>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>Normal Variables</DocsHeader3>
		<DocsText>Use the var keyword to create a normal mutable variable.</DocsText>
		<DocsCode>
			{#await getCode('normalVariables') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>Immutable Variables</DocsHeader3>
		<DocsText
			>Use the const keyword to create an imutable variable that cannot be modified later.</DocsText
		>
		<DocsCode>
			{#await getCode('immutableVariables') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader2 id="variable-assignment">Variable Assignment</DocsHeader2>
		<DocsText>Bird permits reassignment of mutable variables.</DocsText>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>Basic Assignment</DocsHeader3>
		<DocsText>An already declared variable can be overwritten using the = operator.</DocsText>
		<DocsCode>
			{#await getCode('basicAssignment') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>Assignment Operators</DocsHeader3>
		<DocsText
			>Bird supports additional assigment operators:
			<DocsInlineCode>+=</DocsInlineCode>,
			<DocsInlineCode>-=</DocsInlineCode>,
			<DocsInlineCode>*=</DocsInlineCode>,
			<DocsInlineCode>/=</DocsInlineCode>,
			<DocsInlineCode>%=</DocsInlineCode>.
		</DocsText>
		<DocsCode>
			{#await getCode('assignmentOperators') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>Assignment Within Expressions</DocsHeader3>
		<DocsText>Assignments can be integrated into expressions to modify a variable and return its updatedvalue.</DocsText>
		<DocsCode>
			{#await getCode('assignmentWithinExpressions') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
</Section>