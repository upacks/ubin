#!/usr/bin/env node

import { buildSync } from 'esbuild'
import { execSync } from 'child_process'

export const build_app = (cf) => {

    const { dir, debug, outDir, inDir, types, bundle, log } = cf

    try {

        const input = `${inDir}/index.tsx`
        const output = `${outDir}/index.js`

        debug && log.info(`Source ${input}`)
        debug && log.info(`Output ${output}`)

        buildSync({
            entryPoints: [input],
            ...(debug ? { logLevel: "debug" } : {}),
            platform: "browser",
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