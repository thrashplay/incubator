import MemoryFS from 'metro-memory-fs'

export type MockFs = MemoryFS & {
  __reset: (platform: 'win32' | 'posix', cwdOverride?: string) => void
}