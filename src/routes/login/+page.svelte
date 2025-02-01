<script lang="ts">
	import kttHorizontalLogo from '$assets/images/ktt-horizontal-logo.png';
	import kttLogoSvg from '$assets/images/ktt-logo.svg';
	import slide1Bg from '$assets/images/showcase/s-1-bg.png';
	import slide1Content from '$assets/images/showcase/s-1-content.png';
	import slide2Bg from '$assets/images/showcase/s-2-bg.png';
	import slide2Content from '$assets/images/showcase/s-2-content.png';
	import slide4Bg from '$assets/images/showcase/s-4-bg.png';
	import slide4Content from '$assets/images/showcase/s-4-content.png';
	import slide5Content from '$assets/images/showcase/s-5-content.png';
	import slide6Content from '$assets/images/showcase/s-6-content.png';
	import slide7Content from '$assets/images/showcase/s-7-content.png';
	import Select2 from '$src/components/Select2.svelte';
	import { Carousel } from 'bootstrap';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { onMount } from 'svelte';

	const departments = [
		'Mechanical engineering',
		'Computer science and engineering',
		'Electronics and communication engineering'
	];

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

	let carouselRef = $state<HTMLDivElement>();

	onMount(() => {
		if (!carouselRef) return;
		const instance = new Carousel(carouselRef, {
			ride: 'carousel',
			interval: 4000
		});

		return () => {
			instance.dispose();
		};
	});
</script>

<div class="login row w-100">
	<div class="login__showcase col-sm-6 d-none d-md-flex p-4">
		<div class="login__showcase-container">
			<div
				class="login__showcase-carousel carousel slide h-100"
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
			<div class="hstack w-100 h-100 flex-column justify-content-end align-items-center">
				<img src={kttHorizontalLogo} alt="KT Telematics Logo" class="login__logo" />
			</div>
		</div>
	</div>
	<div class="login__registration col position-relative p-4">
		<div class="hstack login__registration_brand">
			<img src={kttLogoSvg} alt="KT Telematics Logo" class="w-100" />
		</div>
		<div class="hstack justify-content-center align-items-center">
			<div class="login__form-container">
				<h2>Register</h2>
				<div class="text-muted">Let us know you more</div>
				<hr />
				<div class="mb-3">
					<label class="form-label" for="firstName">First Name</label>
					<input type="text" class="form-control" name="firstName" id="firstName" required />
				</div>
				<div class="mb-3">
					<label class="form-label" for="lastName">Last Name</label>
					<input type="text" class="form-control" name="lastName" id="lastName" required />
				</div>
				<div class="mb-3">
					<label class="form-label" for="registerNumber">Register Number</label>
					<input
						type="number"
						min="0"
						class="form-control"
						name="registerNumber"
						id="registerNumber"
						required
					/>
				</div>
				<div class="mb-5">
					<label class="form-label" for="department">Department</label>
					<Select2
						className="form-select"
						placeholder="Select Department"
						options={{
							data: departments.map((d) => ({ id: d, text: d }))
						}}
						id="department"
						name="department"
						required
					></Select2>
				</div>
				<div class="mb-3">
					<button class="btn btn-primary w-100">Register</button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.login {
		height: 100vh;
		overflow: hidden;
	}

	.login__showcase {
		background-color: var(--color-neutral-200);
	}

	.login__showcase-container {
		display: grid;
		grid-template-rows: 1fr 0.1fr;
		width: 100%;
	}

	.login__logo {
		max-width: 300px;
	}

	.login__form-container {
		width: var(--container-sm);
	}

	.login__registration_brand {
		max-width: 128px;
	}

	.carousel-indicators button {
		background-color: var(--color-neutral-700);
	}

	.carousel-indicators button.active {
		background-color: var(--color-neutral-900);
	}
</style>
