import { default as LernaProject, FileMapper } from '@lerna/project'
import { map } from 'lodash'
import { MockFs, path } from '@thrashplay/mock-fs'

import { PackageConfig } from '../model'

import { LernaProjectStructure } from '.'

jest.mock('@lerna/project')
const mockProject = LernaProject as typeof LernaProject & jest.Mock<LernaProject>

jest.mock('path', () => require('@thrashplay/mock-fs').path)
jest.mock('fs', () => require('@thrashplay/mock-fs').fs)
const fs = require('fs') as MockFs

const mockPackageConfigFactory = jest.fn((initialDir: string) => {
  return Promise.resolve(new PackageConfig(initialDir, {
    name: path.basename(initialDir),
  }))
})

interface FileSystemConfig {
  projectRoot: string
}

const initializeMockLernaProject = (rootPath: string, packageRoots: string[]) => {

  return mockProject.mockImplementation(() => ({
    rootPath,
    fileFinder: jest.fn((fileName, mapper: FileMapper) => {
      return Promise.resolve(mapper(map(packageRoots, (root) => path.resolve(root, fileName))))
    }),
  }))
}

const createTests = (fileSystemInitializer: () => FileSystemConfig) => () => {
  const lernaProjectStructure = new LernaProjectStructure(mockPackageConfigFactory)

  const lernaJson = {
    version: '1.1.3',
  }
  const packageRootParts = [
    ['packages', 'package-one-dir'],
    ['packages', 'other-packages-root', 'nested-dir', 'package-two-dir'],
  ]

  let projectRoot: string
  let packageRoots: string[]

  beforeEach(async () => {
    jest.clearAllMocks()

    projectRoot = fileSystemInitializer().projectRoot
    packageRoots = map(packageRootParts, (parts) => path.resolve(projectRoot, ...parts))

    initializeMockLernaProject(projectRoot, packageRoots)
    fs.writeFileSync(path.resolve(projectRoot, 'lerna.json'), JSON.stringify(lernaJson, null, 2))
  })

  it.each([
    [[]],
    ...map(packageRootParts, (parts) => [parts]),
  ])('creates Lerna project with correct cwd: %s', async (initialDirPaths: string[]) => {
    const initialDir = path.resolve(projectRoot, ...initialDirPaths)

    await lernaProjectStructure.createProject(initialDir)
    expect(LernaProject).toHaveBeenCalledTimes(1)
    expect(LernaProject).toHaveBeenLastCalledWith(initialDir)
  })

  describe('when structure is not lerna monorepo', () => {
    it('returns undefined, if no lerna.json exists', async () => {
      fs.unlinkSync(path.resolve(projectRoot, 'lerna.json'))
  
      const initialDir = path.resolve(projectRoot)
      const projectStructurePromise = lernaProjectStructure.createProject(initialDir)
      return await expect(projectStructurePromise).resolves.toBeUndefined()
    })

    it('returns undefined, if lerna.json is not a file', async () => {
      fs.unlinkSync(path.resolve(projectRoot, 'lerna.json'))
      fs.mkdirSync(path.resolve(projectRoot, 'lerna.json'), { recursive: true })
  
      const initialDir = path.resolve(projectRoot)
      const projectStructurePromise = lernaProjectStructure.createProject(initialDir)
      return await expect(projectStructurePromise).resolves.toBeUndefined()
    })
  })

  describe('when structure IS a lerna monorepo', () => {
    it('creates project with correct monorepo flag: package = %s', async () => {
      const initialDir = path.resolve(projectRoot, ...packageRootParts[0])

      const projectOrUndefined = await lernaProjectStructure.createProject(initialDir)
      expect(projectOrUndefined).toBeDefined()

      const project = projectOrUndefined!
      expect(project.isMonorepo).toBe(true)
    })

    it('creates project with correct projectRootDir: package = %s', async () => {
      const initialDir = path.resolve(projectRoot, ...packageRootParts[0])

      const projectOrUndefined = await lernaProjectStructure.createProject(initialDir)
      expect(projectOrUndefined).toBeDefined()

      const project = projectOrUndefined!
      expect(project.directory).toBe(projectRoot)
    })

    it('creates project with correct packages: package = %s', async () => {
      const initialDir = path.resolve(projectRoot, ...packageRootParts[0])

      const projectOrUndefined = await lernaProjectStructure.createProject(initialDir)
      expect(projectOrUndefined).toBeDefined()

      const project = projectOrUndefined!
      expect(project.packages).toHaveLength(2)
      expect(project.packages[0].directory).toBe(path.resolve(projectRoot, ...packageRootParts[0]))
      expect(project.packages[0].packageJson.name).toBe('package-one-dir')
      expect(project.packages[1].directory).toBe(path.resolve(projectRoot, ...packageRootParts[1]))
      expect(project.packages[1].packageJson.name).toBe('package-two-dir')
    })
  })
}

describe('LernaProjectStructure', () => {
  const initializeWin32Fs = () => {
    fs.__reset('win32')
  
    fs.mkdirSync('c:\\app', { recursive: true })
    fs.mkdirSync('c:\\app\\packages\\package-one-dir', { recursive: true })
    fs.mkdirSync('c:\\app\\other-packages-root\\nested-dir\\package-two-dir', { recursive: true })
  
    return { projectRoot: path.join('c:', 'app') }
  }
  
  const initializePosixFs = () => {
    fs.__reset('posix')
  
    fs.mkdirSync('/app', { recursive: true })
    fs.mkdirSync('/app/packages/package-one-dir', { recursive: true })
    fs.mkdirSync('/app/other-packages-root/nested-dir/package-two-dir', { recursive: true })
  
    return { projectRoot: path.join('/', 'app') }
  }
  
  describe('on win32', createTests(initializeWin32Fs))
  describe('on posix', createTests(initializePosixFs))
})
