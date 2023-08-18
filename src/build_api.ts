#!/usr/bin/env node

import { buildSync } from 'esbuild'
import { execSync } from 'child_process'

export const build_api = (cf) => {

    const { dir, debug, outDir, inDir, types, bundle, log } = cf

    try {

        const input = `${dir}/src/index.ts`
        const output = `${dir}/build/index.js`

        debug && log.info(`Source ${input}`)
        debug && log.info(`Output ${output}`)

        buildSync({
            entryPoints: [input],
            logLevel: 'info',
            platform: "node",
            sourcemap: false,
            outfile: output,
            bundle: bundle,
            minify: true,
            format: 'cjs',
        })

        types && execSync(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`)

    } catch (err) {

        log.warn(err.message)

    }

}