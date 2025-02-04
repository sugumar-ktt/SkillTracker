<script lang="ts">
	import { CirclePlay, Clock, FileText, Target, University, User, Zap } from 'lucide-svelte';
	import { onMount, type Component } from 'svelte';
	import { waveform } from 'ldrs';
	import type { PageProps } from './$types';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { type Assesment, type Candidate } from '$src/types';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import relativeTime from 'dayjs/plugin/relativeTime';

	waveform.register();
	dayjs.extend(duration);
	dayjs.extend(relativeTime);

	let { data }: PageProps = $props();

	let candidate: Candidate | undefined = $state();

	onMount(() => {
		data.assesments.then((assesments) => {
			if (assesments.error || !assesments.result.status) {
				toast.error('Error while retrieving assesments. Please try again later');
			}
		});
		data.candidate.then((res) => {
			if (res.error || !res.result.status) {
				toast.error('Error while retrieving candidate information. Please try again later');
			} else if (res.result.data) {
				candidate = res.result.data;
			}
		});
	});
</script>

{#snippet AssementInfoItemIcon(Icon: Component)}
	<div class="assesment-info-icon">
		<Icon></Icon>
	</div>
{/snippet}

{#snippet AssesmentInfoItem(icon: any, label: string, value: string)}
	<div class="assesment-info-item hstack gap-3 p-3">
		<div class="hstack h-100">
			{@render AssementInfoItemIcon(icon)}
		</div>
		<div class="vstack">
			<span class="text-body-secondary">{label}</span>
			<span class="text-body-emphasis fw-medium">{value}</span>
		</div>
	</div>
{/snippet}

<Toaster />
<section class="assesment min-vh-100 p-3">
	{#await data.assesments}
		<div class="w-100 h-100" style="display: grid; place-items: center;">
			<l-waveform size="48" stroke="5" speed="1" color="var(--color-primary-600)"></l-waveform>
		</div>
	{:then { result: assesments }}
		{@const assesment = assesments?.data?.at(0) as Assesment}
		<div
			class="assesment__card card border-0 overflow-hidden"
			style="box-shadow: var(--shadow-lg);"
		>
			<div class="card-body p-0">
				<header class="assesment_header p-3 py-4">
					<h2 class="mb-3 fw-semibold">{assesment.name}</h2>
					<p class="fs-5">Developer Assesment</p>
				</header>
				<div class="assesment_content p-4">
					<div class="row gy-4 mb-4">
						<div class="col-md-8">
							{@render AssesmentInfoItem(
								User,
								'Candidate',
								`${candidate?.firstName} ${candidate?.lastName}`
							)}
						</div>
						<div class="col-md">
							{@render AssesmentInfoItem(Target, 'Position', 'Junior Developer')}
						</div>
					</div>
					<div class="row gy-4 mb-3">
						<div class="col">
							{@render AssesmentInfoItem(University, 'College', 'BIT')}
						</div>
						<div class="col-md-4">
							{@render AssesmentInfoItem(
								Clock,
								'Duration',
								`${dayjs
									.duration(dayjs(assesment.endDate).diff(dayjs(assesment.startDate)))
									.as('minutes')} Minutes`
							)}
						</div>
						<div class="col-md-4">
							{@render AssesmentInfoItem(FileText, 'Questions', String(assesment.questions))}
						</div>
					</div>
					<hr />
					<div class="hstack justify-content-center mb-3">
						<button type="button" class="btn btn-primary text-white hstack gap-2">
							<CirclePlay />
							<span>Start Test</span>
						</button>
					</div>
					<p class="mt-2 text-body-tertiary text-center">
						Test Ends On: {dayjs(assesment.endDate).format('MMMM DD[, 	] hh:m A')}
					</p>
				</div>
			</div>
		</div>
	{/await}
</section>

<style>
	.assesment {
		display: grid;
		width: 100%;
		place-items: center;
	}

	.assesment_header {
		background-color: rgba(25, 144, 138, 0.9);
		color: var(--color-white);
	}

	.assesment-info-item {
		background-color: var(--color-neutral-100);
		border-radius: 0.8rem;
	}

	.assesment-info-item:hover {
		background-color: var(--color-neutral-200);
	}

	.assesment-info-icon {
		aspect-ratio: 1/1;
		border-radius: 50%;
		width: 3rem;
		background-color: var(--color-primary-100);
		color: var(--color-primary-600);
		display: grid;
		place-items: center;
	}

	.assesment-info-icon :global(svg) {
		width: 1.6rem;
		height: 1.6rem;
	}

	@media (min-width: 1024px) {
		.assesment__card {
			min-width: var(--container-4xl);
		}
	}
</style>
