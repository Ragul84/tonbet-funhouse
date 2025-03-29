
import { CompilerConfig, createForSourceFile } from '@ton/blueprint';
import path from 'path';

export function compile(config: CompilerConfig) {
    return createForSourceFile({
        ...config,
        pkgPath: path.dirname(require.resolve('@ton/blueprint/package.json')),
        paths: config.paths,
        sourceFile: 'contracts/TonCasino.fc',
        targetFile: 'build/TonCasino.compiled.json',
    });
}
