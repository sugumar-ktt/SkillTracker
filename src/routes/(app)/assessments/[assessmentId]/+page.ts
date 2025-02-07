import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const layoutData = await parent();
	const assessmentAttempt = layoutData.assessmentAttempt.data;
	const attemptDetail = assessmentAttempt.AssessmentAttemptDetails.at(0);
	if (attemptDetail) {
		redirect(307, `./${assessmentAttempt.AssessmentId}/questions/${attemptDetail.QuestionId}`);
	}
};
