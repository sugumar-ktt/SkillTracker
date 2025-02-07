<script lang="ts">
	import { goto } from '$app/navigation';
	import constants from '$src/lib/constants';
	import { fetchExtended } from '$src/lib/utils';
	import { ValidationError } from '$src/lib/utils/error';
	import { sessionStore } from '$src/stores';
	import { type APIResponse } from '$src/types';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { waveform } from 'ldrs';

	waveform.register();

	let isLoading = $state(true);
	onMount(async () => {
		if (!$sessionStore.sessionToken) {
			await goto('/login');
			return;
		}
		try {
			const { error, result } = await fetchExtended<APIResponse<{ message: string }>>(
				fetch,
				`${constants.API_URL}/api/users/logout`,
				{
					method: 'POST'
				}
			);

			if (error) {
				throw new Error('Network error while logging out');
			}

			if (!result.success) {
				throw new ValidationError(result.error);
			}

			$sessionStore = { sessionToken: '' };
			await goto('/register');
		} catch (error) {
			console.log(error);
			if (error instanceof ValidationError) {
				toast.error(error.message);
			} else {
				toast.error('Unable to logout. Try again or reach out support');
			}
		} finally {
			isLoading = false;
		}
	});
</script>

<Toaster />

{#if isLoading}
	<div class="w-100 h-100" style="display: grid; place-items: center;">
		<l-waveform size="48" stroke="4" speed="1" color="var(--color-primary-600)"></l-waveform>
	</div>
{/if}
