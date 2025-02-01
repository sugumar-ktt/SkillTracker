<script lang="ts">
	import {
		selectv2,
		type Select2Attributes,
		type Select2ChangeEvent,
		type Select2Options
	} from '$actions/select2';
	import jQuery from 'jquery';
	import select2, { type OptionData } from 'select2';
	import { onMount } from 'svelte';

	// @ts-ignore
	select2(jQuery);

	interface Props {
		value?: string | string[];
		required?: boolean;
		name?: string;
		className?: string;
		options?: Select2Options;
		disabled?: boolean;
		placeholder?: string;
		multiple?: boolean;
		isInsideModal?: boolean;
		children?: import('svelte').Snippet;
		[key: string]: any;
		onChange?: (event: Select2ChangeEvent) => void;
	}

	let {
		value = $bindable(''),
		required = false,
		name = '',
		className = 'form-select',
		options = {},
		disabled = false,
		placeholder = '',
		multiple = false,
		isInsideModal = false,
		children,
		onChange = () => {},
		...rest
	}: Props = $props();

	let selectElement: HTMLSelectElement | undefined = $state();

	const defaultOptions: Select2Options = {
		width: '100%',
		theme: 'bootstrap-5'
	};

	let select2Parameters = $derived({
		options: {
			...defaultOptions,
			...options,
			dropdownParent: isInsideModal ? (selectElement?.closest('.modal') as HTMLElement) : undefined,
			placeholder,
			multiple
		},
		value,
		disabled
	});

	const isValueEqual = (a: string | string[], b: string | string[]): boolean => {
		if (Array.isArray(a) && Array.isArray(b)) {
			return a.length === b.length && a.every((val, idx) => String(val) === String(b[idx]));
		}
		return String(a) === String(b);
	};

	const handleSelect2Change = (event: CustomEvent<Select2ChangeEvent>) => {
		const newValue = event.detail.data.map((x) => x.id);
		if (!isValueEqual(newValue, Array.isArray(value) ? value : [value])) {
			value = multiple ? newValue : newValue[0];
			if (selectElement) {
				onChange({
					data: event.detail.data,
					target: selectElement satisfies HTMLSelectElement,
					value: newValue
				});
			}
		}
	};

	onMount(() => {
		if (selectElement) {
			const select = jQuery(selectElement);
			if (value) {
				select.val(value).trigger('change');
			}
		}
	});
</script>

<select
	{name}
	{required}
	class={className}
	bind:this={selectElement}
	use:selectv2={select2Parameters}
	onselect2-change={handleSelect2Change}
	{multiple}
	{...rest}
>
	{@render children?.()}
</select>

<style>
	:global(.select2-container) {
		width: 100% !important;
	}
</style>
