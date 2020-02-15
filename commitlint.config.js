const { map } = require('lodash')
const { getPackageJsons } = require('@thrashplay/project-utils')

const getPackages = () => getPackageJsons(__dirname).then((packageJsons) => {
  return map(packageJsons, (packageJson) => packageJson.name)
})

module.exports = (async () => ({
  extends: [
    '@commitlint/config-conventional',
  ],
  rules: {
    'body-max-line-length': [2, 'always', 100],
    'footer-max-line-length': [2, 'always', 100],
    'header-full-stop': [2, 'always', '.'],
    'header-max-length': [2, 'always', 100],
    'scope-enum': [2, 'always', [await getPackages()]],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-full-stop': [2, 'always', '.'],
  },
}))()
