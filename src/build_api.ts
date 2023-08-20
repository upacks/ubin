#!/usr/bin/env node

import { buildSync } from 'esbuild'
import { execSync } from 'child_process'
import { writeFileSync, existsSync, readdirSync, statSync, lstatSync } from 'node:fs'
import path from 'path'
import { Now } from 'utils'

const traverseDir = (dir, ls = []) => {

    const files = readdirSync(dir)
    files.forEach(file => {
        let fullPath = path.join(dir, file)
        if (lstatSync(fullPath).isDirectory()) { ls = traverseDir(fullPath, ls) }
        else { ls.push(fullPath) }
    })
    return ls

}

export const build_api = (cf) => {

    const { dir, debug, outDir, inDir, types, bundle, log, minify } = cf

    try {

        const startTime = performance.now()

        buildSync({
            entryPoints: traverseDir(inDir),
            logLevel: debug ? "debug" : "warning",
            outdir: outDir,
            bundle: bundle,
            minify: minify,
            sourcemap: false,
            platform: "node",
            format: 'cjs',
        })

        const endTime = performance.now()
        const duration = ((endTime - startTime) / 1000).toFixed(2)

        !existsSync(`${dir}/dist/run.js`) && writeFileSync(`${dir}/dist/run.js`, `

            const { log, moment } = require('utils')
            log.success("Created at ${Now()} / Build in ${duration}s / Process " + process.pid)
            require("./index.js")

        `)

        types && execSync(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`)

    } catch (err) {

        log.warn(err.message)

    }

}