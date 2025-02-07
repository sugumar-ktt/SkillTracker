export class ValidationError extends Error {
	code: string | undefined;
	constructor(message: string, code?: string) {
		super(message);
		Object.setPrototypeOf(this, ValidationError.prototype);
		if (code) {
			this.code = code;
		}
	}
}
