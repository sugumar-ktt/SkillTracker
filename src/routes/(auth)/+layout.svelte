<script lang="ts">
	import ktmHorizontalLogo from '$assets/images/ktm-horizontal-logo.svg';
	import kttHorizontalLogo from '$assets/images/ktt-horizontal-logo.png';
	import slide1Bg from '$assets/images/showcase/s-1-bg.png';
	import slide1Content from '$assets/images/showcase/s-1-content.png';
	import slide2Bg from '$assets/images/showcase/s-2-bg.png';
	import slide2Content from '$assets/images/showcase/s-2-content.png';
	import slide4Bg from '$assets/images/showcase/s-4-bg.png';
	import slide4Content from '$assets/images/showcase/s-4-content.png';
	import slide5Content from '$assets/images/showcase/s-5-content.png';
	import slide6Content from '$assets/images/showcase/s-6-content.png';
	import slide7Content from '$assets/images/showcase/s-7-content.png';
	import { Carousel } from 'bootstrap';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { LayoutProps } from '../$types';

	const slides = [
		{
			background: slide4Bg,
			content: slide4Content,
			isActive: true
		},
		{
			background: slide1Bg,
			content: slide1Content
		},
		{
			background: slide2Bg,
			content: slide2Content
		},
		{
			background: slide4Bg,
			content: slide5Content
		},
		{
			background: slide4Bg,
			content: slide6Content
		},
		{
			background: slide4Bg,
			content: slide7Content
		}
	];

	let { children }: LayoutProps = $props();

	let carouselRef = $state<HTMLDivElement>();

	onMount(() => {
		if (!carouselRef) return;
		const instance = new Carousel(carouselRef, {
			ride: 'carousel',
			interval: 4000
		});

		return () => {
			if (carouselRef) {
				instance.dispose();
			}
		};
	});
</script>

<div class="layout">
	<div class="container-fluid h-100">
		<div class="row h-100">
			<section class="showcase-section col-sm-6 d-none d-md-flex">
				<div class="showcase-container">
					<div
						class="showcase-carousel carousel slide h-100"
						id="showcaseCarousel"
						bind:this={carouselRef}
					>
						<div class="carousel-indicators">
							{#each slides as slide, index}
								<button
									type="button"
									data-bs-target="#showcaseCarousel"
									data-bs-slide-to={index}
									class:active={slide.isActive}
									aria-current={slide.isActive}
									aria-label="Slide {index + 1}"
								></button>
							{/each}
						</div>
						<div class="carousel-inner">
							{#each slides as slide, index}
								<div
									class="carousel-item"
									class:active={slide.isActive}
									style="background:  no-repeat center/contain url({slide.background});"
								>
									<img
										src={slide.content}
										alt="Showcasing various KTT products"
										class="d-block w-100"
									/>
								</div>
							{/each}
						</div>
						<button
							class="carousel-control-prev"
							type="button"
							data-bs-target="#showcaseCarousel"
							data-bs-slide="prev"
						>
							<ChevronLeft style="color: var(--color-neutral-700)" size="48" absoluteStrokeWidth />
							<span class="visually-hidden">Previous</span>
						</button>
						<button
							class="carousel-control-next"
							type="button"
							data-bs-target="#showcaseCarousel"
							data-bs-slide="next"
						>
							<ChevronRight style="color: var(--color-neutral-700)" size="48" absoluteStrokeWidth />
							<span class="visually-hidden">Next</span>
						</button>
					</div>
				</div>
			</section>
			<section class="right-section col h-100">
				<div class="content-wrapper vstack mx-auto position-relative">
					<div class="row gx-5 gy-3 mb-4">
						<div class="col">
							<img
								src={kttHorizontalLogo}
								alt="Brand logo"
								class="content-brand content-brand--left"
							/>
						</div>
						<div class="col">
							<img
								src={ktmHorizontalLogo}
								alt="Brand logo"
								class="content-brand content-brand--right"
							/>
						</div>
					</div>

					<div class="vstack flex-grow-1 overflow-y-auto p-2 content-container">
						{@render children()}
					</div>
				</div>
			</section>
		</div>
	</div>
</div>

<style>
	.layout {
		height: 100vh;
		overflow: hidden;
		padding: 1rem;
	}

	.right-section {
		overflow-y: auto;
	}

	.showcase-section {
		background-color: var(--color-neutral-200);
	}

	.showcase-container {
		display: grid;
		height: 100%;
		width: 100%;
	}

	.showcase-carousel {
		display: grid;
		place-items: center;
		place-content: center;
	}

	.showcase-carousel img {
		min-height: 75vh;
		object-fit: contain;
	}

	.content-wrapper {
		height: 100%;
	}

	.content-brand {
		aspect-ratio: 2/0.58;
		object-fit: contain;
		width: 100%;
	}

	.content-container {
		scrollbar-width: thin;
	}

	.content-brand--left {
		margin-left: -1rem;
	}

	.content-brand--right {
		margin-right: -1rem;
	}

	.carousel-indicators button {
		background-color: var(--color-neutral-700);
	}

	.carousel-indicators button.active {
		background-color: var(--color-neutral-900);
	}

	@media screen and (min-width: 640px) {
		.layout {
			padding: 0;
		}

		.content-wrapper {
			max-width: var(--container-xl);
		}

		.right-section {
			padding: 1rem;
		}
	}
</style>
