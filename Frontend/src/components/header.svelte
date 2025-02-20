<script>
	import { Navbar, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';
	import Squeeze from './squeeze.svelte';
	import Center from './center.svelte';
	import { page } from '$app/stores';
</script>

<header class="m-0 flex w-full items-center justify-between p-8">
	<div class="w-full">
		<Center>
			<Squeeze>
				<div class="flex w-full justify-between">
					<h1 class="text-primary-600 mb-2 text-6xl font-bold">Bird</h1>
					<Navbar class="w-fit bg-transparent">
						<NavHamburger
							class="flex w-full items-end justify-end bg-transparent hover:bg-transparent"
						/>
						<NavUl>
							<NavLi href="/" class="text-xl {$page.url.pathname == '/' && 'text-primary-600'}"
								>Home</NavLi
							>
							<NavLi
								href="/docs"
								class="text-xl {$page.url.pathname.startsWith('/docs') && 'text-primary-600'}"
								>Docs</NavLi
							>
							<NavLi
								href="/playground"
								class="text-xl {$page.url.pathname == '/playground' && 'text-primary-600'}"
								>Playground</NavLi
							>
							<NavLi
								href="/about"
								class="text-xl {$page.url.pathname == '/about' && 'text-primary-600'}">About</NavLi
							>
							<NavLi href="https://github.com/colecarley/bird-lang" class="text-xl ">Code</NavLi>
						</NavUl>
					</Navbar>
				</div>
			</Squeeze>
		</Center>
	</div>
</header>
