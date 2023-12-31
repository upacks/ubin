import { buildSync } from 'esbuild'
import { execSync } from 'child_process'
import { writeFileSync, existsSync, readdirSync, statSync, lstatSync } from 'node:fs'
import path from 'path'
import { Now } from 'utils'

const traverseDir = (dir, ls: any = []) => {

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

        writeFileSync(`${dir}/dist/run.js`, `

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
                    const show = file.indexOf('.js') >= 0
                    show && log.info("..." + file.substring(file.length - 24, file.length) + " -> " + fileSizeInMegabytes + "mb bundle size / [" + moment(stats.mtime).fromNow() + "]")
                })

                return ls

            }

            traverseDir(__dirname)

            log.success("Created at ${Now()} / Build in ${duration}s / Process " + process.pid)

            /* 
                Browsers will by default try to request /favicon.ico from the root of a hostname, in order to show an icon in the browser tab.
                app.get('/favicon.ico', (req, res) => res.status(204))
            */

            require("./index.js")

        `)

        types && execSync(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`)

    } catch (err) {

        log.warn(err.message)

    }

}