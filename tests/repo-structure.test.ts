import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const requiredFiles = [
  'package.json',
  'pnpm-workspace.yaml',
  'tsconfig.base.json',
  'README.md',
  'AGENTS.md',
  'CONTRIBUTING.md',
  'docs/policies/content-provenance.md',
  'docs/policies/editorial-review.md',
]

describe('repository structure', () => {
  it('contains the launch-foundation bootstrap files', () => {
    for (const file of requiredFiles) {
      expect(existsSync(file)).toBe(true)
    }
  })
})
