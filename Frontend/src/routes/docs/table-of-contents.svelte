<script lang="ts">
	import DocsBullet1 from '../../components/docs/DocsBullet1.svelte';
	import Section from '../../components/section.svelte';

	type DocSectionProps = {
		text: string;
		href?: string;
		children?: DocSectionProps[];
	};

	const sectionProps: DocSectionProps[] = [
		{
			text: 'Comments',
			href: '/docs/comments',
			children: [{ text: 'Single Line Comments' }, { text: 'Multi-Line Comments' }]
		},
		{
			text: 'Variables',
			href: '/docs/variables',
			children: [{ text: 'Variable Declaration' }, { text: 'Variable Assignment' }]
		},
		{
			text: 'Types',
			href: '/docs/types',
			children: [{ text: 'Primitive Types' }, { text: 'Type Declaration' }]
		},
		{
			text: 'Print Statement',
			href: '/docs/print'
		},
		{
			text: 'Expressions',
			href: '/docs/expressions',
			children: [
				{ text: 'Arithmetic Expressions' },
				{ text: 'Comparison Expressions' },
				{ text: 'Ternary Expressions' }
			]
		},
		{
			text: 'If Statements',
			href: '/docs/if-statements'
		},
		{
			text: 'Loops',
			href: '/docs/loops',
			children: [{ text: 'For Loops' }, { text: 'While Loops' }, { text: 'Continue and Break' }]
		},
		{
			text: 'Functions',
			href: '/docs/functions',
			children: [{ text: 'Function Declaration' }, { text: 'Function Calls' }]
		}
	];
</script>

<Section color="primary">
	<ul class="mt-8 block pl-10 text-2xl">
		{#each sectionProps as section}
			<DocsBullet1 text={section.text} href={section.href}>
				{#if section.children}
					{#each section.children as child}
						<DocsBullet1 text={child.text} href={child.href ?? section.href}></DocsBullet1>
					{/each}
				{/if}
			</DocsBullet1>
		{/each}
	</ul>
</Section>
