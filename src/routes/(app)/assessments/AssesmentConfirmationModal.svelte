<script lang="ts">
	import { Modal } from 'bootstrap';
	import { AlertTriangle } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let modalRef: HTMLDivElement | undefined = $state();
	let modalInstance: Modal | undefined = $state();
	let resolvePromise: ((value: boolean) => void) | undefined;

	export function show() {
		modalInstance?.show();
	}

	export function hide() {
		modalInstance?.hide();
	}

	export function confirm(): Promise<boolean> {
		show();
		return new Promise((resolve) => {
			resolvePromise = resolve;
		});
	}

	function handleModalHide() {
		// If modal is closed by clicking outside or pressing ESC
		if (resolvePromise) {
			resolvePromise(false);
			resolvePromise = undefined;
		}
	}

	function handleConfirm() {
		if (resolvePromise) {
			resolvePromise(true);
			resolvePromise = undefined;
		}
		hide();
	}

	function handleCancel() {
		if (resolvePromise) {
			resolvePromise(false);
			resolvePromise = undefined;
		}
		hide();
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
	class="modal fade confirmation-dialog"
	bind:this={modalRef}
	id="confirmationRequestModal"
	tabindex="-1"
	aria-labelledby="confirmationRequestModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-body p-4">
				<div class="vstack">
					<header class="vstack mb-3">
						<div class="hstack gap-2 mb-4">
							<AlertTriangle size="1.2em" color="var(--color-warning-500)" />
							<span class="fs-5 fw-medium permission-dialog__title"
								>Confirm Assessment Submission
							</span>
						</div>
						<span class="text-body">
							Are you sure you want to finish and submit your assessment?
						</span>
					</header>
					<div class="confirmation-dialog_body mb-4">
						<span>
							You won't be able to make any changes after submission. Please ensure you've reviewed
							all your answers before submitting.
						</span>
					</div>
					<footer class="confirmation-dialog_actions">
						<button type="button" class="btn btn-white" onmousedown={handleCancel}>Go Back</button>
						<button type="button" class="btn btn-primary" onmousedown={handleConfirm}>
							I Understand, Submit
						</button>
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

	.confirmation-dialog_actions {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 1rem;
	}
</style>
