<script lang="ts">
	import { DevToolsBlocker } from '$src/lib/proctoring';
	import { onMount } from 'svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(() => {
		// const devToolsBlocker = new DevToolsBlocker({ blockConsole: true });
		// const cleanUp = devToolsBlocker.init();
		// return cleanUp;
	});
</script>

{@render children()}
