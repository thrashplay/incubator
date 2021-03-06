declare module 'metro-memory-fs' {
  import { 
    Dir,
    Dirent,
    FSWatcher,
    MakeDirectoryOptions,
    NoParamCallback,
    OpenDirOptions,
    PathLike,
    ReadStream,
    RmDirAsyncOptions,
    RmDirOptions,
    Stats,
    symlink,
    WriteFileOptions,
    WriteStream,
  } from 'fs'

  class MemoryFs {

    /**
   * Asynchronous rename(2) - Change the name or location of a file or directory.
   * @param oldPath A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * @param newPath A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   */
    rename(oldPath: PathLike, newPath: PathLike, callback: NoParamCallback): void;

    /**
   * Synchronous rename(2) - Change the name or location of a file or directory.
   * @param oldPath A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * @param newPath A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   */
    renameSync(oldPath: PathLike, newPath: PathLike): void;

    /**
   * Asynchronous truncate(2) - Truncate a file to a specified length.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param len If not specified, defaults to `0`.
   */
    truncate(path: PathLike, len: number | undefined | null, callback: NoParamCallback): void;

    /**
   * Asynchronous truncate(2) - Truncate a file to a specified length.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   */
    truncate(path: PathLike, callback: NoParamCallback): void;

    /**
   * Synchronous truncate(2) - Truncate a file to a specified length.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param len If not specified, defaults to `0`.
   */
    truncateSync(path: PathLike, len?: number | null): void;

    /**
   * Asynchronous ftruncate(2) - Truncate a file to a specified length.
   * @param fd A file descriptor.
   * @param len If not specified, defaults to `0`.
   */
    ftruncate(fd: number, len: number | undefined | null, callback: NoParamCallback): void;

    /**
   * Asynchronous ftruncate(2) - Truncate a file to a specified length.
   * @param fd A file descriptor.
   */
    ftruncate(fd: number, callback: NoParamCallback): void;

    /**
   * Synchronous ftruncate(2) - Truncate a file to a specified length.
   * @param fd A file descriptor.
   * @param len If not specified, defaults to `0`.
   */
    ftruncateSync(fd: number, len?: number | null): void;

    /**
   * Asynchronous chown(2) - Change ownership of a file.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    chown(path: PathLike, uid: number, gid: number, callback: NoParamCallback): void;

    /**
   * Synchronous chown(2) - Change ownership of a file.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    chownSync(path: PathLike, uid: number, gid: number): void;

    /**
   * Asynchronous fchown(2) - Change ownership of a file.
   * @param fd A file descriptor.
   */
    fchown(fd: number, uid: number, gid: number, callback: NoParamCallback): void;

    /**
   * Synchronous fchown(2) - Change ownership of a file.
   * @param fd A file descriptor.
   */
    fchownSync(fd: number, uid: number, gid: number): void;

    /**
   * Asynchronous lchown(2) - Change ownership of a file. Does not dereference symbolic links.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    lchown(path: PathLike, uid: number, gid: number, callback: NoParamCallback): void;

    /**
   * Synchronous lchown(2) - Change ownership of a file. Does not dereference symbolic links.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    lchownSync(path: PathLike, uid: number, gid: number): void;

    /**
   * Asynchronous chmod(2) - Change permissions of a file.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
   */
    chmod(path: PathLike, mode: string | number, callback: NoParamCallback): void;

    /**
   * Synchronous chmod(2) - Change permissions of a file.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
   */
    chmodSync(path: PathLike, mode: string | number): void;

    /**
   * Asynchronous fchmod(2) - Change permissions of a file.
   * @param fd A file descriptor.
   * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
   */
    fchmod(fd: number, mode: string | number, callback: NoParamCallback): void;

    /**
   * Synchronous fchmod(2) - Change permissions of a file.
   * @param fd A file descriptor.
   * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
   */
    fchmodSync(fd: number, mode: string | number): void;

    /**
   * Asynchronous lchmod(2) - Change permissions of a file. Does not dereference symbolic links.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
   */
    lchmod(path: PathLike, mode: string | number, callback: NoParamCallback): void;

    /**
   * Synchronous lchmod(2) - Change permissions of a file. Does not dereference symbolic links.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
   */
    lchmodSync(path: PathLike, mode: string | number): void;

    /**
   * Asynchronous stat(2) - Get file status.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    stat(path: PathLike, callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void): void;

    /**
   * Synchronous stat(2) - Get file status.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    statSync(path: PathLike): Stats;

    /**
   * Asynchronous fstat(2) - Get file status.
   * @param fd A file descriptor.
   */
    fstat(fd: number, callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void): void;

    /**
   * Synchronous fstat(2) - Get file status.
   * @param fd A file descriptor.
   */
    fstatSync(fd: number): Stats;

    /**
   * Asynchronous lstat(2) - Get file status. Does not dereference symbolic links.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    lstat(path: PathLike, callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void): void;

    /**
   * Synchronous lstat(2) - Get file status. Does not dereference symbolic links.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    lstatSync(path: PathLike): Stats;

    /**
   * Asynchronous link(2) - Create a new link (also known as a hard link) to an existing file.
   * @param existingPath A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param newPath A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    link(existingPath: PathLike, newPath: PathLike, callback: NoParamCallback): void;

    /**
   * Synchronous link(2) - Create a new link (also known as a hard link) to an existing file.
   * @param existingPath A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param newPath A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    linkSync(existingPath: PathLike, newPath: PathLike): void;

    /**
   * Asynchronous symlink(2) - Create a new symbolic link to an existing file.
   * @param target A path to an existing file. If a URL is provided, it must use the `file:` protocol.
   * @param path A path to the new symlink. If a URL is provided, it must use the `file:` protocol.
   * @param type May be set to `'dir'`, `'file'`, or `'junction'` (default is `'file'`) and is only available on Windows (ignored on other platforms).
   * When using `'junction'`, the `target` argument will automatically be normalized to an absolute path.
   */
    symlink(target: PathLike, path: PathLike, type: symlink.Type | undefined | null, callback: NoParamCallback): void;

    /**
   * Asynchronous symlink(2) - Create a new symbolic link to an existing file.
   * @param target A path to an existing file. If a URL is provided, it must use the `file:` protocol.
   * @param path A path to the new symlink. If a URL is provided, it must use the `file:` protocol.
   */
    symlink(target: PathLike, path: PathLike, callback: NoParamCallback): void;

    /**
   * Synchronous symlink(2) - Create a new symbolic link to an existing file.
   * @param target A path to an existing file. If a URL is provided, it must use the `file:` protocol.
   * @param path A path to the new symlink. If a URL is provided, it must use the `file:` protocol.
   * @param type May be set to `'dir'`, `'file'`, or `'junction'` (default is `'file'`) and is only available on Windows (ignored on other platforms).
   * When using `'junction'`, the `target` argument will automatically be normalized to an absolute path.
   */
    symlinkSync(target: PathLike, path: PathLike, type?: symlink.Type | null): void;

    /**
   * Asynchronous readlink(2) - read value of a symbolic link.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    readlink(
      path: PathLike,
      options: { encoding?: BufferEncoding | null } | BufferEncoding | undefined | null,
      callback: (err: NodeJS.ErrnoException | null, linkString: string) => void
    ): void;

    /**
   * Asynchronous readlink(2) - read value of a symbolic link.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    readlink(path: PathLike, options: { encoding: 'buffer' } | 'buffer', callback: (err: NodeJS.ErrnoException | null, linkString: Buffer) => void): void;

    /**
   * Asynchronous readlink(2) - read value of a symbolic link.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    readlink(path: PathLike, options: { encoding?: string | null } | string | undefined | null, callback: (err: NodeJS.ErrnoException | null, linkString: string | Buffer) => void): void;

    /**
   * Asynchronous readlink(2) - read value of a symbolic link.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    readlink(path: PathLike, callback: (err: NodeJS.ErrnoException | null, linkString: string) => void): void;

    /**
   * Synchronous readlink(2) - read value of a symbolic link.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    readlinkSync(path: PathLike, options?: { encoding?: BufferEncoding | null } | BufferEncoding | null): string;

    /**
   * Synchronous readlink(2) - read value of a symbolic link.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    readlinkSync(path: PathLike, options: { encoding: 'buffer' } | 'buffer'): Buffer;

    /**
   * Synchronous readlink(2) - read value of a symbolic link.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    readlinkSync(path: PathLike, options?: { encoding?: string | null } | string | null): string | Buffer;

    /**
   * Asynchronous realpath(3) - return the canonicalized absolute pathname.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    realpath(
      path: PathLike,
      options: { encoding?: BufferEncoding | null } | BufferEncoding | undefined | null,
      callback: (err: NodeJS.ErrnoException | null, resolvedPath: string) => void
    ): void;

    /**
   * Asynchronous realpath(3) - return the canonicalized absolute pathname.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    realpath(path: PathLike, options: { encoding: 'buffer' } | 'buffer', callback: (err: NodeJS.ErrnoException | null, resolvedPath: Buffer) => void): void;

    /**
   * Asynchronous realpath(3) - return the canonicalized absolute pathname.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    realpath(path: PathLike, options: { encoding?: string | null } | string | undefined | null, callback: (err: NodeJS.ErrnoException | null, resolvedPath: string | Buffer) => void): void;

    /**
   * Asynchronous realpath(3) - return the canonicalized absolute pathname.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    realpath(path: PathLike, callback: (err: NodeJS.ErrnoException | null, resolvedPath: string) => void): void;

    /**
   * Synchronous realpath(3) - return the canonicalized absolute pathname.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    realpathSync(path: PathLike, options?: { encoding?: BufferEncoding | null } | BufferEncoding | null): string;

    /**
   * Synchronous realpath(3) - return the canonicalized absolute pathname.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    realpathSync(path: PathLike, options: { encoding: 'buffer' } | 'buffer'): Buffer;

    /**
   * Synchronous realpath(3) - return the canonicalized absolute pathname.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    realpathSync(path: PathLike, options?: { encoding?: string | null } | string | null): string | Buffer;

    /**
   * Asynchronous unlink(2) - delete a name and possibly the file it refers to.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    unlink(path: PathLike, callback: NoParamCallback): void;

    /**
   * Synchronous unlink(2) - delete a name and possibly the file it refers to.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    unlinkSync(path: PathLike): void;

    /**
   * Asynchronous rmdir(2) - delete a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    rmdir(path: PathLike, callback: NoParamCallback): void;
    rmdir(path: PathLike, options: RmDirAsyncOptions, callback: NoParamCallback): void;

    /**
   * Synchronous rmdir(2) - delete a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    rmdirSync(path: PathLike, options?: RmDirOptions): void;

    /**
   * Asynchronous mkdir(2) - create a directory.
   * 
   * NOTE: metro-memory-fs does NOT support the directory options that were added in NodeJS 10.12.0
   * 
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options Either the file mode, or an object optionally specifying the file mode and whether parent folders
   * should be created. If a string is passed, it is parsed as an octal integer. If not specified, defaults to `0o777`.
   */
    mkdir(path: PathLike, options:  number | string | MakeDirectoryOptions | undefined | null, callback: NoParamCallback): void;

    /**
   * Asynchronous mkdir(2) - create a directory with a mode of `0o777`.
   * 
   * NOTE: metro-memory-fs does NOT support the directory options that were added in NodeJS 10.12.0
   * 
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    mkdir(path: PathLike, callback: NoParamCallback): void;

    /**
   * Synchronous mkdir(2) - create a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options Either the file mode, or an object optionally specifying the file mode and whether parent folders
   * should be created. If a string is passed, it is parsed as an octal integer. If not specified, defaults to `0o777`.
   */
    mkdirSync(path: PathLike, options?: number | string | MakeDirectoryOptions | null): void;

    /**
   * Asynchronously creates a unique temporary directory.
   * Generates six random characters to be appended behind a required prefix to create a unique temporary directory.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    mkdtemp(prefix: string, options: { encoding?: BufferEncoding | null } | BufferEncoding | undefined | null, callback: (err: NodeJS.ErrnoException | null, folder: string) => void): void;

    /**
   * Asynchronously creates a unique temporary directory.
   * Generates six random characters to be appended behind a required prefix to create a unique temporary directory.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    mkdtemp(prefix: string, options: 'buffer' | { encoding: 'buffer' }, callback: (err: NodeJS.ErrnoException | null, folder: Buffer) => void): void;

    /**
   * Asynchronously creates a unique temporary directory.
   * Generates six random characters to be appended behind a required prefix to create a unique temporary directory.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    mkdtemp(prefix: string, options: { encoding?: string | null } | string | undefined | null, callback: (err: NodeJS.ErrnoException | null, folder: string | Buffer) => void): void;

    /**
   * Asynchronously creates a unique temporary directory.
   * Generates six random characters to be appended behind a required prefix to create a unique temporary directory.
   */
    mkdtemp(prefix: string, callback: (err: NodeJS.ErrnoException | null, folder: string) => void): void;

    /**
   * Synchronously creates a unique temporary directory.
   * Generates six random characters to be appended behind a required prefix to create a unique temporary directory.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    mkdtempSync(prefix: string, options?: { encoding?: BufferEncoding | null } | BufferEncoding | null): string;

    /**
   * Synchronously creates a unique temporary directory.
   * Generates six random characters to be appended behind a required prefix to create a unique temporary directory.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    mkdtempSync(prefix: string, options: { encoding: 'buffer' } | 'buffer'): Buffer;

    /**
   * Synchronously creates a unique temporary directory.
   * Generates six random characters to be appended behind a required prefix to create a unique temporary directory.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    mkdtempSync(prefix: string, options?: { encoding?: string | null } | string | null): string | Buffer;

    /**
   * Asynchronous readdir(3) - read a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    readdir(
      path: PathLike,
      options: { encoding: BufferEncoding | null; withFileTypes?: false } | BufferEncoding | undefined | null,
      callback: (err: NodeJS.ErrnoException | null, files: string[]) => void,
    ): void;

    /**
   * Asynchronous readdir(3) - read a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    readdir(path: PathLike, options: { encoding: 'buffer'; withFileTypes?: false } | 'buffer', callback: (err: NodeJS.ErrnoException | null, files: Buffer[]) => void): void;

    /**
   * Asynchronous readdir(3) - read a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    readdir(
      path: PathLike,
      options: { encoding?: string | null; withFileTypes?: false } | string | undefined | null,
      callback: (err: NodeJS.ErrnoException | null, files: string[] | Buffer[]) => void,
    ): void;

    /**
   * Asynchronous readdir(3) - read a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    readdir(path: PathLike, callback: (err: NodeJS.ErrnoException | null, files: string[]) => void): void;

    /**
   * Asynchronous readdir(3) - read a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options If called with `withFileTypes: true` the result data will be an array of Dirent.
   */
    readdir(path: PathLike, options: { encoding?: string | null; withFileTypes: true }, callback: (err: NodeJS.ErrnoException | null, files: Dirent[]) => void): void;

    /**
   * Synchronous readdir(3) - read a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    readdirSync(path: PathLike, options?: { encoding: BufferEncoding | null; withFileTypes?: false } | BufferEncoding | null): string[];

    /**
   * Synchronous readdir(3) - read a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    readdirSync(path: PathLike, options: { encoding: 'buffer'; withFileTypes?: false } | 'buffer'): Buffer[];

    /**
   * Synchronous readdir(3) - read a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
   */
    readdirSync(path: PathLike, options?: { encoding?: string | null; withFileTypes?: false } | string | null): string[] | Buffer[];

    /**
   * Synchronous readdir(3) - read a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options If called with `withFileTypes: true` the result data will be an array of Dirent.
   */
    readdirSync(path: PathLike, options: { encoding?: string | null; withFileTypes: true }): Dirent[];

    /**
   * Asynchronous close(2) - close a file descriptor.
   * @param fd A file descriptor.
   */
    close(fd: number, callback: NoParamCallback): void;

    /**
   * Synchronous close(2) - close a file descriptor.
   * @param fd A file descriptor.
   */
    closeSync(fd: number): void;

    /**
   * Asynchronous open(2) - open and possibly create a file.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param mode A file mode. If a string is passed, it is parsed as an octal integer. If not supplied, defaults to `0o666`.
   */
    open(path: PathLike, flags: string | number, mode: string | number | undefined | null, callback: (err: NodeJS.ErrnoException | null, fd: number) => void): void;

    /**
   * Asynchronous open(2) - open and possibly create a file. If the file is created, its mode will be `0o666`.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   */
    open(path: PathLike, flags: string | number, callback: (err: NodeJS.ErrnoException | null, fd: number) => void): void;

    /**
   * Synchronous open(2) - open and possibly create a file, returning a file descriptor..
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param mode A file mode. If a string is passed, it is parsed as an octal integer. If not supplied, defaults to `0o666`.
   */
    openSync(path: PathLike, flags: string | number, mode?: string | number | null): number;

    /**
   * Asynchronously change file timestamps of the file referenced by the supplied path.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param atime The last access time. If a string is provided, it will be coerced to number.
   * @param mtime The last modified time. If a string is provided, it will be coerced to number.
   */
    utimes(path: PathLike, atime: string | number | Date, mtime: string | number | Date, callback: NoParamCallback): void;

    /**
   * Synchronously change file timestamps of the file referenced by the supplied path.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param atime The last access time. If a string is provided, it will be coerced to number.
   * @param mtime The last modified time. If a string is provided, it will be coerced to number.
   */
    utimesSync(path: PathLike, atime: string | number | Date, mtime: string | number | Date): void;

    /**
   * Asynchronously change file timestamps of the file referenced by the supplied file descriptor.
   * @param fd A file descriptor.
   * @param atime The last access time. If a string is provided, it will be coerced to number.
   * @param mtime The last modified time. If a string is provided, it will be coerced to number.
   */
    futimes(fd: number, atime: string | number | Date, mtime: string | number | Date, callback: NoParamCallback): void;

    /**
   * Synchronously change file timestamps of the file referenced by the supplied file descriptor.
   * @param fd A file descriptor.
   * @param atime The last access time. If a string is provided, it will be coerced to number.
   * @param mtime The last modified time. If a string is provided, it will be coerced to number.
   */
    futimesSync(fd: number, atime: string | number | Date, mtime: string | number | Date): void;

    /**
   * Asynchronous fsync(2) - synchronize a file's in-core state with the underlying storage device.
   * @param fd A file descriptor.
   */
    fsync(fd: number, callback: NoParamCallback): void;

    /**
   * Synchronous fsync(2) - synchronize a file's in-core state with the underlying storage device.
   * @param fd A file descriptor.
   */
    fsyncSync(fd: number): void;

    /**
   * Asynchronously writes `buffer` to the file referenced by the supplied file descriptor.
   * @param fd A file descriptor.
   * @param offset The part of the buffer to be written. If not supplied, defaults to `0`.
   * @param length The number of bytes to write. If not supplied, defaults to `buffer.length - offset`.
   * @param position The offset from the beginning of the file where this data should be written. If not supplied, defaults to the current position.
   */
    write<TBuffer extends NodeJS.ArrayBufferView>(
      fd: number,
      buffer: TBuffer,
      offset: number | undefined | null,
      length: number | undefined | null,
      position: number | undefined | null,
      callback: (err: NodeJS.ErrnoException | null, written: number, buffer: TBuffer) => void,
    ): void;

    /**
   * Asynchronously writes `buffer` to the file referenced by the supplied file descriptor.
   * @param fd A file descriptor.
   * @param offset The part of the buffer to be written. If not supplied, defaults to `0`.
   * @param length The number of bytes to write. If not supplied, defaults to `buffer.length - offset`.
   */
    write<TBuffer extends NodeJS.ArrayBufferView>(
      fd: number,
      buffer: TBuffer,
      offset: number | undefined | null,
      length: number | undefined | null,
      callback: (err: NodeJS.ErrnoException | null, written: number, buffer: TBuffer) => void,
    ): void;

    /**
   * Asynchronously writes `buffer` to the file referenced by the supplied file descriptor.
   * @param fd A file descriptor.
   * @param offset The part of the buffer to be written. If not supplied, defaults to `0`.
   */
    write<TBuffer extends NodeJS.ArrayBufferView>(
      fd: number,
      buffer: TBuffer,
      offset: number | undefined | null,
      callback: (err: NodeJS.ErrnoException | null, written: number, buffer: TBuffer) => void
    ): void;

    /**
   * Asynchronously writes `buffer` to the file referenced by the supplied file descriptor.
   * @param fd A file descriptor.
   */
    write<TBuffer extends NodeJS.ArrayBufferView>(fd: number, buffer: TBuffer, callback: (err: NodeJS.ErrnoException | null, written: number, buffer: TBuffer) => void): void;

    /**
   * Asynchronously writes `string` to the file referenced by the supplied file descriptor.
   * @param fd A file descriptor.
   * @param string A string to write. If something other than a string is supplied it will be coerced to a string.
   * @param position The offset from the beginning of the file where this data should be written. If not supplied, defaults to the current position.
   * @param encoding The expected string encoding.
   */
    write(
      fd: number,
      string: any,
      position: number | undefined | null,
      encoding: string | undefined | null,
      callback: (err: NodeJS.ErrnoException | null, written: number, str: string) => void,
    ): void;

    /**
   * Asynchronously writes `string` to the file referenced by the supplied file descriptor.
   * @param fd A file descriptor.
   * @param string A string to write. If something other than a string is supplied it will be coerced to a string.
   * @param position The offset from the beginning of the file where this data should be written. If not supplied, defaults to the current position.
   */
    write(fd: number, string: any, position: number | undefined | null, callback: (err: NodeJS.ErrnoException | null, written: number, str: string) => void): void;

    /**
   * Asynchronously writes `string` to the file referenced by the supplied file descriptor.
   * @param fd A file descriptor.
   * @param string A string to write. If something other than a string is supplied it will be coerced to a string.
   */
    write(fd: number, string: any, callback: (err: NodeJS.ErrnoException | null, written: number, str: string) => void): void;

    /**
   * Synchronously writes `buffer` to the file referenced by the supplied file descriptor, returning the number of bytes written.
   * @param fd A file descriptor.
   * @param offset The part of the buffer to be written. If not supplied, defaults to `0`.
   * @param length The number of bytes to write. If not supplied, defaults to `buffer.length - offset`.
   * @param position The offset from the beginning of the file where this data should be written. If not supplied, defaults to the current position.
   */
    writeSync(fd: number, buffer: NodeJS.ArrayBufferView, offset?: number | null, length?: number | null, position?: number | null): number;

    /**
   * Synchronously writes `string` to the file referenced by the supplied file descriptor, returning the number of bytes written.
   * @param fd A file descriptor.
   * @param string A string to write. If something other than a string is supplied it will be coerced to a string.
   * @param position The offset from the beginning of the file where this data should be written. If not supplied, defaults to the current position.
   * @param encoding The expected string encoding.
   */
    writeSync(fd: number, string: any, position?: number | null, encoding?: string | null): number;

    /**
   * Asynchronously reads data from the file referenced by the supplied file descriptor.
   * @param fd A file descriptor.
   * @param buffer The buffer that the data will be written to.
   * @param offset The offset in the buffer at which to start writing.
   * @param length The number of bytes to read.
   * @param position The offset from the beginning of the file from which data should be read. If `null`, data will be read from the current position.
   */
    read<TBuffer extends NodeJS.ArrayBufferView>(
      fd: number,
      buffer: TBuffer,
      offset: number,
      length: number,
      position: number | null,
      callback: (err: NodeJS.ErrnoException | null, bytesRead: number, buffer: TBuffer) => void,
    ): void;

    /**
   * Synchronously reads data from the file referenced by the supplied file descriptor, returning the number of bytes read.
   * @param fd A file descriptor.
   * @param buffer The buffer that the data will be written to.
   * @param offset The offset in the buffer at which to start writing.
   * @param length The number of bytes to read.
   * @param position The offset from the beginning of the file from which data should be read. If `null`, data will be read from the current position.
   */
    readSync(fd: number, buffer: NodeJS.ArrayBufferView, offset: number, length: number, position: number | null): number;

    /**
   * Asynchronously reads the entire contents of a file.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
   * @param options An object that may contain an optional flag.
   * If a flag is not provided, it defaults to `'r'`.
   */
    readFile(path: PathLike | number, options: { encoding?: null; flag?: string; } | undefined | null, callback: (err: NodeJS.ErrnoException | null, data: Buffer) => void): void;

    /**
   * Asynchronously reads the entire contents of a file.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
   * @param options Either the encoding for the result, or an object that contains the encoding and an optional flag.
   * If a flag is not provided, it defaults to `'r'`.
   */
    readFile(path: PathLike | number, options: { encoding: string; flag?: string; } | string, callback: (err: NodeJS.ErrnoException | null, data: string) => void): void;

    /**
   * Asynchronously reads the entire contents of a file.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
   * @param options Either the encoding for the result, or an object that contains the encoding and an optional flag.
   * If a flag is not provided, it defaults to `'r'`.
   */
    readFile(
      path: PathLike | number,
      options: { encoding?: string | null; flag?: string; } | string | undefined | null,
      callback: (err: NodeJS.ErrnoException | null, data: string | Buffer) => void,
    ): void;

    /**
   * Asynchronously reads the entire contents of a file.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
   */
    readFile(path: PathLike | number, callback: (err: NodeJS.ErrnoException | null, data: Buffer) => void): void;

    /**
   * Synchronously reads the entire contents of a file.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
   * @param options An object that may contain an optional flag. If a flag is not provided, it defaults to `'r'`.
   */
    readFileSync(path: PathLike | number, options?: { encoding?: null; flag?: string; } | null): Buffer;

    /**
   * Synchronously reads the entire contents of a file.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
   * @param options Either the encoding for the result, or an object that contains the encoding and an optional flag.
   * If a flag is not provided, it defaults to `'r'`.
   */
    readFileSync(path: PathLike | number, options: { encoding: string; flag?: string; } | string): string;

    /**
   * Synchronously reads the entire contents of a file.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
   * @param options Either the encoding for the result, or an object that contains the encoding and an optional flag.
   * If a flag is not provided, it defaults to `'r'`.
   */
    readFileSync(path: PathLike | number, options?: { encoding?: string | null; flag?: string; } | string | null): string | Buffer;

    /**
   * Asynchronously writes data to a file, replacing the file if it already exists.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
   * @param data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
   * @param options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
   * If `encoding` is not supplied, the default of `'utf8'` is used.
   * If `mode` is not supplied, the default of `0o666` is used.
   * If `mode` is a string, it is parsed as an octal integer.
   * If `flag` is not supplied, the default of `'w'` is used.
   */
    writeFile(path: PathLike | number, data: any, options: WriteFileOptions, callback: NoParamCallback): void;

    /**
   * Asynchronously writes data to a file, replacing the file if it already exists.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
   * @param data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
   */
    writeFile(path: PathLike | number, data: any, callback: NoParamCallback): void;

    /**
   * Synchronously writes data to a file, replacing the file if it already exists.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
   * @param data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
   * @param options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
   * If `encoding` is not supplied, the default of `'utf8'` is used.
   * If `mode` is not supplied, the default of `0o666` is used.
   * If `mode` is a string, it is parsed as an octal integer.
   * If `flag` is not supplied, the default of `'w'` is used.
   */
    writeFileSync(path: PathLike | number, data: any, options?: WriteFileOptions): void;

    /**
   * Asynchronously append data to a file, creating the file if it does not exist.
   * @param file A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
   * @param data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
   * @param options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
   * If `encoding` is not supplied, the default of `'utf8'` is used.
   * If `mode` is not supplied, the default of `0o666` is used.
   * If `mode` is a string, it is parsed as an octal integer.
   * If `flag` is not supplied, the default of `'a'` is used.
   */
    appendFile(file: PathLike | number, data: any, options: WriteFileOptions, callback: NoParamCallback): void;

    /**
   * Asynchronously append data to a file, creating the file if it does not exist.
   * @param file A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
   * @param data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
   */
    appendFile(file: PathLike | number, data: any, callback: NoParamCallback): void;

    /**
   * Synchronously append data to a file, creating the file if it does not exist.
   * @param file A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
   * @param data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
   * @param options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
   * If `encoding` is not supplied, the default of `'utf8'` is used.
   * If `mode` is not supplied, the default of `0o666` is used.
   * If `mode` is a string, it is parsed as an octal integer.
   * If `flag` is not supplied, the default of `'a'` is used.
   */
    appendFileSync(file: PathLike | number, data: any, options?: WriteFileOptions): void;

    /**
   * Watch for changes on `filename`. The callback `listener` will be called each time the file is accessed.
   */
    watchFile(filename: PathLike, options: { persistent?: boolean; interval?: number; } | undefined, listener: (curr: Stats, prev: Stats) => void): void;

    /**
   * Watch for changes on `filename`. The callback `listener` will be called each time the file is accessed.
   * @param filename A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   */
    watchFile(filename: PathLike, listener: (curr: Stats, prev: Stats) => void): void;

    /**
   * Stop watching for changes on `filename`.
   * @param filename A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   */
    unwatchFile(filename: PathLike, listener?: (curr: Stats, prev: Stats) => void): void;

    /**
   * Watch for changes on `filename`, where `filename` is either a file or a directory, returning an `FSWatcher`.
   * @param filename A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * @param options Either the encoding for the filename provided to the listener, or an object optionally specifying encoding, persistent, and recursive options.
   * If `encoding` is not supplied, the default of `'utf8'` is used.
   * If `persistent` is not supplied, the default of `true` is used.
   * If `recursive` is not supplied, the default of `false` is used.
   */
    watch(
      filename: PathLike,
      options: { encoding?: BufferEncoding | null, persistent?: boolean, recursive?: boolean } | BufferEncoding | undefined | null,
      listener?: (event: string, filename: string) => void,
    ): FSWatcher;

    /**
   * Watch for changes on `filename`, where `filename` is either a file or a directory, returning an `FSWatcher`.
   * @param filename A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * @param options Either the encoding for the filename provided to the listener, or an object optionally specifying encoding, persistent, and recursive options.
   * If `encoding` is not supplied, the default of `'utf8'` is used.
   * If `persistent` is not supplied, the default of `true` is used.
   * If `recursive` is not supplied, the default of `false` is used.
   */
    watch(filename: PathLike, options: { encoding: 'buffer', persistent?: boolean, recursive?: boolean } | 'buffer', listener?: (event: string, filename: Buffer) => void): FSWatcher;

    /**
   * Watch for changes on `filename`, where `filename` is either a file or a directory, returning an `FSWatcher`.
   * @param filename A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   * @param options Either the encoding for the filename provided to the listener, or an object optionally specifying encoding, persistent, and recursive options.
   * If `encoding` is not supplied, the default of `'utf8'` is used.
   * If `persistent` is not supplied, the default of `true` is used.
   * If `recursive` is not supplied, the default of `false` is used.
   */
    watch(
      filename: PathLike,
      options: { encoding?: string | null, persistent?: boolean, recursive?: boolean } | string | null,
      listener?: (event: string, filename: string | Buffer) => void,
    ): FSWatcher;

    /**
   * Watch for changes on `filename`, where `filename` is either a file or a directory, returning an `FSWatcher`.
   * @param filename A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   */
    watch(filename: PathLike, listener?: (event: string, filename: string) => any): FSWatcher;

    /**
   * Asynchronously tests whether or not the given path exists by checking with the file system.
   * @deprecated
   * @param path A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   */
    exists(path: PathLike, callback: (exists: boolean) => void): void;

    /**
   * Synchronously tests whether or not the given path exists by checking with the file system.
   * @param path A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   */
    existsSync(path: PathLike): boolean;

    /**
   * Asynchronously tests a user's permissions for the file specified by path.
   * @param path A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   */
    access(path: PathLike, mode: number | undefined, callback: NoParamCallback): void;

    /**
   * Asynchronously tests a user's permissions for the file specified by path.
   * @param path A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   */
    access(path: PathLike, callback: NoParamCallback): void;

    /**
   * Synchronously tests a user's permissions for the file specified by path.
   * @param path A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   */
    accessSync(path: PathLike, mode?: number): void;

    /**
   * Returns a new `ReadStream` object.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   */
    createReadStream(path: PathLike, options?: string | {
      flags?: string;
      encoding?: string;
      fd?: number;
      mode?: number;
      autoClose?: boolean;
      /**
       * @default false
       */
      emitClose?: boolean;
      start?: number;
      end?: number;
      highWaterMark?: number;
    }): ReadStream;

    /**
   * Returns a new `WriteStream` object.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * URL support is _experimental_.
   */
    createWriteStream(path: PathLike, options?: string | {
      flags?: string;
      encoding?: string;
      fd?: number;
      mode?: number;
      autoClose?: boolean;
      start?: number;
      highWaterMark?: number;
    }): WriteStream;

    /**
   * Asynchronous fdatasync(2) - synchronize a file's in-core state with storage device.
   * @param fd A file descriptor.
   */
    fdatasync(fd: number, callback: NoParamCallback): void;

    /**
   * Synchronous fdatasync(2) - synchronize a file's in-core state with storage device.
   * @param fd A file descriptor.
   */
    fdatasyncSync(fd: number): void;

    /**
   * Asynchronously copies src to dest. By default, dest is overwritten if it already exists.
   * No arguments other than a possible exception are given to the callback function.
   * Node.js makes no guarantees about the atomicity of the copy operation.
   * If an error occurs after the destination file has been opened for writing, Node.js will attempt
   * to remove the destination.
   * @param src A path to the source file.
   * @param dest A path to the destination file.
   */
    copyFile(src: PathLike, dest: PathLike, callback: NoParamCallback): void;
    /**
   * Asynchronously copies src to dest. By default, dest is overwritten if it already exists.
   * No arguments other than a possible exception are given to the callback function.
   * Node.js makes no guarantees about the atomicity of the copy operation.
   * If an error occurs after the destination file has been opened for writing, Node.js will attempt
   * to remove the destination.
   * @param src A path to the source file.
   * @param dest A path to the destination file.
   * @param flags An integer that specifies the behavior of the copy operation. The only supported flag is fs.constants.COPYFILE_EXCL, which causes the copy operation to fail if dest already exists.
   */
    copyFile(src: PathLike, dest: PathLike, flags: number, callback: NoParamCallback): void;

    /**
   * Synchronously copies src to dest. By default, dest is overwritten if it already exists.
   * Node.js makes no guarantees about the atomicity of the copy operation.
   * If an error occurs after the destination file has been opened for writing, Node.js will attempt
   * to remove the destination.
   * @param src A path to the source file.
   * @param dest A path to the destination file.
   * @param flags An optional integer that specifies the behavior of the copy operation.
   * The only supported flag is fs.constants.COPYFILE_EXCL, which causes the copy operation to fail if dest already exists.
   */
    copyFileSync(src: PathLike, dest: PathLike, flags?: number): void;

    /**
   * Write an array of ArrayBufferViews to the file specified by fd using writev().
   * position is the offset from the beginning of the file where this data should be written.
   * It is unsafe to use fs.writev() multiple times on the same file without waiting for the callback. For this scenario, use fs.createWriteStream().
   * On Linux, positional writes don't work when the file is opened in append mode.
   * The kernel ignores the position argument and always appends the data to the end of the file.
   */
    writev(
      fd: number,
      buffers: NodeJS.ArrayBufferView[],
      cb: (err: NodeJS.ErrnoException | null, bytesWritten: number, buffers: NodeJS.ArrayBufferView[]) => void
    ): void;
    writev(
      fd: number,
      buffers: NodeJS.ArrayBufferView[],
      position: number,
      cb: (err: NodeJS.ErrnoException | null, bytesWritten: number, buffers: NodeJS.ArrayBufferView[]) => void
    ): void;
    /**
   * See `writev`.
   */
    writevSync(fd: number, buffers: NodeJS.ArrayBufferView[], position?: number): number;

    opendirSync(path: string, options?: OpenDirOptions): Dir;

    opendir(path: string, cb: (err: NodeJS.ErrnoException | null, dir: Dir) => void): void;
    opendir(path: string, options: OpenDirOptions, cb: (err: NodeJS.ErrnoException | null, dir: Dir) => void): void;

    // functions added in metro-memory-fs
    constructor(options?: Options) 
    reset(): void;
  }

  type Options = {
    /**
     * On a win32 FS, there will be drives at the root, like "C:\". On a Posix FS,
     * there is only one root "/".
     */
    platform?: 'win32' | 'posix',
    /**
     * To be able to use relative paths, this function must provide the current
     * working directory. A possible implementation is to forward `process.cwd`,
     * but one must ensure to create that directory in the memory FS (no
     * directory is ever created automatically).
     */
    cwd?: () => string,
  };

  export = MemoryFs
}
