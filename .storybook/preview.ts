import { createPinia, setActivePinia } from 'pinia'
import '../src/assets/main.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'carbon',
      values: [
        { name: 'carbon', value: '#161718' },
        { name: 'carbon-800', value: '#1D1F20' },
        { name: 'light', value: '#ffffff' },
      ],
    },

    a11y: {
      context: '#storybook-root',
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true },
          { id: 'aria-valid-attr', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'image-alt', enabled: true },
          { id: 'label', enabled: true },
        ],
      },
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
        },
      },
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
  hideNoControlsWarning: true,
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