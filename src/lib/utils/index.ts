import constants from '$lib/constants';
import { sessionStore } from '$src/stores';
import { type ResultType } from '$src/types';
import { get } from 'svelte/store';
import { isRelativeUrl } from './url';

const BASE_URL = `${constants.API_URL}`;

type FetchOptions = {
	timeout?: number;
};
export async function fetchExtended<T>(
	fetcher: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> = fetch,
	endpoint: string,
	options?: RequestInit & FetchOptions
): Promise<ResultType<T>> {
	const controller = new AbortController();

	const defaultOptions: Partial<RequestInit & FetchOptions> = {
		timeout: 1000 * 15,
		credentials: 'include'
	};
	const mergedOptions = { ...defaultOptions, ...options };
	mergedOptions.headers = {
		...(mergedOptions.headers || {}),
		Authorization: `Bearer ${get(sessionStore).sessionToken}`
	};

	const timeoutId = setTimeout(() => controller.abort(), mergedOptions.timeout);

	try {
		const url = isRelativeUrl(endpoint) ? `${BASE_URL}${endpoint}` : endpoint;
		const response = await fetcher(url, {
			...mergedOptions,
			signal: controller.signal
		});

		const data = await response.json();
		return { error: null, result: data as T };
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				return {
					error: new Error(
						'Request timed out. Please check your internet connection and try again.'
					)
				};
			}
		}
		return {
			error: new Error('An unexpected error occurred. Please try again.', {
				cause: error
			})
		};
	} finally {
		clearTimeout(timeoutId);
	}
}

export function delayedPromise(delay: number = 1000 * 60 * 5) {
	return new Promise((res) => setTimeout(res, delay));
}
