import { createPinia, setActivePinia } from 'pinia'
import '../src/assets/main.css'

const preview: Preview = {
  parameters: {
    // Match the app's dark carbon background
    backgrounds: {
      default: 'carbon',
      values: [
        { name: 'carbon', value: '#161718' },
        { name: 'carbon-800', value: '#1D1F20' },
        { name: 'light', value: '#ffffff' },
      ],
    },

    actions: { argTypesRegex: '^on[A-Z].*' },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },

  // Fresh Pinia instance per story — prevents state leaking between stories
  decorators: [
    () => ({
      setup() {
        setActivePinia(createPinia())
      },
      template: '<story />',
    }),
  ],
}

export default preview
