#!/usr/bin/env node

import { buildSync } from 'esbuild'
import { execSync } from 'child_process'
import { writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import path from 'path'
import { Now } from 'utils'

const getAllFiles = (dirPath: any, arrayOfFiles: any = []) => {

    const files = readdirSync(dirPath)
    arrayOfFiles = arrayOfFiles || []
    files.forEach((file) => {
        if (statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
        }
    })

    return arrayOfFiles
}

export const build_api = (cf) => {

    const { dir, debug, outDir, inDir, types, bundle, log, minify } = cf

    try {

        const input = `${inDir}`
        const output = `${outDir}`

        const startTime = performance.now()

        buildSync({
            entryPoints: [getAllFiles(input)],
            outfile: output,
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