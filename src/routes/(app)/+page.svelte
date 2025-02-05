<script lang="ts">
	import { goto } from '$app/navigation';
	import constants from '$src/lib/constants';
	import { fetchExtended } from '$src/lib/utils';
	import { ValidationError } from '$src/lib/utils/error';
	import {
		type APIResponse,
		type Assessment,
		type AssessmentAttempt,
		type Candidate
	} from '$src/types';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { waveform } from 'ldrs';
	import { CirclePlay, Clock, FileText, Loader2, Target, University, User } from 'lucide-svelte';
	import { onMount, type Component } from 'svelte';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import type { PageProps } from './$types';
	import ErrorComponent from '$components/Error.svelte';

	waveform.register();
	dayjs.extend(duration);
	dayjs.extend(relativeTime);

	let { data }: PageProps = $props();

	let candidate: Candidate | undefined = $state();
	let isStartTestBtnLoading = $state(false);

	const onAssessmentStart = async (assessmentId: number) => {
		try {
			isStartTestBtnLoading = true;
			const { error, result } = await fetchExtended<APIResponse<AssessmentAttempt>>(
				fetch,
				`${constants.API_URL}/api/assessments/${assessmentId}/start`,
				{
					method: 'POST'
				}
			);

			if (error) {
				throw new Error('Network error while attempting to start assessment');
			}

			if (!result.success) {
				throw new ValidationError(result.error);
			}

			await goto(`/assessments/${result.data.AssessmentId}`);
		} catch (error) {
			console.log(error);
			if (error instanceof ValidationError) {
				toast.error(error.message);
			} else {
				toast.error('Unable to start assessment. Please try again later');
			}
		} finally {
			isStartTestBtnLoading = false;
		}
	};

	onMount(() => {
		data.assessments.then((assessments) => {
			if (assessments.error || !assessments.result.status) {
				toast.error('Error while retrieving assessments. Please try again later');
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
	<div class="assessment-info-icon">
		<Icon></Icon>
	</div>
{/snippet}

{#snippet AssessmentInfoItem(icon: any, label: string, value: string)}
	<div class="assessment-info-item hstack gap-3 p-3">
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
<section class="assessment min-vh-100 p-3">
	{#await data.assessments}
		<div class="w-100 h-100" style="display: grid; place-items: center;">
			<l-waveform size="48" stroke="4" speed="1" color="var(--color-primary-600)"></l-waveform>
		</div>
	{:then { result: assessments }}
		{@const assessment = assessments?.data?.at(0) as Assessment | undefined}
		{#if assessment}
			<div
				class="assessment__card card border-0 overflow-hidden"
				style="box-shadow: var(--shadow-lg);"
			>
				<div class="card-body p-0">
					<header class="assessment_header p-3 py-4">
						<h2 class="mb-3 fw-semibold">{assessment.name}</h2>
						<p class="fs-5">Developer Assessment</p>
					</header>
					<div class="assessment_content p-4">
						<div class="row gy-4 mb-4">
							<div class="col-md-8">
								{@render AssessmentInfoItem(
									User,
									'Candidate',
									`${candidate?.firstName} ${candidate?.lastName}`
								)}
							</div>
							<div class="col-md">
								{@render AssessmentInfoItem(Target, 'Position', 'Junior Developer')}
							</div>
						</div>
						<div class="row gy-4 mb-3">
							<div class="col-md-4">
								{@render AssessmentInfoItem(
									FileText,
									'Questions',
									String(assessment.questions || 0)
								)}
							</div>
							<div class="col-md-4">
								{@render AssessmentInfoItem(
									Clock,
									'Start Time',
									dayjs(assessment.startDate).format('MMM DD[, 	] hh:m A')
								)}
							</div>
							<div class="col-md-4">
								{@render AssessmentInfoItem(
									Clock,
									'Duration',
									`${dayjs
										.duration(dayjs(assessment.endDate).diff(dayjs(assessment.startDate)))
										.as('minutes')} Minutes`
								)}
							</div>
						</div>
						<hr />
						<div class="hstack justify-content-center mb-3">
							<button
								type="button"
								class="btn btn-primary text-white hstack gap-2"
								onmousedown={() => onAssessmentStart(assessment.id)}
							>
								{#if isStartTestBtnLoading}
									<span class="spinner"><Loader2 /></span>
									<span>Starting...</span>
								{:else}
									<CirclePlay />
									<span>Start Test</span>
								{/if}
							</button>
						</div>
						<p class="mt-2 text-body-tertiary text-center">
							Test Ends On: {dayjs(assessment.endDate).format('MMMM DD[, 	] hh:m A')}
						</p>
					</div>
				</div>
			</div>
		{:else}
			<ErrorComponent
				title="All Clear: Your Assesssment-Free Day is Here!"
				description="It looks like you don't have any assessments waiting for you at the moment. Check back later for new challenges, or reach out if you think this is a mistake."
				icon="happy"
			/>
		{/if}
	{/await}
</section>

<style>
	.assessment {
		display: grid;
		width: 100%;
		place-items: center;
		background: rgb(229, 251, 249);
		background: linear-gradient(180deg, rgba(229, 251, 249, 0.25) 50%, rgba(255, 255, 255, 1) 100%);
	}

	.assessment_header {
		background-image: linear-gradient(120deg, rgba(15, 134, 128, 0.9), rgba(45, 164, 158, 0.9));
		color: var(--color-white);
	}

	.assessment-info-item {
		background-color: var(--color-neutral-100);
		border-radius: 0.8rem;
	}

	.assessment-info-item:hover {
		background-color: var(--color-neutral-200);
	}

	.assessment-info-icon {
		aspect-ratio: 1/1;
		border-radius: 50%;
		width: 3rem;
		background-color: var(--color-primary-100);
		color: var(--color-primary-600);
		display: grid;
		place-items: center;
	}

	.assessment-info-icon :global(svg) {
		width: 1.6rem;
		height: 1.6rem;
	}

	@media (min-width: 1024px) {
		.assessment__card {
			min-width: var(--container-4xl);
		}
	}
</style>
