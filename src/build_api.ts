#!/usr/bin/env node

import { log } from 'utils'
import { existsSync } from 'node:fs'
import { buildSync, build } from 'esbuild'
import { execSync } from 'child_process'

export const build_api = (cf: any, dir: string) => {

    const inDir = `${dir}/src`
    const outDir = `${dir}/build`
    const input = `${dir}/src/index.ts`
    const output = `${dir}/build/index.js`
    const tsconfig = `${dir}/tsconfig.json`

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

        cf.types && execSync(`tsc --emitDeclarationOnly --build ${tsconfig} --outDir ${outDir} --baseUrl ${inDir}`)

        cf.debug && log.info(`[ubin]: Building completed`)

    } catch (err) {

        cf.debug && log.warn(`[ubin]: Building failed / ${err.message}`)

    }

}