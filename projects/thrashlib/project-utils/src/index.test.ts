import { ProjectFactory } from './project-factory'
import { Project, PackageConfig } from './model'

import { getProject, getPackages, getPackageDirectories, getPackageJsons } from '.'

jest.mock('./project-factory', () => ({
  ...jest.requireActual('./project-factory'),
  ProjectFactory: jest.fn(),
}))
const mockProjectFactory = ProjectFactory as typeof ProjectFactory & jest.Mock<ProjectFactory>

describe('helper methods', () => {
  const setCreateProjectResult = (expectedDirectory: string, project: Project) => {
    mockProjectFactory.mockImplementation(() => {
      const mockProjectStructure = {
        name: 'Mock Project Structure',
        createProject: (initialDirectory: string) => {
          if (initialDirectory !== expectedDirectory) {
            throw new Error(`Unexpected initialDirectory: ${initialDirectory}`)
          }
          return Promise.resolve(project)
        },
      }
      
      return new (jest.requireActual('./project-factory').ProjectFactory)([mockProjectStructure])
    })
  }

  beforeEach(() => {
    mockProjectFactory.mockImplementation(() => { throw new Error('No mockProjectFactory implementation provided.' )})
  })

  describe('getProject', () => {
    const standalonePackageConfig = new PackageConfig('/app', {
      name: 'standalone-package',
      version: '1.0',
    })
    const project = new Project(false, '/app', [standalonePackageConfig])

    beforeEach(() => {
      setCreateProjectResult('/app', project)
    })

    it('returns project from default factory', async () => {
      await expect(getProject('/app')).resolves.toBe(project)
    })

    it('throws if default factory fails', async () => {
      await expect(getProject('/invalid-directory')).rejects.toThrowError()
    })
  })

  describe('when standalone project', () => {
    const standalonePackageConfig = new PackageConfig('/app', {
      name: 'standalone-package',
      version: '1.0',
    })

    const project = new Project(false, '/app', [standalonePackageConfig])

    beforeEach(() => {
      setCreateProjectResult('/app', project)
    })

    describe('getPackages', () => {
      it('returns package when directory is a project', async () => {
        const packages = await getPackages('/app')
        
        expect(packages).toHaveLength(1)
        expect(packages[0].directory).toBe('/app')
        expect(packages[0].packageJson.name).toBe('standalone-package')
        expect(packages[0].packageJson.version).toBe('1.0')
      })
  
      it('throws if default factory fails', async () => {
        await expect(getPackages('/invalid-directory')).rejects.toThrowError()
      })
    })

    describe('getPackageDirectories', () => {
      it('returns directory map when directory is a project', async () => {
        expect(await getPackageDirectories('/app')).toStrictEqual({
          'standalone-package': '/app',
        })
      })
  
      it('throws if default factory fails', async () => {
        await expect(getPackageDirectories('/invalid-directory')).rejects.toThrowError()
      })
    })

    describe('getPackageJsons', () => {
      it('returns package JSON when directory is a project', async () => {
        const packageJsons = await getPackageJsons('/app')
        
        expect(packageJsons).toHaveLength(1)
        expect(packageJsons[0].name).toBe('standalone-package')
        expect(packageJsons[0].version).toBe('1.0')
      })
  
      it('throws if default factory fails', async () => {
        await expect(getPackageJsons('/invalid-directory')).rejects.toThrowError()
      })
    })
  })

  describe('when monorepo project', () => {
    const monorepoPackageConfig1 = new PackageConfig('/app/packages/first-package', {
      name: 'first-package',
      version: '1.0',
    })
    const monorepoPackageConfig2 = new PackageConfig('/app/some-other/root/second-package', {
      name: 'second-package',
      version: '1.0',
    })

    const project = new Project(true, '/app', [monorepoPackageConfig1, monorepoPackageConfig2])

    beforeEach(() => {
      setCreateProjectResult('/app', project)
    })

    describe('getPackages', () => {
      it('returns packages when directory is a project', async () => {
        const packages = await getPackages('/app')
        
        expect(packages).toHaveLength(2)
        
        expect(packages[0].directory).toBe('/app/packages/first-package')
        expect(packages[0].packageJson.name).toBe('first-package')
        expect(packages[0].packageJson.version).toBe('1.0')

        expect(packages[1].directory).toBe('/app/some-other/root/second-package')
        expect(packages[1].packageJson.name).toBe('second-package')
        expect(packages[1].packageJson.version).toBe('1.0')
      })
  
      it('throws if default factory fails', async () => {
        await expect(getPackages('/invalid-directory')).rejects.toThrowError()
      })
    })

    describe('getPackageDirectories', () => {
      it('returns directory map when directory is a project', async () => {
        expect(await getPackageDirectories('/app')).toStrictEqual({
          'first-package': '/app/packages/first-package',
          'second-package': '/app/some-other/root/second-package',
        })
      })
  
      it('throws if default factory fails', async () => {
        await expect(getPackageDirectories('/invalid-directory')).rejects.toThrowError()
      })
    })

    describe('getPackageJsons', () => {
      it('returns package JSONs when directory is a project', async () => {
        const packageJsons = await getPackageJsons('/app')
        
        expect(packageJsons).toHaveLength(2)
        expect(packageJsons[0].name).toBe('first-package')
        expect(packageJsons[0].version).toBe('1.0')
        expect(packageJsons[1].name).toBe('second-package')
        expect(packageJsons[1].version).toBe('1.0')
      })
  
      it('throws if default factory fails', async () => {
        await expect(getPackageJsons('/invalid-directory')).rejects.toThrowError()
      })
    })
  })
})
