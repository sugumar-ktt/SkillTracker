import { fetchExtended } from '$src/lib/utils';
import type { APIResponse, Assesment, Candidate } from '$src/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const assesments = fetchExtended<APIResponse<Assesment[]>>(fetch, '/api/assesments');
	const candidate = fetchExtended<APIResponse<Candidate>>(fetch, '/api/candidates/by-session');
	return {
		assesments,
		candidate
	};
};
