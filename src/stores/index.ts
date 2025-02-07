import { persistedStore } from '$src/lib/utils/persisted-store';

type SessionStorePayload = {
	sessionToken: string;
};
export const sessionStore = persistedStore<SessionStorePayload>('Session', { sessionToken: '' });
