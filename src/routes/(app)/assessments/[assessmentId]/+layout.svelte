<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import constants from '$src/lib/constants';
	import { fetchExtended } from '$src/lib/utils';
	import { ValidationError } from '$src/lib/utils/error';
	import type { APIResponse, AssessmentAttemptDetail, ResultType } from '$src/types';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import { AlertTriangle, Clock, CodeXml, Loader2, Menu } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { Spring } from 'svelte/motion';
	import { SvelteDate } from 'svelte/reactivity';
	import type { LayoutProps } from './$types';
	import ProgressBar from './ProgressBar.svelte';
	import QuestionNavigation from './QuestionNavigation.svelte';

	dayjs.extend(duration);
	const AUTO_SUBMIT_THRESHOLD = 1000 * 60;

	let { children, data }: LayoutProps = $props();

	let assesmentAttempt = $derived(data.assessmentAttempt.data);
	let assestmentEndTime = $derived(dayjs(assesmentAttempt.Assessment.endDate).valueOf());
	let progress = $derived.by(() => {
		const attemptDetails = assesmentAttempt.AssessmentAttemptDetails || [];
		const attempted = attemptDetails.filter((a) => a.isAttempted).length;
		return Math.round((attempted / attemptDetails.length) * 100);
	});
	let currentAttemptDetail: AssessmentAttemptDetail | undefined = $state();
	let systemTime = new SvelteDate();
	let testDuration = $state(0);
	let assessmentExpiresIn = $derived(assestmentEndTime - systemTime.valueOf());

	let isRightSidebarOpen = $state(true);
	let isSubmissionLoading = $state(false);
	let isAutoSubmitNotificationShown = $state(false);

	const sidebarWidth = new Spring(18, {
		stiffness: 0.125,
		damping: 0.6
	});

	function toggleSidebar() {
		isRightSidebarOpen = !isRightSidebarOpen;
		sidebarWidth.target = isRightSidebarOpen ? 18 : 0;
	}

	async function completeAssesment() {
		try {
			isSubmissionLoading = true;
			const payload = {
				completionTime: dayjs().toISOString(),
				attemptId: assesmentAttempt.id
			};

			const { error, result } = await fetchExtended<APIResponse<boolean>>(
				fetch,
				`${constants.API_URL}/api/assessments/${assesmentAttempt.AssessmentId}/complete`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(payload)
				}
			);

			if (error) {
				throw new Error('Network error while completion assessment');
			}

			if (!result.success) {
				throw new ValidationError(result.error);
			}

			toast.success('Assessment submitted successfully');

			await goto(`/assessments/result/${assesmentAttempt.id}`);
		} catch (error) {
			console.log(error);
			if (error instanceof ValidationError) {
				toast.error(error.message);
			} else {
				toast.error('Unable to complete assesment. Try again or reach out support');
			}
		} finally {
			isSubmissionLoading = false;
			isAutoSubmitNotificationShown = false;
		}
	}

	$effect(() => {
		const intervalId = setInterval(() => {
			systemTime.setTime(Date.now());
			testDuration = dayjs().diff(dayjs(assesmentAttempt.startTime), 'minutes');
		}, 1000);
		return () => {
			clearInterval(intervalId);
		};
	});

	$effect(() => {
		const intervalId = setInterval(() => {
			const currentTime = Date.now();
			const expiryWindow = assestmentEndTime - currentTime;
			if (expiryWindow <= AUTO_SUBMIT_THRESHOLD) {
				isAutoSubmitNotificationShown = true;
				setTimeout(completeAssesment, expiryWindow);
				clearInterval(intervalId);
			}
		}, 1000);
		return () => {
			clearInterval(intervalId);
		};
	});

	onMount(() => {
		if (!data.assessmentAttempt.success) {
			toast.error('Error while retrieving test progress. Please try again later');
		}
	});

	afterNavigate(() => {
		const attemptDetail = page.data.attemptDetail as
			| Promise<ResultType<APIResponse<AssessmentAttemptDetail>>>
			| undefined;

		if (attemptDetail) {
			attemptDetail.then(({ result }) => {
				if (result?.data) {
					currentAttemptDetail = result.data;
				}
			});
		}
	});
</script>

{#snippet AutosubmitNotification()}
	<div class="auto-submit-notification">
		<div class="card">
			<div class="card-body">
				<header class="hstack gap-2 mb-2 align-items-center">
					<div class="alert-icon-wrapper">
						<AlertTriangle size="24" />
					</div>
					<span class="fs-4 auto-submit-notification__title">Warning</span>
				</header>
				<span class="auto-submit-notification__content">
					Your assessment will be auto-submitted in {dayjs
						.duration(assessmentExpiresIn, 'milliseconds')
						.format('mm:ss')}
				</span>
			</div>
		</div>
	</div>
{/snippet}

<Toaster />
{#if isAutoSubmitNotificationShown}
	<AutosubmitNotification />
{/if}
<div class="layout">
	<nav class="nav card m-3">
		<div class="card-body hstack w-100 h-100 py-3">
			<div class="nav-container hstack w-100 justify-content-center">
				<div class="row w-100 gy-4">
					<div class="col-lg-4">
						<div class="hstack gap-3">
							<span class="info-icon">
								<CodeXml />
							</span>
							<div class="vstack">
								<span class="text-body-secondary">
									{dayjs(systemTime.valueOf()).format('MMM DD, hh:mm:ss A')}
								</span>
								<span class="text-body-emphasis fw-medium"
									>{assesmentAttempt?.Assessment?.name || 'Loading...'}</span
								>
							</div>
						</div>
					</div>
					<div class="col-lg">
						<div class="hstack gap-3">
							<span class="info-icon">
								<Clock />
							</span>
							<div class="vstack">
								<span class="text-body-secondary">Duration</span>
								<span class="text-body-emphasis fw-medium">{testDuration} Minutes</span>
							</div>
						</div>
					</div>
					<div class="col-lg-5">
						<div class="hstack gap-5 h-100 w-100 justify-content-end">
							<ProgressBar label="Progress" {progress} />
							<button
								type="button"
								class="btn btn-primary text-white hstack gap-2"
								style="align-self: center;"
								onmousedown={completeAssesment}
							>
								{#if isSubmissionLoading}
									<span class="spinner"><Loader2 /></span>
									<span>Loading...</span>
								{:else}
									<span>Finish Assessment</span>
								{/if}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>

	<main class="main card mx-3 mb-3">
		<div class="card-body">
			{@render children()}
		</div>
	</main>

	<aside class="sidebar me-1 mb-3" style="width: {sidebarWidth.current}rem">
		<QuestionNavigation
			attemptDetails={assesmentAttempt.AssessmentAttemptDetails || []}
			{currentAttemptDetail}
			isDisabled={isSubmissionLoading}
		/>
	</aside>

	<nav class="right-menu">
		<button
			type="button"
			class="sidebar-toggle"
			class:active={isRightSidebarOpen}
			aria-label={isRightSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
			onmousedown={toggleSidebar}
		>
			<Menu size={20} />
		</button>
	</nav>
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: 1fr auto auto;
		grid-template-areas:
			'nav nav right-menu'
			'main sidebar right-menu';
		grid-template-rows: 0.1fr 1fr;
		min-width: 100vw;
		overflow: hidden;
		height: 100vh;
	}

	.nav {
		grid-area: nav;
		width: auto;
	}

	.main {
		grid-area: main;
		overflow-y: auto;
		min-height: 100%;
	}

	.sidebar {
		grid-area: sidebar;
		overflow-x: hidden;
		overflow-y: auto;
		background: var(--bg-sidebar, white);
	}

	.right-menu {
		grid-area: right-menu;
		background-color: var(--color-neutral-50);
	}

	.sidebar-toggle {
		grid-area: toggle;
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: transparent;
		color: var(--color-primary-700);
		cursor: pointer;
		margin: 1rem 0.8rem;
		transition: background-color 0.2s;
	}

	.sidebar-toggle :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.sidebar-toggle:hover,
	.sidebar-toggle.active {
		background-color: var(--color-primary-100);
	}

	.sidebar-toggle:focus-visible {
		outline: none;
		box-shadow: 0 0 0 0.25rem var(--color-primary-100);
	}

	.info-icon {
		display: grid;
		place-items: center;
		aspect-ratio: 1/1;
		border-radius: 0.6rem;
		padding: 0.5rem;
		width: fit-content;
		background-color: var(--color-primary-100);
		color: var(--color-primary-600);
	}

	.alert-icon-wrapper {
		display: grid;
		place-items: center;
		aspect-ratio: 1/1;
		width: fit-content;
		background-color: var(--color-warning-100);
		color: var(--color-warning-500);
		padding: 0.8rem;
		border-radius: 50%;
	}

	.auto-submit-notification {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		z-index: 100;
	}

	.auto-submit-notification__title {
		color: var(--color-warning-500);
	}

	.auto-submit-notification__content {
		color: var(--color-warning-500);
	}

	.auto-submit-notification .card {
		border: 1px solid var(--color-warning-200);
		background-color: var(--color-warning-10);
	}
</style>
