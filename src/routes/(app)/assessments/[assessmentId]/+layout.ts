import { fetchExtended } from '$src/lib/utils';
import type { APIResponse, AssessmentAttempt } from '$src/types';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, params }) => {
	const { error, result } = await fetchExtended<APIResponse<AssessmentAttempt>>(
		fetch,
		`/api/assessments/${params.assessmentId}/attempts/active`
	);
	if (error || !result.data) {
		redirect(302, '/');
	}
	return {
		assessmentAttempt: result
	};
};
