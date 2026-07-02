// src/test-utils/a11y.ts
import axe from 'axe-core'
import { expect } from 'vitest'

// Accessibility assertion helper used by component tests.
// Uses axe-core to detect accessibility violations and fails the test with a readable summary.
export async function expectNoA11yViolations(element: Element): Promise<void> {
  const results = await axe.run(element, {
    rules: {
      'color-contrast': { enabled: false },
    },
  })

  if (results.violations.length > 0) {
    const messages = results.violations
      .map(
        (v) =>
          `\n  [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}` +
          `\n  Help: ${v.helpUrl}` +
          `\n  Nodes: ${v.nodes.map((n) => n.target.join(', ')).join(' | ')}`,
      )
      .join('\n')

    expect.fail(`${results.violations.length} accessibility violation(s) found:${messages}`)
  }

  expect(results.violations).toHaveLength(0)
}