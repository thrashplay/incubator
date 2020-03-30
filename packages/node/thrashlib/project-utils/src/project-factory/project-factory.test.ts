import { Project } from '../model'

import { ProjectFactory, ProjectStructure } from '.'

const mockCreateProject1 = jest.fn()
const mockCreateProject2 = jest.fn()

describe('ProjectFactory class', () => {
  const projectStructure1: ProjectStructure = {
    name: 'Project Structure 1',
    createProject: mockCreateProject1,
  }

  const projectStructure2: ProjectStructure = {
    name: 'Project Structure 2',
    createProject: mockCreateProject2,
  }

  const projectFactory = new ProjectFactory([projectStructure1, projectStructure2])
  const directory = '/project-directory'
  const project = new Project(true, directory, [])

  beforeEach(() => {
    jest.clearAllMocks()

    mockCreateProject1.mockImplementation((_initialDirectory: string) => Promise.resolve(undefined))
    mockCreateProject2.mockImplementation((_initialDirectory: string) => Promise.resolve(undefined))
  })

  it('throws Error when no project structure matches', async () => {
    await expect(projectFactory.createProject(directory))
      .rejects.toThrowError('Unable to determine project structure from among known types: [Project Structure 1, Project Structure 2]')
  })

  it('throws Error when constructor called with no known project structures', () => {
    expect(() => new ProjectFactory([])).toThrowError('Cannot create ProjectFactory without any project structures.')
  })

  describe('when first project structure matches', () => {
    beforeEach(() => {
      mockCreateProject1.mockImplementation((initialDirectory: string) => {
        return initialDirectory === directory
          ? Promise.resolve(project)
          : Promise.resolve(undefined)
      })
    })
    
    it('returns correct project', async () => {
      await expect(projectFactory.createProject(directory)).resolves.toBe(project)
    })

    it('does not call second structure instance', async () => {
      await projectFactory.createProject(directory)
      expect(mockCreateProject2).not.toBeCalled()
    })
  })

  describe('when second project structure matches', () => {
    beforeEach(() => {
      mockCreateProject2.mockImplementation((initialDirectory: string) => {
        return initialDirectory === directory
          ? Promise.resolve(project)
          : Promise.resolve(undefined)
      })
    })

    it('returns correct project', async () => {
      await expect(projectFactory.createProject(directory)).resolves.toBe(project)
    })
  })
})