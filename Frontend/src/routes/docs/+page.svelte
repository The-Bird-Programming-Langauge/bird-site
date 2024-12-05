<script lang="ts">
	import { getCode } from '$lib/getCode';
	import { lex } from '$lib/lex';
	import DocsBullet1 from '../../components/docs/DocsBullet1.svelte';
	import DocsCode from '../../components/docs/DocsCode.svelte';
	import DocsHeader1 from '../../components/docs/DocsHeader1.svelte';
	import DocsHeader2 from '../../components/docs/DocsHeader2.svelte';
	import DocsHeader3 from '../../components/docs/DocsHeader3.svelte';
	import DocsInlineCode from '../../components/docs/DocsInlineCode.svelte';
	import DocsSection from '../../components/docs/DocsSection.svelte';
	import DocsText from '../../components/docs/DocsText.svelte';
	import Header from '../../components/header.svelte';
	import Section from '../../components/section.svelte';

	type DocSectionProps = {
		text: string;
		href?: string;
		children?: DocSectionProps[];
	};

	const sectionProps: DocSectionProps[] = [
		{
			text: 'Comments',
			href: '#comments'
		},
		{
			text: 'Variables',
			href: '#variables',
			children: [
				{ text: 'Variable Declaration', href: '#variable-declaration' },
				{ text: 'Variable Assignment', href: '#variable-assignment' }
			]
		},
		{
			text: 'Types',
			href: '#types',
			children: [
				{ text: 'Primitive Types', href: '#primitive-types' },
				{ text: 'Type Declaration', href: '#type-declaration' }
			]
		},
		{ text: 'Functions' }
	];
</script>

<Header></Header>

<Section color="yellow">
	<ul class="mt-8 block pl-10 text-2xl">
		{#each sectionProps as section}
			<DocsBullet1 text={section.text} href={section.href}>
				{#if section.children}
					{#each section.children as child}
						<DocsBullet1 text={child.text} href={section.href}></DocsBullet1>
					{/each}
				{/if}
			</DocsBullet1>
		{/each}
	</ul>
</Section>
<Section>
	<DocsHeader1 id="comments">Comments</DocsHeader1>
	<DocsSection>
		<DocsHeader3>Single Line Comments</DocsHeader3>
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
		<DocsHeader3>Multi-Line Comments</DocsHeader3>
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
		<DocsText
			>Assignments can be integrated into expressions to modify a variable and return its updated
			value.
		</DocsText>
		<DocsCode>
			{#await getCode('assignmentWithinExpressions') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
</Section>
<Section>
	<DocsHeader1 id="types">Types</DocsHeader1>
	<DocsSection>
		<DocsHeader3>Primitive Types</DocsHeader3>
		<DocsText
			>Bird supports the following primitive types:
			<DocsInlineCode>int</DocsInlineCode>,
			<DocsInlineCode>bool</DocsInlineCode>,
			<DocsInlineCode>float</DocsInlineCode>.
		</DocsText>
		<DocsCode>
			{#await getCode('primitiveTypes') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
	<DocsSection>
		<DocsHeader3>Type Declaration</DocsHeader3>
		<DocsText>You can create a type identifier to represent a primitive type.</DocsText>
		<DocsCode>
			{#await getCode('typeDeclaration') then code}
				{@html lex(code)}
			{/await}
		</DocsCode>
	</DocsSection>
</Section>

<Section color="none">
	<div class="flex justify-center">
		<div>
			<h2>Still here?</h2>
			<DocsText
				>Check out the
				<a href="/playground" class="text-primary-500"> playground! </a>
			</DocsText>
		</div>
	</div>
</Section>
