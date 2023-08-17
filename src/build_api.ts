#!/usr/bin/env node

import { log } from 'utils'
import { existsSync } from 'node:fs'
import { buildSync } from 'esbuild'
import { execSync } from 'child_process'

export const build_api = (cf: any, dir: string) => {

    const inDir = `${dir}/src`
    const outDir = `${dir}/build`
    const input = `${dir}/src/index.ts`
    const output = `${dir}/build/index.js`
    const tsconfig = existsSync(`${dir}/tsconfig.json`) ? `${dir}/tsconfig.json` : `${__dirname}/../tsapi.json`

    try {

        cf.debug && log.info(`[ubin]: Building source ${input}`)
        cf.debug && log.info(`[ubin]: Building output ${output}`)

        const type_generator = {
            name: 'TypeGenerator',
            setup(build) {
                cf.types && build.onEnd((result) => {
                    result.errors.length === 0 && execSync(`tsc --emitDeclarationOnly --build ${tsconfig} --outDir ${outDir} --baseUrl ${inDir}`)
                })
            }
        }

        buildSync({
            entryPoints: [input],
            platform: "node",
            tsconfig: tsconfig,
            outfile: output,
            bundle: true,
            minify: true,
            sourcemap: false,
            format: 'cjs',
            plugins: [type_generator]
        })

        cf.debug && log.info(`[ubin]: Building completed`)

    } catch (err) {

        cf.debug && log.warn(`[ubin]: Building failed / ${err.message}`)

    }

}