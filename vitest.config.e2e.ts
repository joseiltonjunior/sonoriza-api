import { resolve } from 'path'
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfigPath from 'vite-tsconfig-paths'

const coverageExclude = ['**/infra/http/swagger/**', '**/*.dto.ts']

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
    coverage: {
      exclude: coverageExclude,
    },
  },
  plugins: [
    tsConfigPath(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
