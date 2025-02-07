<script lang="ts">
	import { Modal } from 'bootstrap';
	import { AlertTriangle } from 'lucide-svelte';
	import { onMount, type Snippet } from 'svelte';

	type Props = {
		DailogBody: Snippet | undefined;
		isViolationLimitBreached: boolean;
	};

	let modalRef: HTMLDivElement | undefined = $state();
	let modalInstance: Modal | undefined = $state();

	let { DailogBody, isViolationLimitBreached = false }: Props = $props();

	export function hide() {
		modalInstance?.hide();
	}

	export function show() {
		modalInstance?.show();
	}

	onMount(() => {
		if (!modalRef) {
			return;
		}
		modalInstance = new Modal(modalRef, {
			backdrop: 'static',
			keyboard: false
		});
	});
</script>

<div
	class="modal fade violation-dialog"
	bind:this={modalRef}
	id="violationRequestModal"
	tabindex="-1"
	aria-labelledby="violationRequestModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-body p-4">
				<div class="vstack">
					<header class="vstack mb-3">
						<div class="hstack gap-2 mb-4">
							<AlertTriangle size="1.2em" color="var(--color-warning-500)" />
							<span class="fs-5 fw-medium permission-dialog__title">Violation Warning </span>
						</div>
						<span class="text-body">
							You have switched tabs or windows during the assessment.
						</span>
					</header>
					<div class="violation-dialog_body mb-4">
						{@render DailogBody?.()}
					</div>
					<footer class="violation-dialog_actions">
						{#if !isViolationLimitBreached}
							<button type="button" class="btn btn-white"> Close </button>
						{/if}
					</footer>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.modal-content {
		border-radius: 0.5rem;
		border: none;
	}

	.violation-dialog_actions {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 1rem;
	}
</style>
