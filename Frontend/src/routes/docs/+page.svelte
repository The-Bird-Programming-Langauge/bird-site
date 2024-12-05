<script lang="ts">
	import Header from '../../components/header.svelte';
	import DocsBullet1 from '../../components/docs/DocsBullet1.svelte';
	import DocsBullet2 from '../../components/docs/DocsBullet2.svelte';
	import DocsHeader1 from '../../components/docs/DocsHeader1.svelte';
	import DocsHeader2 from '../../components/docs/DocsHeader2.svelte';
	import DocsHeader3 from '../../components/docs/DocsHeader3.svelte';
	import DocsText from '../../components/docs/DocsText.svelte';
	import DocsCode from '../../components/docs/DocsCode.svelte';
	import DocsComment from '../../components/docs/DocsComment.svelte';
</script>

<Header></Header>

<main class="block max-w-[960px] mx-auto">
	<ul class="block list-disc mt-8 pl-10 text-black">
		<DocsBullet1 href="#comments" text="Comments"></DocsBullet1>
		<DocsBullet1 href="#variables" text="Variables">
			<DocsBullet2 href="#variable-declaration" text="Variable Declaration"></DocsBullet2>
			<DocsBullet2 href="#variable-assignment" text="Variable Assignment"></DocsBullet2>
		</DocsBullet1>
		<DocsBullet1 href="#types" text="Types"></DocsBullet1>
	</ul>

    <DocsHeader1 id="comments">Comments</DocsHeader1>
	<DocsHeader3>Single Line Comments</DocsHeader3>
	<DocsText>Comment out single lines using the // prefix.</DocsText>
	<DocsCode>
	<DocsComment>// Comment.</DocsComment>
	var x = 1; <DocsComment>// Comment.</DocsComment>
	</DocsCode>
	<DocsHeader3>Multi-Line Comments</DocsHeader3>
	<DocsText>Comment out multiple lines using the /* prefix in combination with the */ suffix.</DocsText>
	<DocsCode>
	/* Multi
	Line
	Comment */

	var x = 1; /* Comment. */
	</DocsCode>

    <DocsHeader1 id="variables">Variables</DocsHeader1>
	<DocsHeader2 id="variable-declaration">Variable Declaration</DocsHeader2>
	<DocsText>Bird has mutable and imutable variables. Types can be explicitly declared or inferred automatically. Values must be assigned during declaration.</DocsText>
	<DocsHeader3>Normal Variables</DocsHeader3>
	<DocsText>Use the var keyword to create a normal mutable variable.</DocsText>
	<DocsCode>
	// Declare the variable x of type bool and assign it the value true.
	var x: bool = true;
	</DocsCode>
	<DocsHeader3>Imutable Variables</DocsHeader3>
	<DocsText>Use the const keyword to create an imutable variable that cannot be modified later.</DocsText>
	<DocsCode>
	// Declare a constant variable x with an automatically inferred type of int and assign it the value 2.
	const x = 2;
	</DocsCode>

	<DocsHeader2 id="variable-assignment">Variable Assignment</DocsHeader2>
	<DocsText>Bird permits reassignment of mutable variables.</DocsText>
	<DocsHeader3>Basic Assignment</DocsHeader3>
	<DocsText>An already declared variable can be overwritten using the = operator.</DocsText>
	<DocsCode>
	// Declare the variable x with value 5 and reassign x with the value 10.
	var x: int = 5;
	x = 10;
	</DocsCode>
	<DocsHeader3>Assignment Operators</DocsHeader3>
	<DocsText>Bird supports additional assigment operators: +=, -=, *=, /=, %=</DocsText>
	<DocsCode>
	var x = 2;
	var y = 3;

	x += 4; // x = 6

	// Divide x by y. This is equivalent to x = x / y.
	x /= y; // x = 2
	</DocsCode>
	<DocsHeader3>Assignment Within Expressions</DocsHeader3>
	<DocsText>Assignments can be integrated into expressions to modify a variable and return its updated value. </DocsText>
	<DocsCode>
	var x = 2;
	x = 1 + x += 1;
	// Evaluate (x += 1), x becomes 3 and 3 is returned.
	// Becomes: x = 1 + 3
	// x is now equal to 4
	</DocsCode>

    <DocsHeader1 id="types">Types</DocsHeader1>
	<DocsHeader3>Primitive Types</DocsHeader3>
	<DocsText>Bird supports the following primitive types: int, bool, float</DocsText>
	<DocsCode>
	var x: bool = false;
	const x: float = 3.14;
	</DocsCode>
	<DocsHeader3>Type Declaration</DocsHeader3>
	<DocsText>You can create a type identifier to represent a primitive type.</DocsText>
	<DocsCode>
	// Create type x of type int.
	type x = int;

	// Create variable x of type int with value 34.
	var num: x = 34;
	</DocsCode>
</main>