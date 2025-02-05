type SuccessResult<T> = {
	error?: null;
	result: T;
};
type ErrorResult = {
	error: Error;
	result?: null;
};

export type ResultType<T> = SuccessResult<T> | ErrorResult;
export type APIResponse<T> =
	| {
			success: true;
			status: number;
			data: T;
			error?: null;
	  }
	| {
			success: false;
			status: number;
			error: string;
			data?: null;
	  };

export type Department = {
	id: number;
	name: string;
};

export type Candidate = {
	id: number;
	firstName: string;
	lastName: string;
};

export type Assessment = {
	id: number;
	name: string;
	startDate: string;
	endDate: string;
	questions: number;
};

export type AssessmentAttempt = {
	id: number;
	startTime: string;
	endTime: string;
	status: 'Draft' | 'InProgress' | 'Completed';
	SessionId: number;
	CandidateId: number;
	AssessmentId: number;
	AssessmentAttemptDetails: AssessmentAttemptDetail[];
	Assessment: Assessment;
};

export type Choice = {
	id: string;
	text: string;
};

export type Snippet = {
	code: string;
	language: string;
};

export type AssessmentAttemptDetail = {
	id?: number;
	isAttempted?: boolean;
	isCorrect?: boolean;
	changeCount?: number;
	submission?: Choice;
	score?: number;
	reviewerFeedback?: string;
	gradedAt?: string;
	QuestionId: number;
	AssessmentAttemptId: number;
	Question: Question;
};

export type QuestionTypeEnum = 'mcq' | 'coding';
export type Question = {
	id?: number;
	description: string;
	hint: string | null;
	choices: Choice[];
	answer?: Choice;
	score: number;
	type: QuestionTypeEnum;
	AssessmentId?: number;
	snippet?: Snippet;
};

export type Submission = {
	id?: number;
	submittedAt: string;
	totalScore: number;
	attemptedQuestions: number;
	correctAnswers: number;
	duration: number;
	sessionId: number;
	CandidateId: number;
	AssessmentAttemptId: number;
};
