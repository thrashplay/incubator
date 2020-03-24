import {
  addContent,
  calculateVersion,
  createResult,
  getFileConfigsFromStack,
  StackDefinition,
  VersionedConfigEntry,
} from './helpers'
import { baseStack, configsWithNoFile, validConfigs } from './__fixtures__'

describe('config-version-helper helper functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getFileConfigsFromStack', () => {
    it.each<[string, StackDefinition]>([
      ['is empty', {}],
      ['has no configs', baseStack],
    ])('returns empty set when stack %s', (_description, stack) => {
      expect(getFileConfigsFromStack(stack)).toStrictEqual([])
    })

    it('includes file configs', () => {
      const stack = {
        ...baseStack,
        configs: {
          ...validConfigs,
        },
      }

      const configs = getFileConfigsFromStack(stack)
      expect(configs).toHaveLength(2)
      expect(configs[0]).toEqual({
        id: 'test_config1',
        name: 'test_config1_name',
        path: 'test_config1_file',
      })
      expect(configs[1]).toEqual({
        id: 'test_config2',
        name: 'test_config2_name',
        path: 'test_config2_file',
      })
    })

    it('does not include configs with no file', () => {
      const stack = {
        ...baseStack,
        configs: {
          ...validConfigs,
          ...configsWithNoFile,
        },
      } 

      const configs = getFileConfigsFromStack(stack)
      expect(configs).not.toContainEqual({
        id: 'no_file_config1',
      })
      expect(configs).not.toContainEqual({
        id: 'no_file_config2',
      })
      expect(configs).not.toContainEqual({
        id: 'external_config',
      })
    })
  })

  describe('addContent', () => {
    const mockReadContent = jest.fn()

    const configEntry = {
      id: 'test_config',
      name: 'test_name',
      path: 'test_path',
    }

    it('passes ConfigEntry to readContent function', () => {
      mockReadContent.mockReturnValue('expected content')

      addContent(mockReadContent)(configEntry)
      expect(mockReadContent).toHaveBeenCalledWith(configEntry)
    })

    it('returns ConfigEntryWithError if readContent returns error', () => {
      mockReadContent.mockImplementation(() => { throw new Error('should have caught expected error in test') })
      const result = addContent(mockReadContent)(configEntry)
      expect(result).toEqual({
        id: 'test_config',
        error: new Error('should have caught expected error in test'),
        name: 'test_name',
        path: 'test_path',
      })
    })

    it('returns ConfigEntryWithContent if readContent returns data', () => {
      mockReadContent.mockReturnValue('expected content')

      const result = addContent(mockReadContent)(configEntry)
      expect(result).toEqual({
        content: 'expected content',
        id: 'test_config',
        name: 'test_name',
        path: 'test_path',
      })
    })
  })

  describe('calculateVersion', () => {
    const mockGetVersion = jest.fn()

    const configEntry = {
      content: 'expected content',
      id: 'test_config',
      name: 'test_name',
      path: 'test_path',
    }

    it('passes correct params to getVersion function', () => {
      mockGetVersion.mockReturnValue('expected version')

      calculateVersion(mockGetVersion)(configEntry)
      expect(mockGetVersion).toHaveBeenCalledWith(
        'expected content',
        expect.objectContaining({
          id: 'test_config',
          name: 'test_name',
          path: 'test_path',
        }),
      )
    })

    it('returns ConfigEntryWithError if getVersion throws exception', () => {
      mockGetVersion.mockImplementation(() => { throw new Error('should have caught expected error in test') })

      const result = calculateVersion(mockGetVersion)(configEntry)
      expect(result).toMatchObject({
        id: 'test_config',
        error: new Error('should have caught expected error in test'),
        name: 'test_name',
        path: 'test_path',
      })
    })

    it('returns VersionedConfigEntry if getVersion returns data', () => {
      mockGetVersion.mockReturnValue('expected version')

      const result = calculateVersion(mockGetVersion)(configEntry)
      expect(result).toMatchObject({
        id: 'test_config',
        name: 'test_name',
        path: 'test_path',
        version: 'expected version',
      })
    })
  })

  describe('createResult', () => {
    const mockGetVersion = jest.fn((configEntry: VersionedConfigEntry) => `${configEntry.id}_version`)

    const configInformation = [
      {
        id: 'config1',
        name: 'config1_name',
        path: 'config1_path',
        version: '12345',
      },
      {
        id: 'config2',
        path: 'config2_path',
        error: new Error('should not throw error from test'),
      },
      {
        id: 'config3',
        path: 'config3_path',
        version: 'abcde1',
      },
    ]

    it('returns empty result when input list is empty', () => {
      const result = createResult(mockGetVersion)([])
      expect(result.variables).toHaveLength(0)
      expect(result.invalidConfigs).toHaveLength(0)
    })

    it('passes correct parameter to VariableNameCreator', () => {
      createResult(mockGetVersion)(configInformation)
      expect(mockGetVersion).toHaveBeenCalledTimes(2)
      expect(mockGetVersion.mock.calls[0][0]).toEqual(configInformation[0])
      expect(mockGetVersion.mock.calls[1][0]).toEqual(configInformation[2])
    })

    it('returns correct variable name for each valid config', () => {
      const result = createResult(mockGetVersion)(configInformation)
      expect(result.variables.length).toBe(2)
      expect(result.variables[0].name).toBe('config1_version')
      expect(result.variables[1].name).toBe('config3_version')
    })

    it('returns correct version for each valid config', () => {
      const result = createResult(mockGetVersion)(configInformation)
      expect(result.variables.length).toBe(2)
      expect(result.variables[0].version).toBe('12345')
      expect(result.variables[1].version).toBe('abcde1')
    })

    it('returns error info for each invalid config', () => {
      const result = createResult(mockGetVersion)(configInformation)
      expect(result.invalidConfigs.length).toBe(1)
      expect(result.invalidConfigs).toContainEqual({
        id: 'config2',
        path: 'config2_path',
        error: new Error('should not throw error from test'),
      })
    })
  })
})
