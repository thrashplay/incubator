import { baseStack, configsWithNoFile, validConfigs } from '../__fixtures__'

import { ConfigEntry, VersionedConfigEntry } from './helpers'

import { getConfigVersionVariables } from './index'

describe('getConfigVersionVariables', () => {
  const stack = {
    ...baseStack,
    configs: {
      test_config: {
        file: 'any-value',
        name: 'test_config_name',
      },
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('contains correct entries', () => {
    it('returns empty set, when stack definition is empty', () => {
      const result = getConfigVersionVariables({})
      expect(result.invalidConfigs).toHaveLength(0)
      expect(result.variables).toHaveLength(0)
    })

    it('returns empty set, when stack has no "file" top-level configs', () => {
      const inputStack = {
        ...baseStack,
        configs: {
          ...configsWithNoFile,
        },
      }

      const result = getConfigVersionVariables(inputStack)
      expect(result.invalidConfigs).toHaveLength(0)
      expect(result.variables).toHaveLength(0)
    })

    it('adds an entry for all "file" top-level configs to result set', () => {
      const inputStack = {
        ...baseStack,
        configs: {
          ...configsWithNoFile,
          ...validConfigs,
        },
      }

      const result = getConfigVersionVariables(inputStack)
      expect(result.invalidConfigs).toHaveLength(0)
      expect(result.variables).toHaveLength(2)
    })
  })

  describe('variable names', () => {
    it.each([
      ['', '_VERSION'],
      ['test', 'TEST_VERSION'],
      ['camelCase', 'CAMEL_CASE_VERSION'],
      ['kebab-case', 'KEBAB_CASE_VERSION'],
      ['snake_case', 'SNAKE_CASE_VERSION'],
    ])('uses correct default, when `getVariableName` NOT set: %s', (input, expectedResult) => {
      const inputStack = {
        ...baseStack,
        configs: {
          [input]: {
            file: 'any-value',
            name: 'test_config_name',
          },
        },
      }

      const result = getConfigVersionVariables(inputStack)
      expect(result.invalidConfigs).toHaveLength(0)
      expect(result.variables).toHaveLength(1)
      expect(result.variables[0]).toMatchObject({
        name: expectedResult,
      })
    })


    it('uses `getVariableName` result, when specified', () => {
      const mockGetVariableName = jest.fn((config: VersionedConfigEntry) => `expected name for: ${config.id}`)

      const result = getConfigVersionVariables(stack, { getVariableName: mockGetVariableName })
      expect(result.invalidConfigs).toHaveLength(0)
      expect(result.variables).toHaveLength(1)
      expect(result.variables[0]).toMatchObject({
        name: 'expected name for: test_config',
      })
    })
  })
  
  describe('version calculation', () => {
    const mockGetContent = jest.fn((config: ConfigEntry) => `${config.id}'s test content`)

    it('uses correct default, when `getVersion` NOT set', () => {
      const result = getConfigVersionVariables(stack, { getConfigContent: mockGetContent })
      expect(result.invalidConfigs).toHaveLength(0)
      expect(result.variables).toHaveLength(1)
      expect(result.variables[0]).toMatchObject({
        version: 'c93cb9c8',
      })
    })

    it('uses `getVersion` result, when specified', () => {
      const mockGetVersion = jest.fn((content: string, config: ConfigEntry) => `expected version for: ${content} (${config.id})`)

      const result = getConfigVersionVariables(stack, {
        getConfigContent: mockGetContent,
        getVersion: mockGetVersion,
      })

      expect(result.invalidConfigs).toHaveLength(0)
      expect(result.variables).toHaveLength(1)
      expect(result.variables[0]).toMatchObject({
        version: 'expected version for: test_config\'s test content (test_config)',
      })
    })
  })

  describe('invalid configs', () => {
    it('when `getConfigContent` throws an exception', () => {
      const mockGetConfigContent = jest.fn(() => { throw new Error('test exception should be caught') })

      const result = getConfigVersionVariables(stack, { getConfigContent: mockGetConfigContent })
      expect(result.variables).toHaveLength(0)
      expect(result.invalidConfigs).toHaveLength(1)
      expect(result.invalidConfigs[0]).toMatchObject({
        error: new Error('test exception should be caught'),
        id: 'test_config',
        name: 'test_config_name',
        path: 'any-value',
      })
    })

    it('when `getVersion` throws an exception', () => {
      const mockGetVersion = jest.fn(() => { throw new Error('test exception should be caught') })

      const result = getConfigVersionVariables(stack, { getVersion: mockGetVersion })
      expect(result.variables).toHaveLength(0)
      expect(result.invalidConfigs).toHaveLength(1)
      expect(result.invalidConfigs[0]).toMatchObject({
        error: new Error('test exception should be caught'),
        id: 'test_config',
        name: 'test_config_name',
        path: 'any-value',
      })
    })
  })
})