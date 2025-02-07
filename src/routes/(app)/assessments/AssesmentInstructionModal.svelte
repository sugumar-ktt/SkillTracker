<script lang="ts">
	import { Modal } from 'bootstrap';
	import { AlertTriangle, Maximize } from 'lucide-svelte';
	import { onMount } from 'svelte';

	type Props = {
		onAction: (isPermissionProvided: boolean) => void;
	};

	let { onAction = () => {} }: Props = $props();
	let modalRef: HTMLDivElement | undefined = $state();
	let modalInstance: Modal | undefined = $state();

	export function show() {
		modalInstance?.show();
	}

	export function hide() {
		modalInstance?.hide();
	}

	function handleAccept() {
		onAction(true);
	}

	function handleDecline() {
		onAction(false);
	}

	onMount(() => {
		if (!modalRef) {
			return;
		}
		modalInstance = new Modal(modalRef, {
			backdrop: 'static'
		});
	});
</script>

{#snippet PermissionItem(Icon: any, name: string, description: string)}
	<div class="permission-item">
		<header class="permission-item__header permission-item__row align-items-center">
			<Icon size="1.1em" />
			<span class="fw-medium">{name}</span>
		</header>
		<div class="permission-item__row">
			<span></span>
			<span>{description}</span>
		</div>
	</div>
{/snippet}

<div
	class="modal fade instruction-dialog"
	bind:this={modalRef}
	id="instructionRequestModal"
	tabindex="-1"
	aria-labelledby="instructionRequestModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-body p-4">
				<div class="vstack">
					<header class="vstack mb-3">
						<span class="fs-5 fw-medium permission-dialog__title">Assessment Instructions</span>
						<span class="text-body-secondary">
							Please read the following instructions carefully before proceeding with the
							assessment.
						</span>
					</header>
					<div class="instruction-dialog_body mb-4">
						<div class="card instruction-dialog__card">
							<div class="card-body">
								<header class="instruction-item__row mb-2 align-items-center">
									<AlertTriangle size="1.1em" />
									<span class="fw-medium">Important: Assessment Integrity</span>
								</header>
								<div class="instruction-dialog__card-content">
									<div class="instruction-item__row">
										<span></span>
										<ul class="instruction-dialog_list vstack gap-2">
											<li>
												Tab switching is not allowed during the assessment. Any attempt to switch
												tabs will be recorded as a violation.
											</li>
											<li>
												Exiting the assessment window is prohibited. Attempts to do so will be
												logged as violations.
											</li>
											<li>
												Multiple violations may result in automatic disqualification from the
												assessment.
											</li>
											<li>
												Ensure you have a stable internet connection and a distraction-free
												environment before starting.
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
					<footer class="instruction-dialog_actions">
						<button type="button" class="btn btn-white" onmousedown={handleDecline}>Decline</button>
						<button type="button" class="btn btn-primary" onmousedown={handleAccept}>
							I Understand & Accept
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

	.instruction-dialog__card {
		border-color: var(--color-danger-500);
		color: var(--color-danger-500);
	}

	.instruction-item__row {
		display: grid;
		grid-template-columns: 0.07fr 1fr;
	}

	.instruction-dialog_actions {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 1rem;
	}
</style>
