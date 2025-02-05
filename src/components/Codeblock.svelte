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

	let highlightedCode = $derived.by(() => {
		const grammar = Prism.languages[language];
		if (!grammar) {
			console.warn(
				`Prism does not support language "${language}". Falling back to plain HTML rendering.`
			);
			return code;
		}
		try {
			return Prism.highlight(code.trim(), grammar, language);
		} catch (error) {
			console.error('Prism.highlight error:', error);
			return code;
		}
	});
</script>

<pre class="language-{language}">
	<code class="language-{language}">{@html highlightedCode}</code>
</pre>

<style>
	pre {
		overflow: auto;
		padding: 1rem;
		border-radius: 0.25rem;
	}
</style>
