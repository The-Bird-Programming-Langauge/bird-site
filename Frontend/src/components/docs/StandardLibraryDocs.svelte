<script>
	import { getCode } from '$lib/getCode';
	import { lex } from '$lib/lex';
	import Section from '../section.svelte';
	import DocsCode from './DocsCode.svelte';
	import DocsHeader1 from './DocsHeader1.svelte';
	import DocsHeader2 from './DocsHeader2.svelte';
	import DocsHeader3 from './DocsHeader3.svelte';
	import DocsInlineCode from './DocsInlineCode.svelte';
	import DocsSection from './DocsSection.svelte';
	import DocsText from './DocsText.svelte';
</script>

<Section>
	<DocsHeader1 id="standard-library">Standard Library</DocsHeader1>
  <DocsText>
    Bird's standard library is composed of namespaces that may include nested namespaces.
  </DocsText>

	<DocsSection>
		<DocsHeader2>Math::Trig</DocsHeader2>
		<DocsText>
			Contains a variety of trigonometry related modules.
		</DocsText>

    <DocsHeader3><DocsInlineCode>cos(b: float, c: float) -> float</DocsInlineCode></DocsHeader3>
    <DocsText>
			Returns the cosine of the angle opposite side a in a triangle. Requires side lengths b and c.
		</DocsText>

    <DocsHeader3><DocsInlineCode>sin(a: float, c: float) -> float</DocsInlineCode></DocsHeader3>
    <DocsText>
			Returns the sine of the angle opposite side b in a triangle. Requires side length a and the hypotenuse c.
		</DocsText>

    <DocsHeader3><DocsInlineCode>tan(a: float, b: float) -> float</DocsInlineCode></DocsHeader3>
    <DocsText>
			Returns the tangent of the angle formed by the opposite side a and adjacent side b in a right triangle.
		</DocsText>

    <DocsHeader3><DocsInlineCode>arccos(x: float) -> float</DocsInlineCode></DocsHeader3>
    <DocsText>
			Returns the arccosine (inverse cosine) of x in radians. x must be in the range [-1, 1].
		</DocsText>

    <DocsHeader3><DocsInlineCode>arcsin(x: float) -> float</DocsInlineCode></DocsHeader3>
    <DocsText>
			Returns the arcsine (inverse sine) of x in radians. x must be in the range [-1, 1].
		</DocsText>

    <DocsHeader3><DocsInlineCode>arctan(x: float) -> float</DocsInlineCode></DocsHeader3>
    <DocsText>
			Returns the arctangent (inverse tangent) of x in radians.
		</DocsText>

    <DocsHeader3><DocsInlineCode>to_degrees(theta: float) -> float</DocsInlineCode></DocsHeader3>
    <DocsText>
			Converts the angle theta from radians to degrees.
		</DocsText>

    <DocsHeader3><DocsInlineCode>{@html "struct Triangle{a: float, b: float, c: float}"}</DocsInlineCode></DocsHeader3>
    <DocsText>
			Defines a triangle with side lengths a, b, and c. Can be used for performing geometric and trigonometric calculations.
		</DocsText>
	</DocsSection>
</Section>