import { config } from '@vue/test-utils'

// Ensure no global stubs are automatically applied during component tests.
// This gives tests full control over which child components should be stubbed.
config.global.stubs = {}
