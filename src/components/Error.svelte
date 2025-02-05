<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	type Props = {
		title: string;
		description: string;
		icon?: 'happy' | 'sad';
	};

	let { description, title, icon = 'sad' }: Props = $props();
</script>

{#snippet HappyFace()}
	<svg viewBox="0 0 200 200" class="h-full w-full">
		<circle cx="100" cy="100" r="80" fill="#ccfbf1" />
		<path
			d="M65,90 A1,1 0 0,0 65,110 A1,1 0 0,0 65,90"
			fill="none"
			stroke="var(--color-primary)"
			stroke-width="8"
		/>
		<path
			d="M135,90 A1,1 0 0,1 135,110 A1,1 0 0,1 135,90"
			fill="none"
			stroke="var(--color-primary)"
			stroke-width="8"
		/>
		<path
			d="M65,145 Q100,170 135,145"
			fill="none"
			stroke="var(--color-primary)"
			stroke-width="8"
			stroke-linecap="round"
		/>
	</svg>
{/snippet}

{#snippet SadFace()}
	<svg viewBox="0 0 200 200" class="h-full w-full">
		<circle cx="100" cy="100" r="80" fill="#ccfbf1" />
		<path
			d="M65,90 A1,1 0 0,0 65,110 A1,1 0 0,0 65,90"
			fill="none"
			stroke="var(--color-primary)"
			stroke-width="8"
		/>
		<path
			d="M135,90 A1,1 0 0,1 135,110 A1,1 0 0,1 135,90"
			fill="none"
			stroke="var(--color-primary)"
			stroke-width="8"
		/>
		<path
			d="M65,155 Q100,130 135,155"
			fill="none"
			stroke="var(--color-primary)"
			stroke-width="8"
			stroke-linecap="round"
		/>
	</svg>
{/snippet}

<div class="error min-vh-100 vstack align-items-center justify-content-center p-3 text-center">
	<div class="error__container">
		<div class="error__illustration">
			{#if icon == 'happy'}
				{@render HappyFace()}
			{:else if icon == 'sad'}
				{@render SadFace()}
			{/if}
		</div>
		<h1 class="fs-1 mb-3">{title}</h1>
		<p class="mb-4">
			{description}
		</p>
		<a href="/" class="btn btn-primary hstack justify-content-center gap-2 text-bg-primary">
			<ArrowLeft width="4" height="4" />
			<span>Return to Home</span>
		</a>
	</div>
</div>

<style>
	.error {
		height: 100vh;
		overflow: hidden;
		background: rgb(229, 251, 249);
		background: linear-gradient(180deg, rgba(229, 251, 249, 0.25) 50%, rgba(255, 255, 255, 1) 100%);
	}

	.error__container {
		max-width: var(--container-md);
		width: 100%;
	}

	.error__illustration {
		width: 256px;
		height: 256px;
		margin: 0 auto;
	}
</style>
