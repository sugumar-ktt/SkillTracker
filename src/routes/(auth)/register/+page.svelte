<script lang="ts">
	import { goto } from '$app/navigation';
	import { validate, type FormElements } from '$src/actions/validate';
	import Select2 from '$src/components/Select2.svelte';
	import constants from '$src/lib/constants';
	import { fetchExtended } from '$src/lib/utils';
	import { ValidationError } from '$src/lib/utils/error';
	import { sessionStore } from '$src/stores';
	import type { APIResponse, Candidate, Department } from '$src/types';
	import { Loader2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import type { EventHandler } from 'svelte/elements';
	import type { PageProps } from './$types';

	type FormFields = {
		firstName: string;
		lastName: string;
		password: string;
		email: string;
		rollNumber: string;
		departmentId: string;
	};

	type RegisterResponsePayload = {
		candidate: Candidate;
		sessionToken: string;
	};

	let { data }: PageProps = $props();
	let departments: Department[] = $derived(data.departments.result?.data || []);

	let formState: Record<keyof FormFields, string> = $state({
		firstName: '',
		password: '',
		lastName: '',
		rollNumber: '',
		departmentId: '',
		email: ''
	});
	let isFormValid: boolean | undefined = $state();
	let isFormLoading = $state(false);
	let formRef: HTMLFormElement | undefined = $state();

	const updateError = (field: keyof FormFields, error: string) => {
		formState[field] = error;
		const controlElement: FormElements | undefined | null = formRef?.querySelector(
			`[name="${field}"]`
		);
		if (controlElement) {
			controlElement.setCustomValidity(error);
		}
	};

	const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (event) => {
		try {
			event.preventDefault();
			const form = event.target as HTMLFormElement;
			if (!form.checkValidity()) {
				isFormValid = false;
				return;
			}

			const payload = Object.fromEntries(new FormData(form));

			const passwordRegex =
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
			if (!passwordRegex.test(payload.password as string)) {
				updateError(
					'password',
					'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
				);
				isFormValid = false;
				return;
			}

			isFormLoading = true;
			const { error, result } = await fetchExtended<APIResponse<RegisterResponsePayload>>(
				fetch,
				`${constants.API_URL}/api/users/register`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(payload)
				}
			);

			if (error) {
				throw new Error('Network error while registering');
			}

			if (!result.success) {
				throw new ValidationError(result.error);
			}

			$sessionStore = { sessionToken: result.data?.sessionToken || '' };
			await goto('/');
		} catch (error) {
			console.error(error);
			toast.error(
				error instanceof ValidationError
					? error.message
					: 'Unable to register. Please try again later'
			);
		} finally {
			isFormLoading = false;
			isFormValid = undefined;
		}
	};

	onMount(async () => {
		if (data.departments.error || !data.departments.result.status) {
			toast.error('Error while fetching departments');
		}
		if ($sessionStore.sessionToken) {
			await goto('/');
		}
	});
</script>

<Toaster />
<div class="registration">
	<header class="vstack align-items-center mb-4">
		<div class="fs-2 fw-medium">Register</div>
	</header>
	<form novalidate class:was-validated={isFormValid} onsubmit={handleSubmit} bind:this={formRef}>
		<div class="mb-3">
			<label class="form-label" for="firstName">First Name</label>
			<input
				type="text"
				name="firstName"
				id="firstName"
				required
				use:validate={{ fieldName: 'firstName', onError: updateError }}
				class="form-control"
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
				name="lastName"
				id="lastName"
				required
				use:validate={{ fieldName: 'lastName', onError: updateError }}
				class="form-control"
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
				name="email"
				id="email"
				placeholder="student@college.com"
				required
				use:validate={{ fieldName: 'email', onError: updateError }}
				class="form-control"
				class:is-invalid={formState.email}
			/>
			{#if formState.email}
				<div class="invalid-feedback">{formState.email}</div>
			{/if}
		</div>
		<div class="mb-3">
			<label class="form-label" for="password">Password</label>
			<input
				type="password"
				name="password"
				id="password"
				required
				use:validate={{ fieldName: 'password', onError: updateError }}
				class="form-control"
				class:is-invalid={formState.password}
			/>
			{#if formState.password}
				<div class="invalid-feedback">{formState.password}</div>
			{/if}
		</div>
		<div class="mb-3">
			<label class="form-label" for="rollNumber">Roll Number</label>
			<input
				type="text"
				min="0"
				name="rollNumber"
				id="rollNumber"
				placeholder="Enter your roll number"
				required
				use:validate={{ fieldName: 'rollNumber', onError: updateError }}
				class="form-control"
				class:is-invalid={formState.rollNumber}
			/>
			{#if formState.rollNumber}
				<div class="invalid-feedback">{formState.rollNumber}</div>
			{/if}
		</div>
		<div class="mb-5">
			<label class="form-label" for="department">Department</label>
			<Select2
				name="departmentId"
				id="department"
				placeholder="Select Department"
				required
				options={{ data: departments.map((d) => ({ id: d.id, text: d.name })) }}
				className="form-select {formState.departmentId ? 'is-valid' : ''}"
			/>
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
		<footer class="hstack gap-1 justify-content-center">
			<span class="text-body-secondary">Already have an account?</span>
			<a href="/login" class="text-decoration-none">Login here</a>
		</footer>
	</form>
</div>
