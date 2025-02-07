<script lang="ts">
	import { goto } from '$app/navigation';
	import constants from '$src/lib/constants';
	import { fetchExtended } from '$src/lib/utils';
	import { ValidationError } from '$src/lib/utils/error';
	import { sessionStore } from '$src/stores';
	import type { APIResponse, Candidate } from '$src/types';
	import { Loader2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import toast from 'svelte-5-french-toast';
	import type { EventHandler } from 'svelte/elements';

	type FormFields = {
		userName: string;
		password: string;
	};

	type LoginResponsePayload = {
		candidate: Candidate;
		sessionToken: string;
	};

	let isFormValid: boolean | undefined = $state();
	let isFormLoading = $state(false);
	let formState: Record<keyof FormFields, string> = $state({
		password: '',
		userName: ''
	});

	const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (event) => {
		try {
			event.preventDefault();
			const form = event.target as HTMLFormElement;
			if (!form.checkValidity()) {
				isFormValid = false;
				return;
			}

			const payload = Object.fromEntries(new FormData(form));

			isFormLoading = true;
			const { error, result } = await fetchExtended<APIResponse<LoginResponsePayload>>(
				fetch,
				`${constants.API_URL}/api/users/login`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(payload)
				}
			);

			if (error) {
				throw new Error('Network error while logging in');
			}

			if (!result.success) {
				throw new ValidationError(result.error);
			}

			$sessionStore = { sessionToken: result.data?.sessionToken || '' };
			await goto('/');
		} catch (error) {
			console.log(error);
			if (error instanceof ValidationError) {
				toast.error(error.message);
			} else {
				toast.error('Unable to login. Try again or reach out support');
			}
		} finally {
			isFormValid = undefined;
			isFormLoading = false;
		}
	};

	onMount(async () => {
		if ($sessionStore.sessionToken) {
			await goto('/');
		}
	});
</script>

<div class="login">
	<header class="vstack align-items-center mb-4">
		<div class="fs-2 fw-medium">Login</div>
		<div class="text-body-secondary">Login to your account</div>
	</header>
	<form novalidate class:was-validated={isFormValid} onsubmit={handleSubmit}>
		<div class="mb-3">
			<label class="form-label" for="userName">Username (Roll number)</label>
			<input
				type="text"
				name="userName"
				id="userName"
				placeholder="Enter your roll number"
				class="form-control"
				class:is-invalid={formState.userName}
				required
			/>
			{#if formState.userName}
				<div class="invalid-feedback">{formState.userName}</div>
			{/if}
		</div>
		<div class="mb-5">
			<label class="form-label" for="password">Password</label>
			<input
				type="password"
				name="password"
				id="password"
				class="form-control"
				class:is-invalid={formState.password}
				required
			/>
			{#if formState.password}
				<div class="invalid-feedback">{formState.password}</div>
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
					<span>Login</span>
				{/if}
			</button>
		</div>
		<footer class="hstack gap-1 justify-content-center">
			<span class="text-body-secondary">Don't have an account?</span>
			<a href="/register" class="text-decoration-none">Register here</a>
		</footer>
	</form>
</div>
