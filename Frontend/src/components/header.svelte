<script>
	import { Navbar, NavLi, NavUl } from 'flowbite-svelte';
	import Squeeze from './squeeze.svelte';
	import Center from './center.svelte';
</script>

<header class="m-0 flex w-full items-center justify-between p-8">
	<div class="w-full">
		<Center>
			<Squeeze>
				<div class="flex w-full justify-between">
					<h1 class="text-primary-700 mb-2 text-6xl font-bold">Bird</h1>
					<Navbar class="w-fit bg-transparent">
						<NavUl>
							<NavLi href="/" class="text-xl">Home</NavLi>
							<NavLi href="/docs" class="text-xl">Docs</NavLi>
							<NavLi href="/playground" class="text-xl">Playground</NavLi>
							<NavLi href="https://github.com/colecarley/bird-lang" class="text-xl">Code</NavLi>
						</NavUl>
					</Navbar>
				</div>
			</Squeeze>
		</Center>
	</div>
</header>
