#!/usr/bin/env node

import { log } from 'utils'
import { existsSync } from 'node:fs'
import { buildSync } from 'esbuild'

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
            sourcemap: true,
            format: 'cjs',
        })

        cf.debug && log.info(`[ubin]: Building completed`)

    } catch (err) {

        cf.debug && log.warn(`[ubin]: Building failed / ${err.message}`)

    }

}