#!/usr/bin/env node

import { buildSync } from 'esbuild'
import { execSync } from 'child_process'
import { writeFileSync, existsSync } from 'node:fs'

export const build_api = (cf) => {

    const { dir, debug, outDir, inDir, types, bundle, log } = cf

    try {

        const input = `${inDir}/index.ts`
        const output = `${outDir}/index.js`

        const startTime = performance.now()

        buildSync({
            entryPoints: [input],
            // ...(debug ? { logLevel: "info" } : {}),
            platform: "node",
            sourcemap: false,
            outfile: output,
            bundle: bundle,
            minify: true,
            format: 'cjs',
        })

        !existsSync(`${dir}/dist/run.js`) && writeFileSync(`${dir}/dist/run.js`, `/* serve */
            const api = require("./index.js")
        `)

        const endTime = performance.now()

        debug && log.info(`Build in ${((endTime - startTime) / 1000).toFixed(2)}s`)

        types && execSync(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`)

    } catch (err) {

        log.warn(err.message)

    }

}