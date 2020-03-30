import { PackageConfig } from '../model';
export declare type PackageConfigFactory = (packageDirectory: string) => Promise<PackageConfig>;
/**
 * Factory function for creating packages for a directory. The directory must contain
 * a `package.json` file.
 */
export declare const createPackageConfig: PackageConfigFactory;
//# sourceMappingURL=create-package-config.d.ts.map