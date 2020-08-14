import fs from 'fs'

import { isEmpty, split } from 'lodash'
import simpleGit, { SimpleGit } from 'simple-git'
import tmp from 'tmp'

export interface Parameters {
  branch: string
  repositoryUrl: string
  sshKey: string
}

const git: SimpleGit = simpleGit() 

const getSshCommand = (sshKeyFile: string) => `ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i ${sshKeyFile}`

const getRemote = async (options: Parameters) => {
  const { branch, repositoryUrl, sshKey } = options

  const decodedKey = Buffer.from(sshKey, 'base64')

  const tmpFile = tmp.fileSync({
    mode: 0o600,
    prefix: 'git-poller',
  })

  try {
    fs.writeFileSync(tmpFile.name, decodedKey, 'utf8')
    return await git
      .env('GIT_SSH_COMMAND', getSshCommand(tmpFile.name))
      .listRemote([repositoryUrl, `refs/heads/${branch}`])
  } finally {
    // delete the key file immediately instead of waiting for the process to exit
    tmpFile.removeCallback()
  }
}

export const handler = async () => {
  const body = { branch: '', repositoryUrl: '', sshKey: '' }
  const { branch, repositoryUrl } = body

  const remote = await getRemote(body)

  if (isEmpty(remote)) {
    throw new Error(`Branch does not exist: ${branch}`)
  }

  const lastCommit = split(remote, /\s/)[0]
  // return context
  //   .status(200)
  //   .succeed({ 
  //     branch, 
  //     lastCommit, 
  //     repositoryUrl,
  //   })
}
