type Response = InlineResponse200
export const getRepositories = async (_c: any, _: any, res: any): Promise<Response> => {
  const result = {
    data: [
      {
        id: '12345',
        repositoryType: 'git' as const,
        url: 'https://blah',
      },
    ],
  }

  return result
}