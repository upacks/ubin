#!/usr/bin/env node

import { buildSync } from 'esbuild'
import { execSync } from 'child_process'
import { writeFileSync, existsSync } from 'node:fs'

export const build_app = (cf) => {

    const { dir, port, debug, outDir, inDir, types, bundle, log } = cf

    try {

        const input = `${inDir}/index.tsx`
        const output = `${outDir}/index.js`

        const startTime = performance.now()

        buildSync({
            entryPoints: [input],
            // ...(debug ? { logLevel: "info" } : {}),
            platform: "browser",
            sourcemap: false,
            outfile: output,
            bundle: bundle,
            minify: true,
            format: 'cjs',
        })

        !existsSync(`${dir}/dist/run.js`) && writeFileSync(`${dir}/dist/run.js`, `/* serve */
            const express = require("express")
            const app = express()
            app.use(express.static("${dir}/dist"))
            app.use(express.static("${dir}/public"))
            app.use((req, res, next) => res.sendFile("${dir}/public/index.html"))
            const l = app.listen(${port}, () => console.log("Started on port: " + l.address().port))
        `)

        const endTime = performance.now()

        debug && log.info(`Build in ${((endTime - startTime) / 1000).toFixed(2)}s`)

        types && execSync(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`)

    } catch (err) {

        log.warn(err.message)

    }

}