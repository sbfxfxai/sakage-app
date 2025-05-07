import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
    },
    server: {
        port: 5176,
        allowedHosts: [
            'localhost',
            '.ngrok-free.app',
            'bf70-100-18-17-166.ngrok-free.app'
        ],
    },
});