<script lang="ts">
	import { goto } from '$app/navigation';
	import kttHorizontalLogo from '$assets/images/ktt-horizontal-logo.png';
	import slide1Bg from '$assets/images/showcase/s-1-bg.png';
	import slide1Content from '$assets/images/showcase/s-1-content.png';
	import slide2Bg from '$assets/images/showcase/s-2-bg.png';
	import slide2Content from '$assets/images/showcase/s-2-content.png';
	import slide4Bg from '$assets/images/showcase/s-4-bg.png';
	import slide4Content from '$assets/images/showcase/s-4-content.png';
	import slide5Content from '$assets/images/showcase/s-5-content.png';
	import slide6Content from '$assets/images/showcase/s-6-content.png';
	import slide7Content from '$assets/images/showcase/s-7-content.png';
	import Select2 from '$src/components/Select2.svelte';
	import constants from '$src/lib/constants';
	import { ValidationError } from '$src/lib/utils/error';
	import { sessionStore } from '$src/stores';
	import type { APIResponse, Candidate, Department } from '$src/types';
	import { Carousel } from 'bootstrap';
	import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import type { EventHandler } from 'svelte/elements';
	import type { PageProps } from './$types';

	type FormFields = {
		firstName: string;
		lastName: string;
		email: string;
		rollNumber: string;
		departmentId: string;
	};

	const slides = [
		{
			background: slide4Bg,
			content: slide4Content,
			isActive: true
		},
		{
			background: slide1Bg,
			content: slide1Content
		},
		{
			background: slide2Bg,
			content: slide2Content
		},
		{
			background: slide4Bg,
			content: slide5Content
		},
		{
			background: slide4Bg,
			content: slide6Content
		},
		{
			background: slide4Bg,
			content: slide7Content
		}
	];

	let { data }: PageProps = $props();
	let departments: Department[] = $derived(data.departments.result?.data || []);
	let formState: Record<keyof FormFields, string> = $state({
		firstName: '',
		lastName: '',
		rollNumber: '',
		departmentId: '',
		email: ''
	});
	let isFormValid: boolean | undefined = $state();
	let isFormLoading = $state(false);
	let carouselRef = $state<HTMLDivElement>();

	const onFormInteraction: EventHandler<
		Event & { currentTarget: EventTarget & HTMLFormElement }
	> = (event) => {
		const element = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
		const validityState = element.validity;
		const fieldName = element.name as keyof FormFields;

		if (!validityState) {
			return;
		}

		if (validityState.valid) {
			formState[fieldName] = '';
			return;
		}

		if (event.type == 'input') {
			return;
		}

		if (validityState.valueMissing) {
			formState[fieldName] = 'Field is required';
		}

		if (element.type == 'email' && validityState.typeMismatch) {
			formState[fieldName] = 'Invalid email address';
		}
	};

	const onSubmit: EventHandler<SubmitEvent, HTMLFormElement> | null | undefined = async (event) => {
		try {
			event.preventDefault();
			const form = event.target as HTMLFormElement | null;
			if (!form) {
				return;
			}
			if (!form.checkValidity()) {
				isFormValid = false;
				form
					.querySelectorAll('input, textarea')
					.forEach((e) => e.dispatchEvent(new Event('focusout', { bubbles: true })));
				return;
			}
			const payload = Object.fromEntries(new FormData(form));
			const response = (await fetch(`${constants.API_URL}/api/users/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			}).then((res) => res.json())) as APIResponse<{ candidate: Candidate; sessionToken: string }>;

			if (!response.success) {
				throw new ValidationError(response.error || 'Unable to register. Please try again later');
			}

			if (response.success) {
				$sessionStore = {
					sessionToken: response.data?.sessionToken || ''
				};
				await goto('/');
			}
		} catch (error) {
			console.log(error);
			if (error instanceof ValidationError) {
				toast.error(error.message);
			} else {
				toast.error('Unable to register. Please try again later');
			}
		} finally {
			isFormLoading = false;
			isFormValid = undefined;
		}
	};
	onMount(() => {
		if (!carouselRef) return;
		const instance = new Carousel(carouselRef, {
			ride: 'carousel',
			interval: 4000
		});

		if (data.departments.error || !data.departments.result.status) {
			toast.error('Error while fetching departments');
		}

		return () => {
			if (carouselRef) {
				instance.dispose();
			}
		};
	});
</script>

<Toaster />
<div class="login row w-100">
	<div class="login__showcase col-sm-6 d-none d-md-flex p-4">
		<div class="login__showcase-container">
			<div
				class="login__showcase-carousel carousel slide h-100"
				id="showcaseCarousel"
				bind:this={carouselRef}
			>
				<div class="carousel-indicators">
					{#each slides as slide, index}
						<button
							type="button"
							data-bs-target="#showcaseCarousel"
							data-bs-slide-to={index}
							class:active={slide.isActive}
							aria-current={slide.isActive}
							aria-label="Slide {index + 1}"
						></button>
					{/each}
				</div>
				<div class="carousel-inner">
					{#each slides as slide, index}
						<div
							class="carousel-item"
							class:active={slide.isActive}
							style="background:  no-repeat center/contain url({slide.background});"
						>
							<img
								src={slide.content}
								alt="Showcasing various KTT products"
								class="d-block w-100"
							/>
						</div>
					{/each}
				</div>
				<button
					class="carousel-control-prev"
					type="button"
					data-bs-target="#showcaseCarousel"
					data-bs-slide="prev"
				>
					<ChevronLeft style="color: var(--color-neutral-700)" size="48" absoluteStrokeWidth />
					<span class="visually-hidden">Previous</span>
				</button>
				<button
					class="carousel-control-next"
					type="button"
					data-bs-target="#showcaseCarousel"
					data-bs-slide="next"
				>
					<ChevronRight style="color: var(--color-neutral-700)" size="48" absoluteStrokeWidth />
					<span class="visually-hidden">Next</span>
				</button>
			</div>
		</div>
	</div>
	<div class="login__registration col position-relative p-4">
		<div class="login__registration-wrapper vstack mx-auto">
			<div class="login__registration_brand mb-5">
				<img src={kttHorizontalLogo} alt="Brand logo" class="w-100" />
			</div>
			<div class="login__form-container">
				<h2>Register</h2>
				<div class="text-body-secondary">Let us know you more</div>
				<hr />
				<form
					novalidate
					class:was-validated={isFormValid}
					onfocusout={onFormInteraction}
					oninput={onFormInteraction}
					onsubmit={onSubmit}
				>
					<div class="mb-3">
						<label class="form-label" for="firstName">First Name</label>
						<input
							type="text"
							class="form-control"
							name="firstName"
							id="firstName"
							required
							class:is-invalid={formState.firstName}
						/>
						{#if formState.firstName}
							<div class="invalid-feedback">{formState.firstName}</div>
						{/if}
					</div>
					<div class="mb-3">
						<label class="form-label" for="lastName">Last Name</label>
						<input
							type="text"
							class="form-control"
							name="lastName"
							id="lastName"
							required
							class:is-invalid={formState.lastName}
						/>
						{#if formState.lastName}
							<div class="invalid-feedback">{formState.lastName}</div>
						{/if}
					</div>
					<div class="mb-3">
						<label class="form-label" for="email">Email</label>
						<input
							type="email"
							class="form-control"
							name="email"
							id="email"
							required
							class:is-invalid={formState.email}
						/>
						{#if formState.email}
							<div class="invalid-feedback">{formState.email}</div>
						{/if}
					</div>
					<div class="mb-3">
						<label class="form-label" for="rollNumber">Roll Number</label>
						<input
							type="text"
							min="0"
							class="form-control"
							name="rollNumber"
							id="rollNumber"
							required
							class:is-invalid={formState.rollNumber}
						/>
						{#if formState.rollNumber}
							<div class="invalid-feedback">{formState.rollNumber}</div>
						{/if}
					</div>
					<div class="mb-5">
						<label class="form-label" for="department">Department</label>
						<Select2
							className="form-select {formState.departmentId ? 'is-invalid' : ''}"
							placeholder="Select Department"
							options={{
								data: departments.map((d) => ({ id: d.id, text: d.name }))
							}}
							id="department"
							name="departmentId"
							required
						></Select2>
						{#if formState.departmentId}
							<div class="invalid-feedback">{formState.departmentId}</div>
						{/if}
					</div>
					<div class="mb-3">
						<button class="btn btn-primary w-100 hstack gap-2 justify-content-center">
							{#if isFormLoading}
								<span class="spinner">
									<Loader2 />
								</span>
								<span>Submitting</span>
							{:else}
								<span>Register</span>
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.login {
		min-height: 100vh;
		overflow: hidden;
		overflow-y: auto;
	}

	.login__showcase {
		background-color: var(--color-neutral-200);
	}

	.login__showcase-container {
		display: grid;
		height: 100%;
		width: 100%;
	}

	.login__showcase-carousel {
		display: grid;
		place-items: center;
		place-content: center;
	}

	.login__showcase-carousel img {
		min-height: 75vh;
		object-fit: contain;
	}

	.login__registration-wrapper {
		max-width: var(--container-md);
	}

	.login__registration_brand {
		max-width: 20rem;
		margin-left: -1rem;
	}

	.carousel-indicators button {
		background-color: var(--color-neutral-700);
	}

	.carousel-indicators button.active {
		background-color: var(--color-neutral-900);
	}
</style>
