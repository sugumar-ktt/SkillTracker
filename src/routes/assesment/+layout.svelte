<script lang="ts">
	import { Clock, CodeXml, Menu } from 'lucide-svelte';
	import { Spring } from 'svelte/motion';
	import type { LayoutProps } from '../$types';
	import ProgressBar from './ProgressBar.svelte';
	import QuestionNavigation from './QuestionNavigation.svelte';

	let { children }: LayoutProps = $props();

	const questions = Array.from({ length: 25 }, (v, i) => i + 1);

	let isRightSidebarOpen = $state(true);

	const sidebarWidth = new Spring(18, {
		stiffness: 0.125,
		damping: 0.6
	});

	function toggleSidebar() {
		isRightSidebarOpen = !isRightSidebarOpen;
		sidebarWidth.target = isRightSidebarOpen ? 18 : 0;
	}
</script>

<div class="layout">
	<nav class="nav card m-3">
		<div class="card-body">
			<div class="nav-container hstack justify-content-between position-relative">
				<div class="hstack gap-3">
					<span class="info-icon">
						<CodeXml />
					</span>
					<div class="vstack">
						<span class="text-body-secondary">Feb 01, 2025 9 AM</span>
						<span class="text-body-emphasis fw-medium">Junior Developer Assesment</span>
					</div>
				</div>

				<div class="hstack gap-3 position-absolute start-50 translate-middle-x">
					<span class="info-icon">
						<Clock />
					</span>
					<div class="vstack">
						<span class="text-body-secondary">Time Remaining</span>
						<span class="text-body-emphasis fw-medium">00:05:00</span>
					</div>
				</div>

				<div class="hstack gap-5">
					<ProgressBar label="Completion" />
					<button type="button" class="btn btn-primary text-white">
						<span>Finish Assesment</span>
					</button>
				</div>
			</div>
		</div>
	</nav>

	<main class="main card mx-3 mb-3">
		<div class="card-body">
			{@render children()}
		</div>
	</main>

	<aside class="sidebar me-1 mb-3" style="width: {sidebarWidth.current}rem">
		<QuestionNavigation {questions} />
	</aside>

	<nav class="right-menu">
		<button
			type="button"
			class="sidebar-toggle"
			class:active={isRightSidebarOpen}
			aria-label={isRightSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
			onmousedown={toggleSidebar}
		>
			<Menu size={20} />
		</button>
	</nav>
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: 1fr auto auto;
		grid-template-areas:
			'nav nav right-menu'
			'main sidebar right-menu';
		grid-template-rows: 0.1fr 1fr;
		min-height: 100vh;
		min-width: 100vw;
		row-gap: 1rem;
		overflow: hidden;
	}

	.nav {
		grid-area: nav;
		width: auto;
	}

	.main {
		grid-area: main;
	}

	.sidebar {
		grid-area: sidebar;
		overflow: hidden;
		background: var(--bg-sidebar, white);
	}

	.right-menu {
		grid-area: right-menu;
		background-color: var(--color-neutral-50);
	}

	.sidebar-toggle {
		grid-area: toggle;
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: transparent;
		color: var(--color-primary-700);
		cursor: pointer;
		margin: 1rem 0.8rem;
		transition: background-color 0.2s;
	}

	.sidebar-toggle :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.sidebar-toggle:hover,
	.sidebar-toggle.active {
		background-color: var(--color-primary-100);
	}

	.sidebar-toggle:focus-visible {
		outline: none;
		box-shadow: 0 0 0 0.25rem var(--color-primary-100);
	}

	.info-icon {
		aspect-ratio: 1/1;
		border-radius: 0.6rem;
		width: 2.5rem;
		background-color: var(--color-primary-100);
		color: var(--color-primary-600);
		display: grid;
		place-items: center;
	}

	.info-icon :global(svg) {
		width: 1.6rem;
		height: 1.6rem;
	}
</style>
