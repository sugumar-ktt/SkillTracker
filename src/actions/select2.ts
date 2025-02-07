import jQuery from 'jquery';
import select2, {
	type DataFormat,
	type GroupedDataFormat,
	type OptionData,
	type Options
} from 'select2';
import type { Action, ActionReturn } from 'svelte/action';
import type { HTMLSelectAttributes } from 'svelte/elements';

// @ts-expect-error
select2(jQuery);

export type Select2Options = Options<DataFormat | GroupedDataFormat>;

export interface Select2Parameters {
	options?: Select2Options;
	value?: string | string[];
	disabled?: boolean;
}

export interface Select2EventBase {
	data?: DataFormat | GroupedDataFormat;
	target: EventTarget | null;
}

export interface Select2ChangeEvent {
	data: OptionData[];
	target: HTMLSelectElement;
	value: string | string[] | undefined;
}

export interface Select2Attributes extends HTMLSelectAttributes {
	'onselect2-change'?: (e: CustomEvent<Select2ChangeEvent>) => void;
	'onselect2-select'?: (e: CustomEvent<Select2EventBase>) => void;
	'onselect2-unselect'?: (e: CustomEvent<Select2EventBase>) => void;
	'onselect2-open'?: (e: CustomEvent<Select2EventBase>) => void;
	'onselect2-close'?: (e: CustomEvent<Select2EventBase>) => void;
	'onselect2-clear'?: (e: CustomEvent<Select2EventBase>) => void;
}

export const selectv2: Action<HTMLSelectElement, Select2Parameters, Select2Attributes> = (
	node: HTMLSelectElement,
	parameters?: Select2Parameters
): ActionReturn<Select2Parameters> => {
	let select2Instance: JQuery | undefined;
	let currentParams: Select2Parameters = parameters || {};

	const bindEvents = () => {
		const events = [
			'c-select2:select',
			'c-select2:unselect',
			'c-select2:open',
			'c-select2:close',
			'c-select2:clear'
		];

		const handleSelect2Event = (e: any) => {
			const select2Event = e?.originalEvent;
			node.dispatchEvent(
				new CustomEvent(e.type, {
					detail: {
						data: select2Event?.params?.data,
						target: e.target
					}
				})
			);
		};

		events.forEach((eventName) => {
			jQuery(node).on(eventName, handleSelect2Event);
		});

		jQuery(node).on('change', (e) => {
			const newValue = jQuery(node).val();
			node.dispatchEvent(
				new CustomEvent('c-select2:change', {
					detail: {
						value: newValue,
						data: jQuery(node).select2('data'),
						target: e.currentTarget
					}
				})
			);
		});
	};

	const init = (params: Select2Parameters = {}) => {
		select2Instance = jQuery(node).select2(params.options || {});
		jQuery(node)
			.val(params?.value || '')
			.trigger('change.select2');

		if (params.disabled) {
			jQuery(node).prop('disabled', true);
		}

		bindEvents();
		currentParams = params;
	};

	const destroy = () => {
		if (select2Instance) {
			const events = [
				'c-select2:select',
				'c-select2:unselect',
				'c-select2:open',
				'c-select2:close',
				'c-select2:clear',
				'change'
			];
			events.forEach((eventName) => {
				jQuery(node).off(eventName);
			});

			select2Instance.select2('destroy');
			select2Instance = undefined;
		}
	};

	const shouldReinitialize = (newParams: Select2Parameters) => {
		const optionsChanged =
			JSON.stringify(newParams.options) !== JSON.stringify(currentParams.options);
		return optionsChanged;
	};

	init(parameters);

	return {
		update(params: Select2Parameters) {
			if (!select2Instance) {
				init(params);
				return;
			}

			if (shouldReinitialize(params)) {
				destroy();
				init(params);
				return;
			}

			if (params.value !== currentParams.value) {
				jQuery(node)
					.val(params.value || '')
					.trigger('change.select2');
			}

			if (params.disabled !== currentParams.disabled) {
				jQuery(node).prop('disabled', !!params.disabled);
			}

			currentParams = params;
		},
		destroy
	};
};
