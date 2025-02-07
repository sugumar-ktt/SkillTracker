<script lang="ts">
	import { PrismLanguage } from '$src/lib/prism';
	import Prism from 'prismjs';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-typescript';
	import 'prismjs/components/prism-java';
	import 'prismjs/components/prism-sql';
	import 'prismjs/components/prism-c';
	import 'prismjs/components/prism-cpp';
	import 'prismjs/components/prism-python';
	import 'prismjs/themes/prism-tomorrow.css';

	type Props = {
		code: string;
		language: PrismLanguage;
	};

	let { code = '', language = PrismLanguage.JavaScript }: Props = $props();

	// Dedent function: removes the smallest indentation common to all non-empty lines
	function dedent(str: string): string {
		// Remove any leading newline first (common when using template literals)
		str = str.replace(/^\n/, '');
		const lines = str.split('\n');
		// Get lengths of leading whitespace for all non-empty lines
		const indents = lines
			.filter((line) => line.trim().length > 0)
			.map((line) => {
				const match = line.match(/^(\s+)/);
				return match ? match[1].length : 0;
			});
		// If there are no indented lines, nothing to do.
		if (indents.length === 0) return str;
		const minIndent = Math.min(...indents);
		return lines.map((line) => line.slice(minIndent)).join('\n');
	}

	let highlightedCode = $derived.by(() => {
		const grammar = Prism.languages[language];
		if (!grammar) {
			console.warn(
				`Prism does not support language "${language}". Falling back to plain HTML rendering.`
			);
			return code;
		}
		try {
			// Dedent and trim the code before highlighting
			const cleanedCode = dedent(code).trim();
			return Prism.highlight(cleanedCode, grammar, language);
		} catch (error) {
			console.error('Prism.highlight error:', error);
			return code;
		}
	});
</script>

<pre class="language-{language}"><code class="language-{language} assessment-mode"
		>{@html highlightedCode}</code
	></pre>

<style>
	pre {
		overflow: auto;
		padding: 1rem;
		border-radius: 0.25rem;
	}
</style>
