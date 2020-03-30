import MemoryFS from 'metro-memory-fs';
export declare type MockFs = MemoryFS & {
    __reset: (platform: 'win32' | 'posix', cwdOverride?: string) => void;
};
//# sourceMappingURL=types.d.ts.map