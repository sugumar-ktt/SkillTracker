<script lang="ts">
	import { afterNavigate, beforeNavigate, invalidate } from '$app/navigation';
	import Codeblock from '$src/components/Codeblock.svelte';
	import constants from '$src/lib/constants';
	import { PrismLanguage } from '$src/lib/prism';
	import { fetchExtended } from '$src/lib/utils';
	import { ValidationError } from '$src/lib/utils/error';
	import type {
		APIResponse,
		AssessmentAttempt,
		AssessmentAttemptDetail,
		Choice as ChoiceType,
		Question
	} from '$src/types';
	import { waveform } from 'ldrs';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { crossfade } from 'svelte/transition';
	import type { PageProps } from './$types';
	import Choice from './Choice.svelte';
	waveform.register();

	type PageInfo = {
		questionId: number;
		index: number;
	};

	type Page = {
		current?: PageInfo;
		next?: PageInfo;
		prev?: PageInfo;
	};

	let { data }: PageProps = $props();
	const [send, receive] = crossfade({
		duration: 300,
		fallback(node) {
			return {
				duration: 150,
				css: (t) => `opacity: ${t}`
			};
		}
	});

	let isPageLoading = $state(true);
	let attemptDetail: AssessmentAttemptDetail | undefined = $state();
	let selectedChoice: ChoiceType | undefined = $state();
	let question: Question | undefined = $derived(attemptDetail?.Question);
	let attempt: AssessmentAttempt = $derived(data.assessmentAttempt.data);
	let page: Page = $derived.by(() => {
		const page: Page = {};
		const attemptDetails = attempt.AssessmentAttemptDetails;
		for (let i = 0; i < attemptDetails.length; i++) {
			const attemptDetail = attemptDetails[i];
			const isMatching = attemptDetail.QuestionId == question?.id;
			const index = i;
			if (isMatching) {
				page.current = {
					index: index,
					questionId: attemptDetail.QuestionId
				};
				page.next = {
					index: index + 1,
					questionId: attemptDetails[index + 1]?.QuestionId
				};
				page.prev = {
					index: index - 1,
					questionId: attemptDetails[index - 1]?.QuestionId
				};
				break;
			}
		}
		return page;
	});

	async function saveSelection(choice: ChoiceType | undefined) {
		try {
			if (!attemptDetail) {
				return;
			}
			const payload = { answerId: choice?.id ? choice.id : null };
			const { error, result } = await fetchExtended<APIResponse<AssessmentAttemptDetail>>(
				fetch,
				`${constants.API_URL}/api/assessments/${attempt.AssessmentId}/attempt-details/${attemptDetail?.id}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(payload)
				}
			);

			if (error) {
				throw new Error('Network error while saving submission');
			}

			if (!result.success) {
				throw new ValidationError(result.error);
			}

			await invalidate((url) => url.href.includes('attempts/active'));
		} catch (error) {
			console.log(error);
			if (error instanceof ValidationError) {
				toast.error(error.message);
			} else {
				toast.error('Unable to save changes. Please try again later');
			}
		}
	}

	function handleSelection(choice: ChoiceType) {
		if (selectedChoice?.id != choice?.id) {
			saveSelection(choice);
		}
		selectedChoice = choice;
	}

	function handleClear() {
		if (selectedChoice != undefined) {
			saveSelection(undefined);
		}
		selectedChoice = undefined;
	}

	afterNavigate(() => {
		data.attemptDetail.then(({ error, result }) => {
			if (error || !result.success) {
				toast.error('Error while retrieving submission status. Try again or reach out support');
				return;
			}
			attemptDetail = result.data;
			selectedChoice = attemptDetail.submission;
			isPageLoading = false;
		});
	});

	beforeNavigate(() => {
		isPageLoading = true;
	});
</script>

<Toaster />
<section class="question vstack justify-content-between h-100">
	<div class="question-container">
		{#if isPageLoading}
			<div class="question-view">
				<div class="hstack justify-content-center mt-5" style="min-height: 30vh;">
					<l-waveform size="48" stroke="4" speed="1" color="var(--color-primary-500)"></l-waveform>
				</div>
			</div>
		{:else}
			{#key question?.id}
				<div class="question-view" in:receive={{ key: 'question' }} out:send={{ key: 'question' }}>
					<div class="vstack">
						<header class="header hstack justify-content-between mb-2">
							<div class="fs-4 fw-medium">
								{#if page.current}
									Question {page.current?.index + 1}/{attempt.AssessmentAttemptDetails.length}
								{:else}
									Loading...
								{/if}
							</div>
							<span class="text-primary">Choose the Answer</span>
						</header>
						{#if question?.snippet?.code}
							<p class="mb-1 assessment-mode question-description">{question?.description}</p>
							<div class="mb-4">
								<Codeblock
									code={question.snippet.code}
									language={question.snippet.language as PrismLanguage}
								/>
							</div>
						{:else}
							<p class="mb-4 assessment-mode question-description">{question?.description}</p>
						{/if}
						<div class="vstack gap-3 mb-4">
							{#each question?.choices || [] as choice (choice.id)}
								<Choice
									isSelected={choice.id == selectedChoice?.id}
									questionId={1}
									value={choice.text}
									onSelection={() => handleSelection(choice)}
								/>
							{/each}
						</div>
					</div>
				</div>
			{/key}
		{/if}
	</div>

	<!-- Navigation -->
	<div class="hstack justify-content-between mb-3">
		{#if page?.prev?.questionId}
			<a class="btn btn-secondary hstack gap-1" href={`./${page.prev.questionId}`}>
				<ChevronLeft />
				<span>Previous</span>
			</a>
		{:else}
			<button type="button" class="btn btn-secondary hstack gap-1" disabled>
				<ChevronLeft />
				<span>Previous</span>
			</button>
		{/if}

		<div class="hstack gap-3">
			<button type="button" class="btn btn-secondary" onmousedown={handleClear}>
				<span>Clear</span>
			</button>

			{#if page?.next?.questionId}
				<a class="btn btn-primary text-white hstack gap-1" href={`./${page.next.questionId}`}>
					<span>Next</span>
					<ChevronRight />
				</a>
			{:else}
				<button type="button" class="btn btn-primary text-white hstack gap-1" disabled>
					<span>Next</span>
					<ChevronRight />
				</button>
			{/if}
		</div>
	</div>
</section>

<style>
	.question {
		height: 100%;
	}
	.question-container {
		position: relative;
		min-height: 60vh;
		height: 100%;
		contain: layout style; /* Prevents layout shifts */
		margin-bottom: 1rem;
	}

	.question-view {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		transition: opacity 0.2s ease; /* Fallback */
		overflow-y: auto;
	}

	.question-description {
		white-space: pre-wrap;
	}
</style>
