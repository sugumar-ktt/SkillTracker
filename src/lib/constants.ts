import { PUBLIC_API_URL } from '$env/static/public';

export default {
	API_URL: PUBLIC_API_URL
};

export enum ProctoringEvents {
	FullScreenEnter = 'fullscreen-enter',
	FullScreenExit = 'fullscreen-exit',
	VisibilityEnter = 'visibility-enter',
	VisibilityExit = 'visibility-exit'
}
