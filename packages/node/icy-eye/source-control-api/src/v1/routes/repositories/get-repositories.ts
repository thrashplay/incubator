type Response = SourceControlService.API.GetRepositoriesResponse
export const getRepositories = async (_c: any, _: any, res: any): Promise<any> => {
  const result = {
    data: [
      {
        id: '12345',
        repositoryType: 'git',
        url: 'https://blah',
      },
    ],
  }

  return result
}