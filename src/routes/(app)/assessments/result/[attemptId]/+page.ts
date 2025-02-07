import { fetchExtended } from '$src/lib/utils';
import type { APIResponse, Submission } from '$src/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const assessmentResult = fetchExtended<APIResponse<Submission>>(
		fetch,
		`/api/assessments/attempts/${params.attemptId}/result`
	);
	return {
		assessmentResult
	};
};
