import axe from 'axe-core'
import { expect } from 'vitest'

export async function expectNoA11yViolations(element: Element) {
  const results = await axe.run(element)

  if (results.violations.length > 0) {
    const messages = results.violations
      .map((v) => `[${v.impact}] ${v.description}\n    Nodes: ${v.nodes.map((n) => n.target.join(', ')).join(' | ')}`)
      .join('\n')

    expect.fail(`Accessibility violations found:\n${messages}`)
  }

  expect(results.violations).toHaveLength(0)
}