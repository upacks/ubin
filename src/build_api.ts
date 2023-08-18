#!/usr/bin/env node

import { log } from 'utils'
import { buildSync } from 'esbuild'
import { execSync } from 'child_process'

export const build_api = (cf) => {

    try {

        const { dir, debug, outDir, inDir, types, bundle } = cf
        const input = `${dir}/src/index.ts`
        const output = `${dir}/build/index.js`

        debug && log.info(`[ubin]: Building source ${input}`)
        debug && log.info(`[ubin]: Building output ${output}`)

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

        debug && log.info(`[ubin]: Building completed`)

    } catch (err) {

        log.warn(`[ubin]: Building failed / ${err.message}`)

    }

}