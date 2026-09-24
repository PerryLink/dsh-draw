import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // `.tsx` is included for the browser-half component specs, which render
    // their component through react-dom/server.
    include: ['tests/**/*.spec.{ts,tsx}'],
    environment: 'node',
    pool: 'forks',
  },
})
