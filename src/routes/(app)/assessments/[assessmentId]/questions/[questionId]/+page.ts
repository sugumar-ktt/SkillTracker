import { fetchExtended } from '$src/lib/utils';
import type { APIResponse, AssessmentAttemptDetail } from '$src/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const parentData = await parent();
	const assesmentAttemptId = parentData.assessmentAttempt.data.id;
	const attemptDetail = fetchExtended<APIResponse<AssessmentAttemptDetail>>(
		fetch,
		`/api/assessments/attempts/${assesmentAttemptId}/question/${params.questionId}/attempt-detail`
	);
	return {
		attemptDetail
	};
};
