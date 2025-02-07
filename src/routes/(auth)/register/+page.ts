import { fetchExtended } from '$src/lib/utils';
import type { APIResponse, Department } from '$src/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [departments] = await Promise.all([
		fetchExtended<APIResponse<Department[]>>(fetch, '/api/departments')
	]);
	return {
		departments
	};
};
