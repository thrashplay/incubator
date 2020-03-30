import { MockFs, path } from '@thrashplay/mock-fs'

import fixtures from '../__fixtures__'
import { PackageConfig } from '../model'

import { StandaloneProjectStructure } from './standalone-project-structure'

jest.mock('path', () => require('@thrashplay/mock-fs').path)
jest.mock('fs', () => require('@thrashplay/mock-fs').fs)
const fs = require('fs') as MockFs

const mockPackageConfigFactory = jest.fn((initialDir: string) => {
  return Promise.resolve(new PackageConfig(initialDir, {
    name: path.basename(initialDir),
  }))
})

const createTests = (fileSystemInitializer: () => string) => () => {
  const standaloneProjectStructure = new StandaloneProjectStructure(mockPackageConfigFactory)

  let projectRoot: string
  let packageJsonPath: string

  beforeEach(async () => {
    jest.clearAllMocks()

    projectRoot = fileSystemInitializer()
    packageJsonPath = path.resolve(projectRoot, 'package.json')

    const packageJsonContent = JSON.stringify(fixtures.packageJson.default, null, 2)
    fs.writeFileSync(packageJsonPath, packageJsonContent)
  })

  it('if there is no `package.json`, returns undefined', () => {
    fs.unlinkSync(packageJsonPath)
    const projectStructure = standaloneProjectStructure.createProject(projectRoot)
    return expect(projectStructure).resolves.toBeUndefined()
  })

  describe('when directory IS valid package', () => {
    it('creates project with correct monorepo flag', async () => {
      const projectOrUndefined = await standaloneProjectStructure.createProject(projectRoot)
      expect(projectOrUndefined).toBeDefined()

      const project = projectOrUndefined!
      expect(project.isMonorepo).toBe(false)
    })

    it('creates project with correct rootDirectory',async () => {
      const projectOrUndefined = await standaloneProjectStructure.createProject(projectRoot)
      expect(projectOrUndefined).toBeDefined()

      const project = projectOrUndefined!
      expect(project.directory).toBe(projectRoot)
    })

    it('creates project with correct packages', async () => {
      const projectOrUndefined = await standaloneProjectStructure.createProject(projectRoot)
      expect(projectOrUndefined).toBeDefined()

      const project = projectOrUndefined!
      expect(project.packages).toHaveLength(1)
      expect(project.packages[0].directory).toBe(projectRoot)
      expect(project.packages[0].packageJson.name).toBe('app')
    })
  })
}

describe('StandaloneProjectStructure', () => {
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
