#!/usr/bin/env node

import { buildSync } from 'esbuild'
import { execSync } from 'child_process'

export const build_app = (cf) => {

    const { debug, outDir, inDir, types, bundle, log } = cf

    try {

        const input = `${inDir}/index.tsx`
        const output = `${outDir}/index.js`

        const startTime = performance.now()

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

        const endTime = performance.now()

        debug && log.info(`Built in ${endTime - startTime} milliseconds`)

        types && execSync(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`)

    } catch (err) {

        log.warn(err.message)

    }

}