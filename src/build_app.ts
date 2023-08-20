#!/usr/bin/env node

import { buildSync } from 'esbuild'
import { execSync } from 'child_process'
import { writeFileSync, existsSync } from 'node:fs'
import { Now } from 'utils'

export const build_app = (cf) => {

    const { dir, port, debug, outDir, inDir, types, bundle, log, minify } = cf

    try {

        const input = `${inDir}/index.tsx`
        const output = `${outDir}/index.js`

        const startTime = performance.now()

        buildSync({
            entryPoints: [input],
            logLevel: debug ? "debug" : "warning",
            outfile: output,
            bundle: bundle,
            minify: minify,
            sourcemap: false,
            platform: "browser",
            format: 'cjs',
        })

        const endTime = performance.now()
        const duration = ((endTime - startTime) / 1000).toFixed(2)

        !existsSync(`${dir}/dist/run.js`) && writeFileSync(`${dir}/dist/run.js`, `

            const { log, moment } = require('utils')
            const path = require('path')
            const { readdirSync, statSync, lstatSync } = require('node:fs')

            const traverseDir = (dir, ls = []) => {

                const files = readdirSync(dir)
                files.forEach(file => {
                    let fullPath = path.join(dir, file)
                    if (lstatSync(fullPath).isDirectory()) { ls = traverseDir(fullPath, ls) }
                    else { ls.push(fullPath) }
                })


                ls.map(file => {
                    const stats = statSync(file)
                    const fileSizeInBytes = stats.size
                    const fileSizeInMegabytes = (fileSizeInBytes / (1024 * 1024)).toFixed(2)
                    log.info("..." + file.substring(file.length - 24, file.length) + " -> " + fileSizeInMegabytes + "mb bundle size / [" + moment(stats.mtime).fromNow() + "]")
                })

                return ls

            }

            const express = require("express")
            const app = express()
            app.use(express.static("${dir}/dist"))
            app.use(express.static("${dir}/public"))
            app.use((req, res, next) => res.sendFile("${dir}/public/index.html"))
            const l = app.listen(${port}, () => {
                traverseDir(__dirname)
                log.success("Created at ${Now()} / Build in ${duration}s / Process " + process.pid + " / Port " + l.address().port)
            })

        `)

        types && execSync(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`)

    } catch (err) {

        log.warn(err.message)

    }

}