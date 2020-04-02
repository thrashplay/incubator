import { MockFs } from '@thrashplay/mock-fs'

import { getAbsolutePath } from './get-absolute-path'

jest.mock('path', () => require('@thrashplay/mock-fs').path)
jest.mock('fs', () => require('@thrashplay/mock-fs').fs)
const fs = require('fs') as MockFs

describe('getAbsolutePath', () => {
  describe('on win32', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      fs.__reset('win32', 'c:\\test-cwd')
    })

    // skipping these tests, because I cannot find a good way to mock process.cwd() when called from path.resolve(...)
    it.skip.each<[string, string, string]>([
      ['relative path empty', '', 'c:\\test-cwd'],
      ['relative path non-empty', 'relative\\path', 'c:\\test-cwd\\relative\\path'],
    ])('basePath empty and: %s', (_, relative, expected) => {
      expect(getAbsolutePath('', relative)).toEqual(expected)
    })

    it.each<[string, string, string]>([
      ['relative path empty', '', 'c:\\base-path'],
      ['relative path non-empty', 'relative\\path', 'c:\\base-path\\relative\\path'],
    ])('basePath is a directory and: %s', (_, relative, expected) => {
      fs.mkdirSync('c:\\base-path', { recursive: true })
      expect(getAbsolutePath('c:\\base-path', relative)).toEqual(expected)
    })

    it.each<[string, string, string]>([
      ['relative path empty', '', 'c:\\base-path'],
      ['relative path non-empty', 'relative\\path', 'c:\\base-path\\relative\\path'],
    ])('basePath is a file and: %s', (_, relative, expected) => {
      fs.mkdirSync('c:\\base-path', { recursive: true })
      fs.writeFileSync('c:\\base-path\\file.txt', 'any content')
      expect(getAbsolutePath('c:\\base-path\\file.txt', relative)).toEqual(expected)
    })
  })

  describe('on posix', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      fs.__reset('posix', '/test-cwd')
    })

    // skipping these tests, because I cannot find a good way to mock process.cwd() when called from path.resolve(...)
    it.skip.each<[string, string, string]>([
      ['relative path empty', '', '/test-cwd'],
      ['relative path non-empty', 'relative/path', '/test-cwd/relative/path'],
    ])('basePath empty and: %s', (_, relative, expected) => {
      expect(getAbsolutePath('', relative)).toEqual(expected)
    })

    it.each<[string, string, string]>([
      ['relative path empty', '', '/base-path'],
      ['relative path non-empty', 'relative/path', '/base-path/relative/path'],
    ])('basePath is a directory and: %s', (_, relative, expected) => {
      fs.mkdirSync('/base-path', { recursive: true })
      expect(getAbsolutePath('/base-path', relative)).toEqual(expected)
    })

    it.each<[string, string, string]>([
      ['relative path empty', '', '/base-path'],
      ['relative path non-empty', 'relative/path', '/base-path/relative/path'],
    ])('basePath is a file and: %s', (_, relative, expected) => {
      fs.mkdirSync('/base-path', { recursive: true })
      fs.writeFileSync('/base-path/file.txt', 'any content')
      expect(getAbsolutePath('/base-path/file.txt', relative)).toEqual(expected)
    })
  })
})