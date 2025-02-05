<script lang="ts">
	import { PrismLanguage } from '$src/lib/prism';
	import Prism from 'prismjs';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-typescript';
	import 'prismjs/components/prism-java';
	import 'prismjs/components/prism-sql';
	import 'prismjs/themes/prism-tomorrow.css';

	type Props = {
		code: string;
		language: PrismLanguage;
	};

	let { code = '', language = PrismLanguage.JavaScript }: Props = $props();

	let highlightedCode = $derived(Prism.highlight(code.trim(), Prism.languages[language], language));
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
