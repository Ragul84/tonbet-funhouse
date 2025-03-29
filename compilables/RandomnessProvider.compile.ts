
import { CompilerConfig, createForSourceFile } from '@ton/blueprint';
import * as fs from 'fs';
import path from 'path';

export function compile(config: CompilerConfig) {
    return createForSourceFile({
        ...config,
        pkgPath: path.dirname(require.resolve('@ton/blueprint/package.json')),
        paths: config.paths,
        sourceFile: 'contracts/RandomnessProvider.fc',
        targetFile: 'build/RandomnessProvider.compiled.json',
    });
}
