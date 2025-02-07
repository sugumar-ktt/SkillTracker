import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	return {
		plugins: [sveltekit()],
		server: {
			proxy: {
				'/api': {
					target: `${env['PUBLIC_API_URL']}`,
					changeOrigin: true
				}
			}
		}
	};
});
