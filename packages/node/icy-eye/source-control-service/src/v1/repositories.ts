import { RepositoryArrayResponse, RepositoryTypeEnum } from '@thrashplay/source-control-api'

export const getRepositories = async (_c: any, _: any, _res: any): Promise<RepositoryArrayResponse> => {
  const result = {
    data: [
      {
        id: '12345',
        repositoryType: RepositoryTypeEnum.Git,
        url: 'https://blah',
      },
    ],
  }

  return result
}