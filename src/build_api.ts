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
            platform: "node",
            outfile: output,
            bundle: bundle,
            minify: true,
            sourcemap: false,
            format: 'cjs',
        })

        types && execSync(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`)

    } catch (err) {

        log.warn(err.message)

    }

}