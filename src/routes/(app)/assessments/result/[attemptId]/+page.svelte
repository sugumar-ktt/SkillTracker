<script lang="ts">
	import { CircleCheckBig, Clock } from 'lucide-svelte';
</script>

<div class="result min-vh-100 vstack align-items-center justify-content-center p-3 text-center">
	<div class="result__container">
		<div class="card">
			<div class="card-body p-4">
				<div class="vstack align-items-center">
					<div class="icon-wrapper mb-4">
						<CircleCheckBig size="40" />
					</div>
					<div class="fs-3 fw-semibold">Assessment Submitted</div>
					<p class="text-body-secondary">
						Thank you for completing the assessment. Your submission has been received.
					</p>
					<div class="vstack gap-3">
						<div class="result__info-item">
							<span class="text-body-emphasis fw-medium">Attempted Questions</span>
							<span>25</span>
						</div>
						<div class="result__info-item">
							<span class="text-body-emphasis fw-medium">Time Taken</span>
							<div class="hstack gap-2">
								<Clock size="1em" />
								00:05
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.result {
		height: 100vh;
		overflow: hidden;
		background: rgb(229, 251, 249);
		background: linear-gradient(180deg, rgba(229, 251, 249, 0.25) 50%, rgba(255, 255, 255, 1) 100%);
	}

	.result__container {
		max-width: var(--container-xl);
		width: 100%;
	}

	.icon-wrapper {
		aspect-ratio: 1/1;
		border-radius: 50%;
		padding: 1rem;
		width: fit-content;
		background-color: var(--color-success-100);
		color: var(--color-success-600);
	}

	.result__info-item {
		background-color: var(--color-neutral-100);
		border-radius: 0.8rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
	}

	.result__info-item:hover {
		background-color: var(--color-neutral-200);
	}
</style>
