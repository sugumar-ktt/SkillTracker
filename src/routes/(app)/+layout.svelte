<script lang="ts">
	import { ProctoringGuard } from '$src/lib/proctoring';
	import { onMount } from 'svelte';
	import type { LayoutProps } from './$types';
	const proctoringGuard = new ProctoringGuard({
		blockConsole: true,
		disableCopyPaste: true,
		disableRightClick: true
	});

	let { children }: LayoutProps = $props();

	onMount(() => {
		const cleanUp = proctoringGuard.init();
		return cleanUp();
	});
</script>

{@render children()}
