import { PackageJson } from '../model';
export declare type PackageJsonFactory = (packageDirectory: string) => Promise<PackageJson>;
/**
 * Factory function for creating the package JSON object for a directory. The directory must contain
 * a `package.json` file.
 */
export declare const createPackageJson: PackageJsonFactory;
//# sourceMappingURL=create-package-json.d.ts.map