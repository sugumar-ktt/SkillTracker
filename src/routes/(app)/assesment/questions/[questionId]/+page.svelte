<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import Choice from './Choice.svelte';

	const choices = ['Framework', 'Library', 'MVC', 'Markup'];
	let selectedChoice = $state<string>();

	function handleSelection(choice: string) {
		selectedChoice = choice;
	}

	function handleClear() {
		selectedChoice = undefined;
	}
</script>

<section class="question vstack justify-content-between h-100">
	<div class="vstack gap-3">
		<header class="header hstack justify-content-between">
			<div class="fs-4 fw-medium">Question 3/25</div>
			<span class="text-primary">Choose the Answer</span>
		</header>
		<p>What is React?</p>
		<div class="vstack gap-3">
			{#each choices as choice}
				<Choice
					isSelected={choice == selectedChoice}
					questionId={1}
					value={choice}
					onSelection={handleSelection}
				/>
			{/each}
		</div>
	</div>
	<div class="hstack justify-content-between mb-3">
		<button type="button" class="btn btn-secondary hstack gap-2">
			<ChevronLeft />
			<span>Previous</span>
		</button>
		<div class="hstack gap-3">
			<button type="button" class="btn btn-secondary" onmousedown={handleClear}>
				<span>Clear</span>
			</button>
			<button type="button" class="btn btn-primary text-white hstack gap-2">
				<span>Next</span>
				<ChevronRight />
			</button>
		</div>
	</div>
</section>
