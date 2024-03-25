import { buildSync } from 'esbuild'
import { execSync } from 'child_process'
import { readFileSync, writeFileSync, cpSync } from 'node:fs'
import { Now } from 'utils'

export const build_app = (cf) => {

    const { name, version, dir, port, debug, outDir, inDir, types, bundle, log, minify } = cf

    try {

        const key = `${Date.now()}`
        const input = `${inDir}/index.tsx`
        const output = `${outDir}/index.${key}.js`

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


        const html = readFileSync(`${__dirname}/../static/index.html`, "utf-8")
        let modify = String(html)
            .replace(`index.js`, `index.${key}.js`)
            .replace(`env.js`, `env.${key}.js`)
            .replace(`GearLink ©`, `GearLink © [ ${name} ➧ ${version} ➧ ${Now()} ] 🚀`)
        writeFileSync(`${dir}/dist/index.html`, modify)

        writeFileSync(`${dir}/dist/run.js`, `

            const path = require('path')
            const { writeFileSync, readdirSync, statSync, lstatSync } = require('node:fs')

            const { Sfy, decodeENV, log, moment } = require('utils')
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

            writeFileSync('./dist/env.${key}.js', "var env = " + Sfy(decodeENV()) + "; window.env = env;")

            log.success("Created at ${Now()} / Build in ${duration}s / Process " + process.pid + " / Port ${port}")

            new Host({ name: '${name}', port: ${port}, static: '${dir}' })

        `)

        types && execSync(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`)

    } catch (err) {

        log.warn(err.message)

    }

}