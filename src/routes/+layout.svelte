<script lang="ts">
	import { navigating } from '$app/state';
	import '$src/app.scss';
	import { ping } from 'ldrs';
	import type { LayoutProps } from './$types';
	import { ProctoringGuard } from '$src/lib/proctoring';
	import { onMount } from 'svelte';
	ping.register();
	const proctoringGuard = new ProctoringGuard({
		blockConsole: true,
		disableCopyPaste: false,
		disableRightClick: false
	});

	let { children }: LayoutProps = $props();
	let isLoading = $derived(Boolean(navigating?.to && navigating?.type != 'goto'));

	onMount(() => {
		const cleanup = proctoringGuard.init();
		return () => {
			cleanup();
		};
	});
</script>

{#if isLoading}
	<div class="loading">
		<l-ping size="64" speed="2" color="var(--color-primary-400)"></l-ping>
	</div>
{/if}
{@render children()}

<style>
	.loading {
		position: fixed;
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		background-color: rgba(0, 0, 0, 0.8);
		z-index: 1000000;
	}

	.loading * {
		z-index: -1 !important;
		pointer-events: none;
	}
</style>
