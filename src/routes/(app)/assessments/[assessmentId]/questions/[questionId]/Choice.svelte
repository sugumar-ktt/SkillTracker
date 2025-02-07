<script lang="ts">
	import { CircleCheckBig } from 'lucide-svelte';

	type Props = {
		isSelected: boolean;
		value: string;
		questionId: number;
		onSelection: () => void;
	};

	let { value, isSelected, onSelection }: Props = $props();

	function handleSelection() {
		onSelection();
	}
</script>

<button type="button" class="choice card" onmousedown={handleSelection}>
	<div class="choice-body card-body w-100">
		<div class="choice-wrapper hstack justify-content-between">
			<div class="hstack gap-3">
				<input
					class="form-check-input m-0"
					type="radio"
					{value}
					id="{value}-id"
					checked={isSelected}
				/>
				<label class="form-check-label" for="{value}-id">{value}</label>
			</div>
			{#if isSelected}
				<span style="color: var(--color-primary-600)">
					<CircleCheckBig size="20" />
				</span>
			{/if}
		</div>
	</div>
</button>

<style>
	.choice:has(input:checked) {
		border-color: var(--color-primary-500);
		background-color: var(--color-primary-10);
		outline: none;
	}

	.choice-body {
		padding: 0.75rem;
	}

	.choice:focus-visible {
		outline: none;
		box-shadow: 0 0 0 0.25rem var(--color-primary-300);
	}
</style>
