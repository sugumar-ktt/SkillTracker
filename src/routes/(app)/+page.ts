import { fetchExtended } from '$src/lib/utils';
import type { APIResponse, Assessment, Candidate } from '$src/types';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const activeAssessment = await fetchExtended<APIResponse<Assessment>>(
		fetch,
		'/api/assessments/active'
	);
	const activeAssessmentPayload = activeAssessment?.result?.data;

	if (activeAssessmentPayload) {
		redirect(307, `/assessments/${activeAssessmentPayload.id}`);
	}
	const assessments = fetchExtended<APIResponse<Assessment[]>>(fetch, '/api/assessments');
	const candidate = fetchExtended<APIResponse<Candidate>>(fetch, '/api/candidates/by-session');
	return {
		assessments,
		candidate
	};
};
