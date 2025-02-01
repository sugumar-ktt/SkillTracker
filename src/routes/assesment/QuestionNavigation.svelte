<script lang="ts">
	type Props = {
		questions: Array<number>;
	};

	let { questions }: Props = $props();
</script>

<section class="question-navigation vstack">
	<span class="fs-5 fw-medium text-nowrap mb-3">Question Group</span>
	<div class="question-grid mb-4">
		{#each questions as questionIndex (questionIndex)}
			<a href="./{questionIndex + 1}" class="btn question-link">{questionIndex}</a>
		{/each}
	</div>
	<div class="legend">
		<div class="legend-item">
			<span class="legend-indicator bg-success"></span>
			<span class="legend-label">Answered</span>
		</div>
		<div class="legend-item">
			<span class="legend-indicator bg-primary"></span>
			<span class="legend-label">Current</span>
		</div>
		<div class="legend-item">
			<span class="legend-indicator" style="background-color: var(--color-neutral-600);"></span>
			<span class="legend-label">Pending</span>
		</div>
	</div>
</section>

<style>
	.question-navigation {
		width: 100%;
		overflow: hidden;
	}
	.question-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		place-items: center start;
		gap: 0.5rem;
	}

	.question-link {
		background-color: white;
		border: 1px solid var(--color-neutral-400);
		outline: none;
		aspect-ratio: 1/1;
		padding: 0;
		display: grid;
		place-items: center;
		width: 2.4rem;
		font-size: 0.9rem;
	}

	.question-link:hover,
	.question-link:active {
		background-color: var(--color-neutral-100);
		border: 1px solid var(--color-neutral-500);
	}

	.question-link:focus-visible {
		box-shadow: 0 0 0 0.2rem rgba(31, 181, 173, 0.5);
	}

	.legend {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.legend-item {
		display: grid;
		grid-template-columns: min-content 1fr;
		place-items: center start;
		gap: 0.5rem;
	}

	.legend-indicator {
		aspect-ratio: 1/1;
		width: 0.8rem;
		border-radius: 50%;
	}

	.legend-label {
		font-size: 0.9rem;
	}
</style>
