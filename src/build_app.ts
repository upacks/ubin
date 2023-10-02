import { buildSync } from 'esbuild'
import { execSync } from 'child_process'
import { writeFileSync, existsSync, cpSync } from 'node:fs'
import { decodeENV, Now, Sfy } from 'utils'

export const build_app = (cf) => {

    const { name, dir, port, debug, outDir, inDir, types, bundle, log, minify } = cf

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

        cpSync(`${__dirname}/../static`, `${dir}/dist`, { recursive: true })
        writeFileSync(`${dir}/dist/run.js`, `

            const path = require('path')
            const { writeFileSync, readdirSync, statSync, lstatSync } = require('node:fs')

            const { decodeENV, log, moment } = require('utils')
            const { Host } = require('unet')

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

            writeFileSync('./dist/env.js', "var env = " + Sfy(decodeENV()))

            log.success("Created at ${Now()} / Build in ${duration}s / Process " + process.pid + " / Port ${port}")

            new Host({ name: '${name}', port: ${port}, static: '${dir}' })

        `)

        types && execSync(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`)

    } catch (err) {

        log.warn(err.message)

    }

}