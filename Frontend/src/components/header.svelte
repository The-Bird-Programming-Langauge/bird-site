<script>
	import { Navbar, NavLi, NavUl } from 'flowbite-svelte';
	import Squeeze from './squeeze.svelte';
	import Center from './center.svelte';
	import { page } from '$app/stores';

	$effect(() => console.log($page.url));
</script>

<header class="m-0 flex w-full items-center justify-between p-8">
	<div class="w-full">
		<Center>
			<Squeeze>
				<div class="flex w-full justify-between">
					<h1 class="text-primary-500 mb-2 text-6xl font-bold">Bird</h1>
					<Navbar class="w-fit bg-transparent">
						<NavUl>
							<NavLi href="/" class="text-xl {$page.url.pathname == '/' && 'text-primary-500'}"
								>Home</NavLi
							>
							<NavLi
								href="/docs"
								class="text-xl
							{$page.url.pathname == '/docs' && 'text-primary-500'}">Docs</NavLi
							>
							<NavLi
								href="/playground"
								class="text-xl {$page.url.pathname == '/playground' && 'text-primary-500'}"
								>Playground</NavLi
							>
							<NavLi href="https://github.com/colecarley/bird-lang" class="text-xl ">Code</NavLi>
						</NavUl>
					</Navbar>
				</div>
			</Squeeze>
		</Center>
	</div>
</header>
