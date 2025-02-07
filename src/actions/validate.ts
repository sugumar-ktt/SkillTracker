export type ValidateParams<T> = {
	fieldName: keyof T;
	onError: (field: keyof T, error: string) => void;
};

export type FormElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function validate<T>(node: FormElements, params: ValidateParams<T>) {
	let touched = false;
	let error = '';

	function updateErrorState(element: FormElements) {
		error = '';
		const validity = element.validity;
		if (validity.valid) {
			error = '';
		} else {
			if (validity.valueMissing) {
				error = 'Field is required';
			} else if (element.type === 'email' && validity.typeMismatch) {
				error = 'Invalid email address';
			}
		}
	}

	function handleInvalidEvent() {
		touched = true;
		updateErrorState(node);
		params.onError(params.fieldName, error);
	}

	function handler(event: Event) {
		const element = event.target as FormElements;
		if (!element.validity) return;

		// Mark as touched on blur
		if (event.type === 'focusout') {
			touched = true;
		}
		// Only update error if field has been touched to avoid early distractions.
		if (touched) {
			updateErrorState(element);
		}
		params.onError(params.fieldName, error);
	}

	node.addEventListener('focusout', handler);
	node.addEventListener('input', handler);
	node.addEventListener('invalid', handleInvalidEvent);

	return {
		destroy() {
			node.removeEventListener('focusout', handler);
			node.removeEventListener('input', handler);
			node.removeEventListener('invalid', handleInvalidEvent);
		}
	};
}
