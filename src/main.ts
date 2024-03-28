import { readFileSync, existsSync } from 'node:fs'
import { log } from 'utils'

import { watch_api } from './watch_api'
import { build_api } from './build_api'

import { watch_app } from './watch_app'
import { build_app } from './build_app'

const args: string[] = process.argv
const dir: string = process.cwd()

if (existsSync(`${dir}/package.json`)) {

    const pkg: any = JSON.parse(String(readFileSync(`${dir}/package.json`) ?? ""))

    const cf = {
        name: '',
        version: '',
        dir: dir,
        debug: false,
        types: false,
        bundle: false,
        minify: false,
        sourcemap: false,
        npm: false,
        inDir: `${dir}/src`,
        outDir: `${dir}/dist`,
        port: args.indexOf('--port') !== -1 ? Number(args[args.indexOf('--port') + 1]) : 3000,
    }

    const _log = (al: string) => ({
        info: (t: string) => cf.debug && log.info(`[${al}]: ${t}`),
        warn: (t: string) => log.warn(`[${al}]: ${t}`),
        error: (t: string) => log.error(`[${al}]: ${t}`),
    })

    if (pkg && pkg.name && pkg.version) {

        cf.name = pkg.name
        cf.version = pkg.version

        if (args.includes('--debug')) cf.debug = true
        if (args.includes('--silent')) cf.debug = false
        if (args.includes('--types')) cf.types = true
        if (args.includes('--bundle')) cf.bundle = true
        if (args.includes('--minify')) cf.minify = true
        if (args.includes('--sourcemap')) cf.sourcemap = true
        if (args.includes('--npm')) cf.npm = true

        if (args.includes('watch_app')) watch_app({ ...cf, log: _log('watch_app') })
        if (args.includes('build_app')) build_app({ ...cf, log: _log('build_app') })

        if (args.includes('watch_api')) watch_api({ ...cf, log: _log('watch_api') })
        if (args.includes('build_api')) build_api({ ...cf, log: _log('build_api') })

    } else {

        log.warn(`[ubin]: Could not get package name!`)

    }

} else {

    log.warn(`[ubin]: Use it as a dependency!`)

}