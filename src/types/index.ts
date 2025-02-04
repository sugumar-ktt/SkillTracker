type SuccessResult<T> = {
	error?: null;
	result: T;
};
type ErrorResult = {
	error: Error;
	result?: null;
};

export type ResultType<T> = SuccessResult<T> | ErrorResult;
export type APIResponse<T> = {
	success: boolean;
	status: number;
	data?: T;
	error?: string;
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

export type Assesment = {
	id: number;
	name: string;
	startDate: string;
	endDate: string;
	questions: number;
};
