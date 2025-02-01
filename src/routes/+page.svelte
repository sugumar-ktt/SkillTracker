<script lang="ts">
	import { CirclePlay, Clock, FileText, Target, User, Zap } from 'lucide-svelte';
	import type { Component } from 'svelte';
</script>

{#snippet AssementInfoItemIcon(icon: Component)}
	<div class="assesment-info-icon">
		<svelte:component this={icon}></svelte:component>
	</div>
{/snippet}

{#snippet AssesmentInfoItem(icon: any, label: string, value: string)}
	<div class="assesment-info-item hstack gap-3 p-3">
		<div class="hstack h-100">
			{@render AssementInfoItemIcon(icon)}
		</div>
		<div class="vstack">
			<span class="text-body-secondary">{label}</span>
			<span class="text-body-emphasis fw-medium">{value}</span>
		</div>
	</div>
{/snippet}

<section class="assesment min-vh-100 p-3">
	<div class="assesment__card card border-0 overflow-hidden" style="box-shadow: var(--shadow-md);">
		<div class="card-body p-0">
			<header class="assesment_header p-3 py-5">
				<h2 class="mb-3 fw-semibold">KT Telematics Solutions</h2>
				<p class="fs-5">Developer Assesment</p>
				<hr />
				<button type="button" class="btn btn-primary text-white hstack gap-2">
					<CirclePlay />
					<span>Start Test</span>
				</button>
			</header>
			<div class="assesment_content p-3 vstack gap-4">
				<div class="row gy-4">
					<div class="col-md-8">
						{@render AssesmentInfoItem(User, 'Candidate', 'Wade Wilson')}
					</div>
					<div class="col-md">
						{@render AssesmentInfoItem(Target, 'Position', 'Junior Developer')}
					</div>
				</div>
				<div class="row gy-4">
					<div class="col-md-4">
						{@render AssesmentInfoItem(Clock, 'Duration', '2 Hours')}
					</div>
					<div class="col-md-4">
						{@render AssesmentInfoItem(FileText, 'Questions', '25')}
					</div>
					<div class="col-md-8">
						{@render AssesmentInfoItem(Zap, 'Total Attempts', '01')}
					</div>
				</div>
				<p class="mt-2 text-muted text-center">Test Ends On: Feb 1, 2:00 PM</p>
			</div>
		</div>
	</div>
</section>

<style>
	.assesment {
		display: grid;
		width: 100%;
		place-items: center;
	}

	.assesment_header {
		background-color: rgba(25, 144, 138, 0.9);
		color: var(--color-white);
	}

	.assesment-info-item {
		background-color: var(--color-neutral-100);
		border-radius: 0.8rem;
	}

	.assesment-info-item:hover {
		background-color: var(--color-neutral-200);
	}

	.assesment-info-icon {
		aspect-ratio: 1/1;
		border-radius: 50%;
		width: 3rem;
		background-color: var(--color-primary-100);
		color: var(--color-primary-600);
		display: grid;
		place-items: center;
	}

	.assesment-info-icon :global(svg) {
		width: 1.6rem;
		height: 1.6rem;
	}

	@media (min-width: 1024px) {
		.assesment__card {
			min-width: var(--container-4xl);
		}
	}
</style>
