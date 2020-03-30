import { PackageConfig } from './package-config'

import { Project } from '.'

describe('class Project', () => {
  describe('constructor', () => {
    it('allows empty package array for monorepos', () => {
      expect(new Project(true, '/any-dir', [])).toBeDefined()
    })

    it('throws if standalone project has more than one package', () => {
      const packageConfig1 = new PackageConfig('/any-dir', { 
        name: 'some-package',
        version: '1.0.0',
      })
      const packageConfig2 = new PackageConfig('/some-other-dir', { 
        name: 'some-other-package',
        version: '1.0.0',
      })
      expect(() => new Project(false, '/any-other-dir', [packageConfig1, packageConfig2]))
        .toThrowError('Standalone projects must have exactly one package. (Found: 2)')
    })

    it('throws if standalone project does not have a package', () => {
      expect(() => new Project(false, '/any-other-dir', []))
        .toThrowError('Standalone projects must have exactly one package. (Found: 0)')
    })

    it('throws if standalone package path does not match project root', () => {
      const invalidPackageConfig = new PackageConfig('/any-dir', { 
        name: 'some-package',
        version: '1.0.0',
      })

      const pathInfo = '(projectRoot="/any-other-dir", packagePath="/any-dir")'
      expect(() => new Project(false, '/any-other-dir', [invalidPackageConfig]))
        .toThrowError(`Standalone package directories must match the project root. ${pathInfo}`)
    })
  })

  describe('getPackage', () => {
    describe('when standalone project', () => {
      const packageConfig1 = new PackageConfig('/any-dir', {
        name: 'app',
        version: '1.0.0',
      })    
      const project = new Project(false, '/any-dir', [packageConfig1])

      it('returns package when name matches this project', () => {
        expect(project.getPackage('app')).toBe(packageConfig1)
      })

      it('returns undefined when name DOES NOT match this project', () => {
        expect(project.getPackage('not-app')).toBeUndefined()
      })
    })

    describe('when monorepo project', () => {
      const packageConfig1 = new PackageConfig('/app/pkg1', {
        name: 'pkg1',
        version: '1.0.0',
      })
      const packageConfig2 = new PackageConfig('/app/pkg2', {
        name: 'pkg2',
        version: '1.0.0',
      })
      const project = new Project(true, '/app', [packageConfig1, packageConfig2])

      it('returns package when name exists in the project', () => {
        expect(project.getPackage('pkg1')).toBe(packageConfig1)
        expect(project.getPackage('pkg2')).toBe(packageConfig2)
      })

      it('returns undefined when name is completely outside project', () => {
        expect(project.getPackage('any-other-pkg')).toBeUndefined()
      })
    })
  })

  describe('getPackageFromDir', () => {
    describe('when standalone project', () => {
      const packageConfig1 = new PackageConfig('/any-dir', {
        name: 'app',
        version: '1.0.0',
      })    
      const project = new Project(false, '/any-dir', [packageConfig1])

      it('returns package when directory matches project root', () => {
        expect(project.getPackageFromDir('/any-dir')).toBe(packageConfig1)
      })

      it('returns undefined when directory DOES NOT match project root', () => {
        expect(project.getPackageFromDir('/any-other-dir')).toBeUndefined()
      })
    })

    describe('when monorepo project', () => {
      const packageConfig1 = new PackageConfig('/app/pkg1', {
        name: 'pkg1',
        version: '1.0.0',
      })
      const packageConfig2 = new PackageConfig('/app/pkg2', {
        name: 'pkg2',
        version: '1.0.0',
      })
      const project = new Project(true, '/app', [packageConfig1, packageConfig2])

      it('returns package when directory matches package path', () => {
        expect(project.getPackageFromDir('/app/pkg1')).toBe(packageConfig1)
        expect(project.getPackageFromDir('/app/pkg2')).toBe(packageConfig2)
      })

      it('returns undefined when directory matches project root', () => {
        expect(project.getPackageFromDir('/app')).toBeUndefined()
      })

      it('returns undefined when directory is completely outside project', () => {
        expect(project.getPackageFromDir('/any-other-dir')).toBeUndefined()
      })
    })
  })

  describe('isProjectRoot', () => {
    it('returns true, when directory IS package root', () => {
      expect(new Project(true, '/any-dir', []).isProjectRoot('/any-dir')).toBe(true)
    })

    it('returns false, when directory IS NOT package root', () => {
      expect(new Project(true, '/any-dir', []).isProjectRoot('/any-other-dir')).toBe(false)
    })
  })
})