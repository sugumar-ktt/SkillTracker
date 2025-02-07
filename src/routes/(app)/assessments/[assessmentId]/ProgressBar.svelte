<script lang="ts">
	type Props = {
		label: string;
		progress?: number;
	};

	let { label, progress = 0 }: Props = $props();
</script>

<div class="progress-wrapper vstack justify-content-between">
	<div class="progress-header hstack justify-content-between">
		<span class="label text-body-secondary">{label}</span>
		<span class="value text-body-emphasis">{progress}%</span>
	</div>

	<div class="track" role="progressbar">
		<div class="fill" style:width="{progress}%" style:transform-origin="left"></div>
	</div>
</div>

<style>
	.progress-wrapper {
		min-width: 14rem;
	}

	.track {
		background-color: var(--color-neutral-200);
		height: 0.6rem;
		border-radius: 1rem;
		overflow: hidden;
	}

	.fill {
		background-color: var(--color-primary-500);
		height: 100%;
		border-radius: inherit;
		transition: background-color 0.2s ease;
	}
</style>
