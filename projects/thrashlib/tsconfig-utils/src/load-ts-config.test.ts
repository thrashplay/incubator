import os from 'os'

import { MockFs, path } from '@thrashplay/mock-fs'

import fixtures from './__fixtures__'
import { loadTsConfig } from './load-ts-config'

jest.mock('path', () => require('@thrashplay/mock-fs').path)
jest.mock('fs', () => require('@thrashplay/mock-fs').fs)
const fs = require('fs') as MockFs

const expectErrorWhenLoading = async (tsconfigPath: string, expectedCode: string, expectedMessage: string) => {
  let caughtError
  try {
    await loadTsConfig(tsconfigPath)
  } catch (err) {
    caughtError = err
  }

  expect(caughtError).toBeDefined()
  expect(caughtError.code).toBe(expectedCode)
  expect(caughtError.message).toBe(expectedMessage)
}

const createTests = (fileSystemInitializer: () => string) => () => {
  let directory: string
  let tsconfigPath: string

  beforeEach(() => {
    jest.clearAllMocks()

    directory = fileSystemInitializer()
    tsconfigPath = path.resolve(directory, 'tsconfig.json')
    fs.writeFileSync(tsconfigPath, JSON.stringify(fixtures.tsconfig.simple, null, 2))
  })

  describe('reads correct file path', () => {
    it('when it does not exist', async () => {
      const expectedPath = path.resolve(directory, 'any-invalid-path')
      await expectErrorWhenLoading(expectedPath, 'ENOENT', `tsconfig path does not exist: ${expectedPath}`)
    })

    it('when it is valid tsconfig.json file', async () => {
      const tsconfig = await loadTsConfig(tsconfigPath)
      expect(tsconfig).toEqual(fixtures.tsconfig.simple)
    })

    it('when it is directory with valid tsconfig.json', async () => {
      const tsconfig = await loadTsConfig(directory)
      expect(tsconfig).toEqual(fixtures.tsconfig.simple)
    })
  
    describe('when it is invalid directory', () => {
      it('with tsconfig.json that is a subdirectory', async () => {
        // create a directory where we expect a tsconfig.json file
        fs.unlinkSync(tsconfigPath)
        fs.mkdirSync(tsconfigPath, { recursive: true })

        await expectErrorWhenLoading(directory, 'EISDIR', `Found directory named 'tsconfig.json' instead of JSON file: ${tsconfigPath}`)
      })

      it('with no tsconfig.json', async () => {
        fs.unlinkSync(tsconfigPath)
        await expectErrorWhenLoading(directory, 'ENOENT', `tsconfig path does not exist: ${tsconfigPath}`)
      })
    })
  })

  describe('parses JSON correctly', () => {
    const jsonWithTopLevelUnknownProperty = { 
      testInvalidProperty: 'any-value',
    }

    const jsonWithUnknownCompilerOption = { 
      compilerOptions: {
        testInvalidProperty: 'any-value',
      },
    }

    const jsonWithInvalidJsxValue = {
      compilerOptions: {
        jsx: 'invalid-value',
      },
    }

    const jsonWithMultipleErrors = {
      testInvalidProperty: 'any-value',
      compilerOptions: {
        noEmit: 'not-a-boolean',
        jsx: 'invalid-value',
        testUnknownProperty: 'some-value',
      },
    }

    const expectedMultiErrorString = 
      `${os.EOL}has unrecognized property: ".testInvalidProperty"${os.EOL}` +
      `has unrecognized property: ".compilerOptions.testUnknownProperty"${os.EOL}` +
      `.compilerOptions.jsx must equal one of: preserve,react,react-native${os.EOL}` +
      '.compilerOptions.noEmit should be boolean'

    test.each<[string, any]>([
      ['empty', fixtures.tsconfig.empty],
      ['simple', fixtures.tsconfig.simple],
      ['complex', fixtures.tsconfig.complex],
    ])('when valid: %p', async (_name: string, expectedTsconfig: any) => {
      fs.writeFileSync(tsconfigPath, JSON.stringify(expectedTsconfig, null, 2))
      const tsconfig = await loadTsConfig(tsconfigPath)
      expect(tsconfig).toEqual(expectedTsconfig)
    })

    test('when invalid JSON', async () => {
      fs.writeFileSync(tsconfigPath, '\'"{"/ garbage.data } not \' valid\"json')
      await expect(loadTsConfig(tsconfigPath)).rejects.toThrow(`'${tsconfigPath}' was not valid JSON: Unexpected token ' in JSON at position 0`)
    })

    test.each<[string, object, string]>([
      ['unknown top-level property', jsonWithTopLevelUnknownProperty, 'has unrecognized property: ".testInvalidProperty"'],
      ['unknown compiler option', jsonWithUnknownCompilerOption, 'has unrecognized property: ".compilerOptions.testInvalidProperty"'],
      ['invalid value', jsonWithInvalidJsxValue, '.compilerOptions.jsx must equal one of: preserve,react,react-native'],
      ['multiple errors', jsonWithMultipleErrors, expectedMultiErrorString],
    ])('when contents do not match schema: %s', async (_name: string, input: object, expectedError: string) => {
      fs.writeFileSync(tsconfigPath, JSON.stringify(input))
      await expect(loadTsConfig(tsconfigPath)).rejects.toThrow(`'${tsconfigPath}' is not a valid tsconfig.json file: ${expectedError}`)
    })
  })

  describe.skip('when flatten == true', () => {
    throw new Error('not implemented')
  })
}

describe('loadTsconfig', () => {
  const initializeWin32Fs = () => {
    fs.__reset('win32')
    fs.mkdirSync('c:\\app\\packages\\ts-package', { recursive: true })
    return 'c:\\app'
  }

  const initializePosixFs = () => {
    fs.__reset('posix')
    fs.mkdirSync('/app/packages/ts-package', { recursive: true })
    return '/app'
  }

  describe('on win32', createTests(initializeWin32Fs))
  describe('on posix', createTests(initializePosixFs))
})