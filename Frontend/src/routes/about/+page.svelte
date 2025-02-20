<script lang="ts">
	import Header from '../../components/header.svelte';
	import Section from '../../components/section.svelte';
	import AboutHeader1 from '../../components/about/AboutHeader1.svelte';
	import AboutHeader2 from '../../components/about/AboutHeader2.svelte';
	import AboutHeader3 from '../../components/about/AboutHeader3.svelte';
	import AboutText1 from '../../components/about/AboutText1.svelte';
	import AboutText2 from '../../components/about/AboutText2.svelte';
	import DocsText from '../../components/docs/DocsText.svelte';
	import StillHere from '../../components/still-here.svelte';
</script>

<Header></Header>

<Section color="yellow">
	<div class="text-center">
		<AboutHeader1 class="pb-4">About Bird</AboutHeader1>
	</div>
</Section>

<Section color="primary">
	<AboutHeader2>Project Description</AboutHeader2>
	<AboutText2
		>Bird is a web-first programming language that compiles to WebAssembly, allowing code to be
		executed in the browser at near-native speeds. Bird is designed to be used by web developers,
		providing an option for writing high-speed browser code that works seamlessly alongside
		JavaScript. The project's primary goals are to implement a highly performant and fully-featured
		language, including fundamental language features, a strong type system, and garbage collection.
		The project also includes a companion website featuring documentation, code samples, and a
		playground environment where users can write and run Bird code and view the compiled WebAssembly
		produced by the compiler.</AboutText2
	>
	<AboutText2
		>Web developers are the primary intended user group for this project. Bird appeals to this
		audience by providing near-native speeds through WebAssembly and easy interoperability with
		JavaScript. Developers can seamlessly add Bird to existing projects to improve critical
		operations. Bird also features syntax familiar to web developers and provides garbage collection
		to allow for rapid development without memory management concerns.</AboutText2
	>
	<AboutText2
		>The Bird Programming Language will provide basic features such as variables, loops, and
		functions. It will also have an expressive type system with type aliases, aggregate types such
		as arrays and structs, and generics. The language runtime will include a garbage collector.</AboutText2
	>
	<AboutText2
		>The Bird compiler is implemented primarily in C++, utilizing Binaryen to produce compiled WASM
		binary files that can be run in browser environments. The lexer and parser are written using
		Flex and Bison, a parsing toolchain that produces a C++ parser from a grammar file, allowing
		language syntax and grammar to be quickly iterated. Additionally, the garbage collection
		algorithms are written in JavaScript and called by the compiled WebAssembly binaries. The
		project is managed using CMake and built with a docker container to provide a consistent
		development experience for each team member.</AboutText2
	>
	<AboutText2
		>The Bird Programming Language is developed to be reliable. Each new feature implemented must
		have an associated test suite, and no code may be pushed to the main if it does not pass the
		tests. Bird is a statically typed language, meaning the compiler will not allow a developer to
		perform invalid operations, making programs safe by catching errors early. Memory safety is also
		a top priority. Many web developers have little experience outside of scripting languages, so
		they are unfamiliar with manual memory management. We solve this issue by including a garbage
		collector in the language, preventing memory leaks, and keeping programs memory-safe. We aim to
		make the language as secure as possible, but we are bottlenecked by the WebAssembly runtime of
		the browser. The WebAssembly is run in a sandboxed environment, separate from the host runtime,
		allowing for secure programs.</AboutText2
	>
</Section>

<Section color="none">
	<AboutHeader2>Resources</AboutHeader2>

	<AboutHeader3>Books</AboutHeader3>
	<AboutText2>Compilers: Principles, Techniques, and Tools.</AboutText2>
	<AboutText2
		>The “Dragon Book” has long been regarded as the definitive text on compilers. It provides
		information on all steps of the compilation process and the importance of design. The book's
		first edition was published in 1986 and has since remained a staple in the field of compiler
		design.</AboutText2
	>
	<AboutText2
		>(Aho, A. V., Lam, M. S., Sethi, R., & Ullman, J. D. (2007). Compilers: Principles, techniques,
		and Tools. Pearson Addison-Wesley. )</AboutText2
	>

	<AboutHeader3 class="pt-10">Websites</AboutHeader3>
	<AboutText2>
		<a href="https://openhome.cc/eGossip/WebAssembly/index.html">
			Language Implementation: WebAssembly
		</a>
	</AboutText2>
	<AboutText2
		>This website is a great tutorial for learning more about WebAssembly. It talks about how to
		code in WebAssembly and how to use JavaScript with it.</AboutText2
	>

	<AboutHeader3 class="pt-10">Articles</AboutHeader3>
	<AboutText2>An Empirical Study of Bugs in WebAssembly Compilers</AboutText2>
	<AboutText2
		>In this article, the authors analyze bug reports in compilers such as Emscripten,
		AssemblyScript, and Rustc/Wasm-Bindgen. They hope this research will lead to the development of
		more practical tools for testing and debugging WebAssembly compilers. The authors presented nine
		conclusions about the WebAssembly compiler bugs.</AboutText2
	>
	<AboutText2
		>Romano, Alan, et al. “An Empirical Study of Bugs in WebAssembly Compilers.” 2021 36th IEEE/ACM
		International Conference on Automated Software Engineering (ASE), 1 Nov. 2021,
		https://doi.org/10.1109/ase51524.2021.9678776</AboutText2
	>
</Section>

<Section color="yellow">
	<div class="text-center">
		<AboutHeader3>University of Nevada, Reno</AboutHeader3>
		<AboutText1>Department of Computer Science and Engineering</AboutText1>

		<AboutHeader3>CS 426: Spring 2025</AboutHeader3>
		<AboutText1>Senior Project in Computer Science</AboutText1>

		<AboutHeader3>Instructors</AboutHeader3>
		<AboutText1>Sara Davis, David Feil-Seifer</AboutText1>

		<AboutHeader3>Team 28</AboutHeader3>
		<AboutText1>Cole Carley, Nathan Wright, Nicholas Langley, Aidan Kirk</AboutText1>

		<AboutHeader3>External Advisors</AboutHeader3>
		<AboutText1>Joshua Dahl, master’s student and part-time instructor at UNR</AboutText1>
		<AboutText1>Dr. Fred Harris, Associate Dean of Faculty and Academic Affairs at UNR</AboutText1>
	</div>
</Section>

<StillHere color="primary"></StillHere>
