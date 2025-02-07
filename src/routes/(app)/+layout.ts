import { fetchExtended } from '$src/lib/utils';
import type { APIResponse } from '$src/types';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	const sessionValidity = await fetchExtended<APIResponse<boolean>>(fetch, '/api/users/session');
	if (sessionValidity.error || !sessionValidity.result.success) {
		redirect(307, '/register');
	}
};
