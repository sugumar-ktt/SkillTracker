import { goto } from '$app/navigation';

export interface DevToolsBlockerConfig {
	blockConsole?: boolean;
	blockedShortcuts?: Set<string>;
}

export class DevToolsBlocker {
	private defaultShortcuts = new Set(['F12', 'I', 'J', 'C']);
	private blockedKeys: Set<string>;
	private blockConsole: boolean;

	constructor(config?: DevToolsBlockerConfig) {
		this.blockedKeys = config?.blockedShortcuts || this.defaultShortcuts;
		this.blockConsole = config?.blockConsole ?? true;
	}

	init() {
		const keyHandler = (e: KeyboardEvent) => {
			if (this.blockedKeys.has(e.key) || (e.ctrlKey && e.shiftKey && this.blockedKeys.has(e.key))) {
				e.preventDefault();
			}
		};

		window.addEventListener('keydown', keyHandler);

		if (this.blockConsole) {
			Object.defineProperty(window, 'console', {
				value: Object.create(null),
				writable: false
			});
		}

		return () => window.removeEventListener('keydown', keyHandler);
	}
}

type OrientationLockType =
	| 'any'
	| 'natural'
	| 'landscape'
	| 'portrait'
	| 'portrait-primary'
	| 'portrait-secondary'
	| 'landscape-primary'
	| 'landscape-secondary';

interface FullscreenOptions {
	lockOrientation?: boolean;
	orientation?: OrientationLockType;
}

export class FullscreenManager {
	private orientationLock: boolean;
	private orientationType: OrientationLockType;

	private screenOrientation?: ScreenOrientation & {
		lock: (orientation: OrientationLockType) => void;
	};

	constructor(options?: FullscreenOptions) {
		this.orientationLock = options?.lockOrientation ?? true;
		this.orientationType = options?.orientation ?? 'portrait';

		// Safe reference for TypeScript
		this.screenOrientation = { ...screen.orientation, lock(orientation) {} };
	}

	async enable(): Promise<boolean> {
		try {
			await document.documentElement.requestFullscreen({ navigationUI: 'hide' });

			if (this.orientationLock && this.screenOrientation?.lock) {
				try {
					this.screenOrientation.lock(this.orientationType);
				} catch (lockError) {
					console.warn('Orientation lock failed:', lockError);
				}
			}

			return true;
		} catch (error) {
			console.error('Fullscreen failed:', error);
			return false;
		}
	}

	async disable(): Promise<void> {
		try {
			await document.exitFullscreen();
			if (this.screenOrientation?.unlock) {
				this.screenOrientation.unlock();
			}
		} catch (error) {
			console.error('Fullscreen exit failed:', error);
		}
	}

	onChange(callback: (isFullscreen: boolean) => void): () => void {
		const handler = () => callback(!!document.fullscreenElement);
		document.addEventListener('fullscreenchange', handler);
		return () => document.removeEventListener('fullscreenchange', handler);
	}
}

type NavigationGuardCallback = (reason: 'visibility' | 'unload') => void;

export class NavigationGuard {
	private callback?: NavigationGuardCallback;
	private redirectUrl: string;

	constructor(redirectUrl: string = '/assessment-failed') {
		this.redirectUrl = redirectUrl;
	}

	start(callback?: NavigationGuardCallback) {
		this.callback = callback;

		const beforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			this.callback?.('unload');
		};

		const visibilityChange = () => {
			if (document.visibilityState === 'hidden') {
				this.callback?.('visibility');
				goto(this.redirectUrl);
			}
		};

		window.addEventListener('beforeunload', beforeUnload);
		document.addEventListener('visibilitychange', visibilityChange);

		return () => {
			window.removeEventListener('beforeunload', beforeUnload);
			document.removeEventListener('visibilitychange', visibilityChange);
		};
	}
}

export class AssessmentProctor {
	private devToolsBlocker: DevToolsBlocker;
	private fullscreenManager: FullscreenManager;
	private navigationGuard: NavigationGuard;

	constructor(config?: {
		devTools?: DevToolsBlockerConfig;
		fullscreen?: FullscreenOptions;
		redirectUrl?: string;
	}) {
		this.devToolsBlocker = new DevToolsBlocker(config?.devTools);
		this.fullscreenManager = new FullscreenManager(config?.fullscreen);
		this.navigationGuard = new NavigationGuard(config?.redirectUrl);
	}

	async startAssessment() {
		const cleanup = [this.devToolsBlocker.init(), this.navigationGuard.start()];

		const success = await this.fullscreenManager.enable();
		if (!success) throw new Error('Fullscreen failed');

		return () => cleanup.forEach((fn) => fn());
	}
}
