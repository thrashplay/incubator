import { MockFs, path } from '@thrashplay/mock-fs'
import { pathExistsSync } from '@thrashplay/fs-utils'
import { mocked } from 'ts-jest/utils'
import yaml from 'js-yaml'
import { get } from 'lodash'

import { baseStack } from '../__fixtures__'
import { ConfigVersionsResult } from '../types'
import { getConfigVersionVariables } from '../core'

import { createEnvFile } from './index'

jest.mock('path', () => require('@thrashplay/mock-fs').path)
jest.mock('fs', () => require('@thrashplay/mock-fs').fs)
const fs = require('fs') as MockFs

jest.mock('../core')
const mockGetConfigVersionVariables = mocked(getConfigVersionVariables)

const mockGetVariableName = jest.fn().mockName('mockGetVariableName')
const mockGetVersion = jest.fn().mockName('mockGetVersion')

const stack = {
  ...baseStack,
  configs: {
    test_config: {
      file: 'config-file',
      name: 'test_config_name',
    },
  },
}

const expectedEnvFileContents = 'variable1=version1\nvariable2=version2'
const validConfigVersionsResult: ConfigVersionsResult = {
  invalidConfigs: [],
  variables: [
    {
      name: 'variable1',
      version: 'version1',
    },
    {
      name: 'variable2',
      version: 'version2',
    },
  ],
}

const invalidConfigVersionsResult: ConfigVersionsResult = {
  invalidConfigs: [
    {
      error: new Error('test error, thrown in test'),
      id: 'any-config',
      path: 'any/path',
    },
  ],
  variables: [
    {
      name: 'variable1',
      version: 'version1',
    },
    {
      name: 'variable2',
      version: 'version2',
    },
  ],
}

const createTests = (fileSystemInitializer: () => string) => () => {
  let rootDirectory: string
  let stackFilePath: string

  beforeEach(() => {
    jest.clearAllMocks()

    mockGetConfigVersionVariables.mockReturnValue(validConfigVersionsResult)

    rootDirectory = fileSystemInitializer()
    stackFilePath = path.resolve(rootDirectory, 'test-path', 'docker-compose.yaml')

    fs.mkdirSync(path.resolve(rootDirectory, 'test-path'), { recursive: true })
    fs.writeFileSync(stackFilePath, yaml.safeDump(stack))
  })

  describe('invalid Docker compose path', () => {
    it('throws an error, if file does not exist', async () => {
      await expect(createEnvFile(path.resolve(rootDirectory, 'any-garbage-path.yaml')))
        .rejects.toThrowError('Invalid stack definition Yaml path: ' + path.resolve(rootDirectory, 'any-garbage-path.yaml'))
    })

    it('throws an error, if file is a directory', async () => {
      await expect(createEnvFile(path.resolve(rootDirectory, 'test-path')))
        .rejects.toThrowError('Invalid stack definition Yaml path: ' + path.resolve(rootDirectory, 'test-path'))
    })
  })

  describe('gets config versions using correct arguments', () => {
    it('stack definition', async () => {
      await createEnvFile(stackFilePath)
      expect(mockGetConfigVersionVariables).toHaveBeenCalledTimes(1)
      expect(mockGetConfigVersionVariables.mock.calls[0][0]).toEqual(stack)
    })

    describe('when options are second parameter', () => {
      it('getVariableName', async () => {
        await createEnvFile(stackFilePath, {
          getVariableName: mockGetVariableName,
        })
  
        expect(mockGetConfigVersionVariables).toHaveBeenCalledTimes(1)
        expect(get(mockGetConfigVersionVariables.mock.calls[0][1], 'getVariableName')).toBe(mockGetVariableName)
      })

      it('getVersion', async () => {
        await createEnvFile(stackFilePath, {
          getVersion: mockGetVersion,
        })
  
        expect(mockGetConfigVersionVariables).toHaveBeenCalledTimes(1)
        expect(get(mockGetConfigVersionVariables.mock.calls[0][1], 'getVersion')).toBe(mockGetVersion)
      })
    })

    describe('when options are third parameter', () => {
      it('getVariableName', async () => {
        await createEnvFile(stackFilePath, 'test.env', {
          getVariableName: mockGetVariableName,
        })
  
        expect(mockGetConfigVersionVariables).toHaveBeenCalledTimes(1)
        expect(get(mockGetConfigVersionVariables.mock.calls[0][1], 'getVariableName')).toBe(mockGetVariableName)
      })

      it('getVersion', async () => {
        await createEnvFile(stackFilePath, 'test.env', {
          getVersion: mockGetVersion,
        })
  
        expect(mockGetConfigVersionVariables).toHaveBeenCalledTimes(1)
        expect(get(mockGetConfigVersionVariables.mock.calls[0][1], 'getVersion')).toBe(mockGetVersion)
      })

      it.todo('getConfigContent')
    })
  })

  describe('when valid, writes results to correct file', () => {
    const expectFileContents = (filePath: string) => expect(fs.readFileSync(filePath, 'utf8'))

    it('uses default value, when NO env file path provided', async () => {
      await createEnvFile(stackFilePath)
      expectFileContents(path.resolve(rootDirectory, 'test-path', '.env')).toEqual(expectedEnvFileContents)
    })

    describe('when env file path provided as string', () => {
      it('uses the path directly', async () => {
        await createEnvFile(stackFilePath, path.resolve(rootDirectory, 'test-path', 'output.env'))
        expectFileContents(path.resolve(rootDirectory, 'test-path', 'output.env')).toEqual(expectedEnvFileContents)
      })

      it('creates directories, if they are missing', async () => {
        await createEnvFile(stackFilePath, path.resolve(rootDirectory, 'missing', 'folders', 'output.env'))
        expectFileContents(path.resolve(rootDirectory, 'missing', 'folders', 'output.env')).toEqual(expectedEnvFileContents)
      })
    })

    describe('when env file path provided as function', () => {
      const mockEnvPathProvider = jest.fn(() => 'default-unset-test-path')

      it('passes correct argument to the function', async () => {
        await createEnvFile(stackFilePath, mockEnvPathProvider)
        expect(mockEnvPathProvider).toHaveBeenCalledWith(stackFilePath)
      })

      it('uses the path directly', async () => {
        const thePath = path.resolve(rootDirectory, 'test-path', 'output.env')
        mockEnvPathProvider.mockReturnValue(thePath)
        await createEnvFile(stackFilePath, mockEnvPathProvider)
        expectFileContents(thePath).toEqual(expectedEnvFileContents)
      })

      it('creates directories, if they are missing', async () => {
        const thePath = path.resolve(rootDirectory, 'missing', 'folders', 'output.env')
        mockEnvPathProvider.mockReturnValue(thePath)
        await createEnvFile(stackFilePath, mockEnvPathProvider)
        expectFileContents(thePath).toEqual(expectedEnvFileContents)
      })
    })
  })

  describe('when invalid results', () => {
    beforeEach(() => {
      mockGetConfigVersionVariables.mockReturnValue(invalidConfigVersionsResult)
    })

    it('should throw exception', async () => {
      await expect(createEnvFile(stackFilePath, path.resolve(rootDirectory, 'test-path', 'output.env'))).rejects.toThrowError()
    })

    it('should write no file', async () => {
      await expect(createEnvFile(stackFilePath, path.resolve(rootDirectory, 'test-path', 'output.env'))).rejects.toThrowError()
      expect(pathExistsSync(path.resolve(rootDirectory, 'test-path', 'output.env'))).toEqual(false)
    })
  })
}

describe('createEnvFile', () => {
  const initializeWin32Fs = () => {
    fs.__reset('win32')
    return 'c:\\'
  }

  const initializePosixFs = () => {
    fs.__reset('posix')
    return '/'
  }

  describe('on win32', createTests(initializeWin32Fs))
  describe('on posix', createTests(initializePosixFs))
})