import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

export interface PersistedStoreOptions<T> {
	/**
	 * Which Storage implementation to use. Defaults to `localStorage`.
	 */
	storage?: Storage;
	/**
	 * Function to convert the value to a string.
	 * Override this to add encryption or other serialization.
	 */
	serialize?: (value: T) => string;
	/**
	 * Function to convert the string back into the value.
	 * Override this to add decryption or other deserialization.
	 */
	deserialize?: (value: string) => T;
}

/**
 * Creates a Svelte store that persists its state in the browser’s storage.
 */
export function persistedStore<T>(
	key: string,
	initialValue: T,
	options?: PersistedStoreOptions<T>
): Writable<T> {
	if (!browser) {
		return writable<T>(initialValue);
	}
	const storage = options?.storage ?? localStorage;
	const serialize = options?.serialize ?? JSON.stringify;
	const deserialize = options?.deserialize ?? JSON.parse;

	// Attempt to retrieve the stored value. If it fails, fall back to the initial value.
	let storedValue: T;
	try {
		const raw = storage.getItem(key);
		if (raw !== null) {
			storedValue = deserialize(raw);
		} else {
			storedValue = initialValue;
		}
	} catch (error) {
		console.error(`Error reading persisted store for key "${key}":`, error);
		storedValue = initialValue;
	}

	// Create the writable store with the retrieved or initial value.
	const store = writable<T>(storedValue, (set) => {
		// Listen for changes in other tabs or windows.
		const updateFromStorage = (event: StorageEvent) => {
			if (event.key === key) {
				try {
					if (event.newValue === null) {
						set(initialValue);
					} else {
						set(deserialize(event.newValue));
					}
				} catch (error) {
					console.error(`Error deserializing data for key "${key}"`, error);
				}
			}
		};

		window.addEventListener('storage', updateFromStorage);
		return () => window.removeEventListener('storage', updateFromStorage);
	});

	// Subscribe to store changes and persist them to storage.
	store.subscribe((value) => {
		try {
			storage.setItem(key, serialize(value));
		} catch (error) {
			console.error(`Error serializing data for key "${key}":`, error);
		}
	});

	return store;
}
