#!/usr/bin/env node

import { log } from 'utils'
import { existsSync } from 'node:fs'
import { buildSync } from 'esbuild'
import * as ts from "typescript"

const compile = (fileNames: string[], options: ts.CompilerOptions): void => {
    // Create a Program with an in-memory emit
    const createdFiles = {}
    const host = ts.createCompilerHost(options);
    host.writeFile = (fileName: string, contents: string) => createdFiles[fileName] = contents

    // Prepare and emit the d.ts files
    const program = ts.createProgram(fileNames, options, host);
    program.emit();

    // Loop through all the input files
    fileNames.forEach(file => {
        console.log("### JavaScript\n")
        console.log(host.readFile(file))

        console.log("### Type Definition\n")
        const dts = file.replace(".js", ".d.ts")
        console.log(createdFiles[dts])
    })
}

export const build_api = (cf: any, dir: string) => {

    const input = `${dir}/src/index.ts`
    const output = `${dir}/build/index.js`
    const tsconfig = existsSync(`${dir}/tsconfig.json`) ? `${dir}/tsconfig.json` : `${__dirname}/../tsapi.json`

    try {

        cf.debug && log.info(`[ubin]: Building source ${input}`)
        cf.debug && log.info(`[ubin]: Building output ${output}`)

        buildSync({
            entryPoints: [input],
            platform: "node",
            tsconfig: tsconfig,
            outfile: output,
            bundle: true,
            minify: true,
            sourcemap: false,
            format: 'cjs',
        })

        // Run the compiler
        compile(process.argv.slice(2), {
            allowJs: true,
            declaration: true,
            emitDeclarationOnly: true,
        });

        cf.debug && log.info(`[ubin]: Building completed`)

    } catch (err) {

        cf.debug && log.warn(`[ubin]: Building failed / ${err.message}`)

    }

}