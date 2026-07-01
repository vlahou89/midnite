import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-utils/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/storybook-static/**',
      '**/*.stories.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/main.ts',
        'src/types/**',
        'src/**/*.stories.*',
        'src/test-utils/**',
        'storybook-static/**',
      ],
      reporter: ['text', 'html'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
})