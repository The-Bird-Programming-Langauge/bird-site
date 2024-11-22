<script lang="ts">
	import Header from '../../components/header.svelte';
	import DocsBullet1 from '../../components/DocsBullet1.svelte';
	import DocsHeader1 from '../../components/DocsHeader1.svelte';
	import DocsHeader2 from '../../components/DocsHeader2.svelte';
	import DocsText from '../../components/DocsText.svelte';
	import DocsCode from '../../components/DocsCode.svelte';
</script>

<Header></Header>

<main class="block max-w-[960px] mx-auto">
	<ul class="block list-disc mt-8 pl-10 text-white">
		<DocsBullet1 href="#comments" text="Comments">
			<DocsBullet1 href="#comments" text="Comments">
			
			</DocsBullet1>
		</DocsBullet1>
	</ul>

    <DocsHeader1>Comments</DocsHeader1>
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
	<DocsCode id="comments"># Hello, Joe!</DocsCode>
</main>