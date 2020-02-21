import { assign, get, merge, xor } from 'lodash'
import { MockFs, path } from '@thrashplay/mock-fs'
import { TsConfig } from '@thrashplay/tsconfig-utils'
import { PackageJson, PackageConfig } from '@thrashplay/project-utils'

import fixtures from './__fixtures__'
import { getTsConfigs, getUserTsConfig } from './get-ts-configs'

jest.mock('path', () => require('@thrashplay/mock-fs').path)
jest.mock('fs', () => require('@thrashplay/mock-fs').fs)
const fs = require('fs') as MockFs

const minimalPackageJson = {
  name: 'test-package',
  version: '1.0.0',
} as const

const withDependencies = (base: PackageJson): PackageJson => {
  return {
    ...base,
    dependencies: {
      'matching-dependency-1': '1.0',
      'matching-dependency-2': '1.0',
      'non-matching-dependency': '1.0',
    },
  }
}

const withDevDependencies = (base: PackageJson): PackageJson => {
  return {
    ...base,
    devDependencies: {
      'matching-dependency-1': '1.0',
      'matching-dependency-2': '1.0',
      'non-matching-dev-dependency': '1.0',
    },
  }
}

const withPeerDependencies = (base: PackageJson): PackageJson => {
  return {
    ...base,
    peerDependencies: {
      'matching-dependency-1': '1.0',
      'matching-dependency-2': '1.0',
      'non-matching-dependency': '1.0',
    },
  }
}

const emptyTsConfig: TsConfig = {}
const allowJs: TsConfig = {
  compilerOptions: {
    allowJs: true,
  },
}
const allowJsx: TsConfig = {
  compilerOptions: {
    jsx: 'react',
  },
}
const resolveJsonModule: TsConfig = {
  compilerOptions: {
    resolveJsonModule: true,
  },
}

const initializeWin32 = () => {
  fs.__reset('win32')
  fs.mkdirSync('c:\\app', { recursive: true })
  return 'c:\\app'
}

const initializePosix = () => {
  fs.__reset('posix')
  fs.mkdirSync('/app', { recursive: true })
  return '/app'
}

describe.only.each([
  ['win32', initializeWin32],
  ['posix', initializePosix],
])('getUserTsConfig: %s', (_platform: string, initializeFunction: () => string) => {
  const mockTsConfigLoader = jest.fn(() => Promise.resolve({}))

  let projectRoot: string
  let packageConfig: PackageConfig

  beforeEach(() => {
    projectRoot = initializeFunction()
    packageConfig = new PackageConfig(projectRoot, minimalPackageJson)
    mockTsConfigLoader.mockImplementation(() => Promise.resolve({}))
  })


  describe('when tsconfig loader throws an error', () => {
    test('path is not found, returns {}', async () => {
      mockTsConfigLoader.mockRejectedValue(assign(new Error('tsconfig path does not exist'), { code: 'ENOENT' }))
      await expect(getUserTsConfig(packageConfig, mockTsConfigLoader)).resolves.toBe({})
    })

    test('path is a directory', async () => {
      mockTsConfigLoader.mockRejectedValue(assign(new Error('Found directory named \'tsconfig.json\' instead of JSON file'), { code: 'EISDIR' }))
      await expect(getUserTsConfig(packageConfig, mockTsConfigLoader)).rejects.toHaveProperty('code', 'EISDIR')
    })

    test('any other error', async () => {
      mockTsConfigLoader.mockRejectedValue(new Error('any other error'))
      await expect(getUserTsConfig(packageConfig, mockTsConfigLoader)).rejects.toThrowError()
    })
  })

  it('loads correct path', () => {
    throw new Error('not implemented')
  })

  describe('when tsconfig.json is valid', () => {
    test.each<[string, any]>([
      ['empty', fixtures.tsconfig.empty],
      ['simple', fixtures.tsconfig.simple],
      ['complex', fixtures.tsconfig.complex],
    ])('%s', async (_name: string, expectedTsconfig: any) => {
      mockTsConfigLoader.mockResolvedValue(expectedTsconfig)
      const tsconfig = await getUserTsConfig(packageConfig, mockTsConfigLoader)
      expect(tsconfig).toEqual(expectedTsconfig)
    })
  })
})

// after here needs work

describe.each([
  ['win32', initializeWin32],
  ['posix', initializePosix],
])('getTsConfigs: %s', (_platform: string, initializeFunction: () => string) => {
  let projectRoot: string

  const minimalProject = {
    projectRoot,
    packageJson: minimalPackageJson,
  }

  beforeEach(() => {
    projectRoot = initializeFunction()
  })

  it('when paths specified in user TsConfig without baseUrl, throws Error', () => {
    throw new Error('not implemented')
  })

  describe('projectRoot == outputDirectory', () => {
    describe('static compiler options', () => {
      it.each(
        [
          ['declaration', true],
          ['declarationDir', 'lib'],
          ['outDir', 'lib'],
          ['rootDir', 'src'],
          ['tsBuildInfoFile', 'tsconfig.tsbuildinfo'],
        ]
      )('%s', (compilerOption: string, expectedValue: any) => {
        const tsConfigs = getTsConfigs(minimalProject)
        expect(get(tsConfigs.defaults, ['compilerOptions', compilerOption])).toBe(expectedValue)
      })
    })

    describe('include', () => {
      it.each<[string, TsConfig | undefined, string[]]>([
        [
          'no user TsConfig',
          [undefined],
          ['src/**/*.ts'],
        ],
        [
          'user TsConfig allows Javascript',
          [allowJs],
          ['src/**/*.js', 'src/**/*.ts'],
        ],
        [
          'user TsConfig allows JSX',
          [allowJsx],
          ['src/**/*.ts', 'src/**/*.tsx'],
        ],
        [
          'user TsConfig allows Javascript and JSX',
          [allowJs, allowJsx],
          ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
        ],
        [
          'user TsConfig allows JSON modules',
          [resolveJsonModule],
          ['src/**/*.ts', 'src/**/*.json'],
        ],
      ])('when %s', (_condition: string, userTsConfigFragments: Partial<TsConfig>[], expectedIncludePaths: string[]) => {
        const userTsConfig = merge({}, ...userTsConfigFragments)
        const tsConfigs = getTsConfigs(merge({}, minimalProject, { userTsConfig }))
        expect(xor(tsConfigs.defaults.include, expectedIncludePaths)).toHaveLength(0)
      })
    })

    describe.each([
      ['dependencies', withDependencies],
      ['devDependencies', withDevDependencies],
      ['peerDependencies', withPeerDependencies],
    ])('references from %s',  (_description: string, packageJsonModifer: (base: PackageJson) => PackageJson) => {
      const packageJson = packageJsonModifer(minimalPackageJson)
THIS IS WRONG AN DNEEDS PACKAGE INFO NOT TSCONFIG
      it('when no paths in user TsConfig, generates no references', () => {
        const tsConfigs = getTsConfigs({ packageJson, projectRoot })
        expect(tsConfigs.defaults.references).toHaveLength(0)
      })

      it('when no dependencies match paths in user TsConfig, generates no references', () => {
        const userTsConfig: TsConfig = {
          compilerOptions: {
            paths: {
              'any-arbitrary-path': ['any-other-path'],
            },
          },
        }

        const tsConfigs = getTsConfigs({ packageJson, projectRoot, userTsConfig })
        expect(tsConfigs.defaults.references).toHaveLength(0)
      })

      it.each(
        []
      )('dependencies that match paths in user TsConfig, are included in references', () => {
        throw new Error('not implemented')
      })
    })
  })

  describe('"build" tsconfig', () =>{
    it('excludes tests', () => {
      throw new Error('not implemented')
    })
  })


  describe('"test" tsconfig', () =>{
    throw new Error('not implemented')
  })
})
