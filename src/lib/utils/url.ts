/**
 * Checks whether a given URL is absolute.
 */
export function isAbsoluteUrl(url: string): boolean {
	const schemeRegex = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;
	return schemeRegex.test(url) || url.startsWith('//');
}

/**
 * Checks whether a given URL is relative.
 */
export function isRelativeUrl(url: string): boolean {
	return !isAbsoluteUrl(url);
}
