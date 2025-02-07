<script lang="ts">
	import { Modal } from 'bootstrap';
	import { Maximize } from 'lucide-svelte';
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
			backdrop: 'static',
			keyboard: false
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
	class="modal fade permission-dialog"
	bind:this={modalRef}
	id="permissionRequestModal"
	tabindex="-1"
	aria-labelledby="permissionRequestModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-body p-4">
				<div class="vstack">
					<header class="vstack mb-3">
						<span class="fs-5 fw-medium permission-dialog__title">Assessment Permissions</span>
						<span class="text-body-secondary">
							This assessment requires the following permissions for optimal experience and fair
							evaluation.
						</span>
					</header>
					<div class="permission-dialog_body mb-4">
						{@render PermissionItem(
							Maximize,
							'Fullscreen Mode',
							`The assessment must be taken in full screen`
						)}
					</div>
					<footer class="permission-dialog_actions">
						<button type="button" class="btn btn-white" onmousedown={handleDecline}>Decline</button>
						<button type="button" class="btn btn-primary" onmousedown={handleAccept}>
							Accept
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

	.permission-item {
		padding: 1rem;
		border: 2px solid var(--color-neutral-300);
		border-radius: 0.5rem;
	}

	.permission-item__header {
		color: var(--color-primary-600);
	}

	.permission-item__row {
		display: grid;
		grid-template-columns: 0.07fr 1fr;
	}

	.permission-dialog_actions {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 1rem;
	}
</style>
