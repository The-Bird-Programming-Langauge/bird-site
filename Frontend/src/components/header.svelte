<script>
	import { Navbar, NavLi, NavUl } from 'flowbite-svelte';
</script>

<header class="bg-primary-100 m-0 flex w-full items-center justify-between p-4">
	<h1 class="mb-2 text-6xl font-bold">Bird</h1>
	<Navbar class="bg-primary-100 w-fit">
		<NavUl>
			<NavLi href="/">Home</NavLi>
			<NavLi href="/docs">Docs</NavLi>
			<NavLi href="https://github.com/colecarley/bird-lang">Code</NavLi>
		</NavUl>
	</Navbar>
</header>
