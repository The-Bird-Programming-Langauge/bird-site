<script lang="ts">
	import DocsBullet1 from '../../components/docs/DocsBullet1.svelte';
	import DocsText from '../../components/docs/DocsText.svelte';
	import CommentDocs from '../../components/docs/CommentDocs.svelte';
	import VariableDocs from '../../components/docs/VariableDocs.svelte';
	import TypeDocs from '../../components/docs/TypeDocs.svelte';
	import PrintStatementDocs from '../../components/docs/PrintStatementDocs.svelte';
	import ExpressionDocs from '../../components/docs/ExpressionDocs.svelte';
	import IfStatementDocs from '../../components/docs/IfStatementDocs.svelte';
	import LoopDocs from '../../components/docs/LoopDocs.svelte';
	import FunctionDocs from '../../components/docs/FunctionDocs.svelte';
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
			href: '#comments',
			children: [
				{ text: 'Single Line Comments', href: '#single-line-comments' },
				{ text: 'Multi-Line Comments', href: '#multi-line-comments' }
			]
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
		{
			text: 'Print Statement',
			href: '#print-statement'
		},
		{
			text: 'Expressions',
			href: '#expressions',
			children: [
				{ text: 'Arithmetic Expressions', href: '#arithmetic-expressions' },
				{ text: 'Comparison Expressions', href: '#comparison-expressions' },
				{ text: 'Ternary Expressions', href: '#ternary-expressions' }
			]
		},
		{
			text: 'If Statements',
			href: '#if-statements'
		},
		{
			text: 'Loops',
			href: '#loops',
			children: [
				{ text: 'For Loops', href: '#for-loops' },
				{ text: 'While Loops', href: '#while-loops' },
				{ text: 'Continue and Break', href: '#continue-and-break' }
			]
		},
		{
			text: 'Functions',
			href: '#functions',
			children: [
				{ text: 'Function Declaration', href: '#function-declarations' },
				{ text: 'Function Calls', href: '#function-calls' }
			]
		}
	];
</script>

<Header></Header>

<Section color="yellow">
	<ul class="mt-8 block pl-10 text-2xl">
		{#each sectionProps as section}
			<DocsBullet1 text={section.text} href={section.href}>
				{#if section.children}
					{#each section.children as child}
						<DocsBullet1 text={child.text} href={child.href}></DocsBullet1>
					{/each}
				{/if}
			</DocsBullet1>
		{/each}
	</ul>
</Section>

<CommentDocs></CommentDocs>
<VariableDocs></VariableDocs>
<TypeDocs></TypeDocs>
<PrintStatementDocs></PrintStatementDocs>
<ExpressionDocs></ExpressionDocs>
<LoopDocs></LoopDocs>
<IfStatementDocs></IfStatementDocs>
<FunctionDocs></FunctionDocs>

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
