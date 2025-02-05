<script lang="ts">
	import type { AssessmentAttemptDetail } from '$src/types';

	type Props = {
		attemptDetails: AssessmentAttemptDetail[];
		currentAttemptDetail?: AssessmentAttemptDetail;
		isDisabled?: boolean;
	};

	let {
		attemptDetails,
		currentAttemptDetail = {
			QuestionId: 0,
			AssessmentAttemptId: 0,
			Question: {
				id: undefined,
				description: '',
				hint: null,
				choices: [],
				answer: undefined,
				score: 0,
				type: 'mcq',
				AssessmentId: undefined
			}
		},
		isDisabled = false
	}: Props = $props();
</script>

<section class="question-navigation vstack">
	<span class="fs-5 fw-medium text-nowrap mb-3">Question Group</span>
	<div class="question-grid mb-4">
		{#each attemptDetails as attemptItem, index (attemptItem.id)}
			{@const isCurrent = attemptItem.QuestionId == currentAttemptDetail.QuestionId}
			{@const isAnswered = attemptItem.isAttempted == true && !isCurrent}
			{@const isPending = !attemptItem.isAttempted && !isCurrent}
			<a
				href="./{attemptItem.QuestionId}"
				class="btn question-link"
				class:current={isCurrent}
				class:answered={isAnswered}
				class:pending={isPending}
				class:pe-none={isDisabled}
				data-sveltekit-noscroll
				data-sveltekit-keepfocus
			>
				{index + 1}
			</a>
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
			<span
				class="legend-indicator"
				style="background-color: var(--color-white); border: 1px solid var(--color-neutral-600)"
			></span>
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
		gap: 1rem;
		padding: 1rem;
		padding-left: 0.25rem;
	}

	.question-link {
		background-color: white;
		border: 1px solid var(--color-neutral-400);
		outline: none;
		aspect-ratio: 1/1;
		padding: 0;
		display: grid;
		place-items: center;
		width: 100%;
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

	.question-link.current {
		background-color: var(--color-primary-500);
		color: var(--color-white);
		border-color: var(--color-primary-500);
	}

	.question-link.answered {
		background-color: var(--color-success-600);
		color: var(--color-white);
		border-color: var(--color-success-600);
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
