import { MockFs, path } from '@thrashplay/mock-fs'
import { mocked } from 'ts-jest/utils'

import { validatePackageJson } from '../model/package-json'
import fixtures from '../__fixtures__'

import { createPackageConfig } from '.'

jest.mock('path', () => require('@thrashplay/mock-fs').path)
jest.mock('fs', () => require('@thrashplay/mock-fs').fs)
const fs = require('fs') as MockFs

jest.mock('../model/package-json', () => ({
  ...jest.requireActual('../model/package-json'),
  validatePackageJson: jest.fn((input) => input),
}))

const mockValidatePackageJson = mocked(validatePackageJson)

const createTests = (fileSystemInitializer: () => string) => () => {
  let directory: string
  let packageJsonPath: string

  beforeEach(() => {
    jest.clearAllMocks()

    mockValidatePackageJson.mockImplementation((input) => input),

    directory = fileSystemInitializer()
    packageJsonPath = path.resolve(directory, 'package.json')
    fs.writeFileSync(packageJsonPath, JSON.stringify(fixtures.packageJson.default, null, 2))
  })

  describe('when package.json IS valid', () => {
    it('loads package.json', async () => {
      const packageConfig = await createPackageConfig(directory)
      expect(packageConfig.packageJson).toMatchObject(fixtures.packageJson.default)
    })
  })
  
  describe('when package.json IS NOT valid', () => {
    it('throws error, when NO package.json', async () => {
      fs.unlinkSync(packageJsonPath)
      await expect(createPackageConfig(directory)).rejects.toThrowError()
    })

    it('throws error, when package.json is not valid JSON', async () => {
      fs.writeFileSync(packageJsonPath, '{ garbage-that-isn\'t valid json: 132 } 12: 5')
      await expect(createPackageConfig(directory)).rejects.toThrow(`Invalid package.json format: ${packageJsonPath}`)
    })

    it('throws error, when package.json has invalid structure', async () => {
      mockValidatePackageJson.mockImplementation(() => { throw new SyntaxError('Invalid package.json format!') })
      return expect(createPackageConfig(directory))
        .rejects.toThrow(`Invalid package.json JSON structure: ${packageJsonPath}`)
    })
  })
}

describe('createPackageConfig', () => {
  const initializeWin32Fs = () => {
    fs.__reset('win32')
    fs.mkdirSync('c:\\app', { recursive: true })
    return 'c:\\app'
  }

  const initializePosixFs = () => {
    fs.__reset('posix')
    fs.mkdirSync('/app', { recursive: true })
    return '/app'
  }

  describe('on win32', createTests(initializeWin32Fs))
  describe('on posix', createTests(initializePosixFs))
})