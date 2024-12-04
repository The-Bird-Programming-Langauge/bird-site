<script lang="ts">
	import Header from '../../components/header.svelte';
	import DocsBullet1 from '../../components/docs/DocsBullet1.svelte';
	import DocsBullet2 from '../../components/docs/DocsBullet2.svelte';
	import DocsHeader1 from '../../components/docs/DocsHeader1.svelte';
	import DocsHeader2 from '../../components/docs/DocsHeader2.svelte';
	import DocsText from '../../components/docs/DocsText.svelte';
	import DocsCode from '../../components/docs/DocsCode.svelte';
</script>

<Header></Header>

<main class="block max-w-[960px] mx-auto">
	<ul class="block list-disc mt-8 pl-10 text-white">
		<DocsBullet1 href="#comments" text="Comments"></DocsBullet1>
		<DocsBullet1 text="Variables">
			<DocsBullet2 text="Match operator"></DocsBullet2>
			<DocsBullet2 text="Variables type annotations"></DocsBullet2>
		</DocsBullet1>
		<DocsBullet1 text="Functions"></DocsBullet1>
	</ul>

    <DocsHeader1 id="comments">Comments</DocsHeader1>
	<DocsHeader2>Elixer</DocsHeader2>
	<DocsText>In Elixir comments are written with a # prefix.</DocsText>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
	<DocsCode># Hello, Joe!</DocsCode>
</main>