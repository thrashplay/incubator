import { PackageConfig } from '.'

describe('PackageConfig', () => {
  describe('constructor', () => {
    it('sets name from package.json', () => {
      expect(new PackageConfig('/app', { name: 'expected-name' }).name).toBe('expected-name')
    })
  })
})