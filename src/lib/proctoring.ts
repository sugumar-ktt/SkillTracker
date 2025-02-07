import { goto } from '$app/navigation';

export interface ProctoringGuardConfig {
	blockConsole?: boolean;
	disableRightClick?: boolean;
	disableCopyPaste?: boolean;
	blockedShortcuts?: Set<string>;
}

export class ProctoringGuard {
	private defaultShortcuts = new Set(['F12', 'I', 'J', 'C', 'F5', 'F11']);
	private blockedKeys: Set<string>;
	private config: ProctoringGuardConfig;

	constructor(config?: ProctoringGuardConfig) {
		this.config = {
			blockConsole: true,
			disableRightClick: true,
			disableCopyPaste: true,
			...config
		};
		this.blockedKeys = config?.blockedShortcuts || this.defaultShortcuts;
	}

	init() {
		const cleanupFns: (() => void)[] = [];

		// Keyboard shortcuts blocking
		const keyHandler = (e: KeyboardEvent) => {
			if (this.blockedKeys.has(e.key) || (e.ctrlKey && e.shiftKey && this.blockedKeys.has(e.key))) {
				e.preventDefault();
			}
		};
		window.addEventListener('keydown', keyHandler);
		cleanupFns.push(() => window.removeEventListener('keydown', keyHandler));

		// Console blocking
		if (this.config.blockConsole) {
			// Check if the console exists.
			if (typeof window.console !== 'undefined') {
				// Override each method that is a function.
				for (const key in window.console) {
					const keyType = key as keyof typeof window.console;
					if (typeof window.console[keyType] === 'function') {
						try {
							//@ts-ignore
							window.console[keyType] = () => {};
						} catch (error) {
							// In some browsers, some properties may be non-writable.
							// You can log this error elsewhere if needed.
						}
					}
				}
			}
		}

		// Right-click prevention
		if (this.config.disableRightClick) {
			const contextMenuHandler = (e: MouseEvent) => e.preventDefault();
			document.addEventListener('contextmenu', contextMenuHandler);
			cleanupFns.push(() => document.removeEventListener('contextmenu', contextMenuHandler));
		}

		// Copy/paste prevention
		if (this.config.disableCopyPaste) {
			const copyHandler = (e: ClipboardEvent) => {
				e.preventDefault();
				e.clipboardData?.setData('text/plain', '');
			};

			document.addEventListener('copy', copyHandler);
			document.addEventListener('cut', copyHandler);
			document.addEventListener('paste', copyHandler);

			cleanupFns.push(() => {
				document.removeEventListener('copy', copyHandler);
				document.removeEventListener('cut', copyHandler);
				document.removeEventListener('paste', copyHandler);
			});
		}

		return () => cleanupFns.forEach((fn) => fn());
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

	check(): boolean {
		return Boolean(document.fullscreenElement);
	}

	onChange(callback: (isFullscreen: boolean) => void): () => void {
		const handler = () => callback(Boolean(document.fullscreenElement));
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
