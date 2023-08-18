#!/usr/bin/env node

import { readFileSync, existsSync } from 'node:fs'
import { log } from 'utils'

import { watch_api } from './watch_api'
import { build_api } from './build_api'
import { serve_api } from './serve_api'

const args: string[] = process.argv
const dir: string = process.cwd()

if (existsSync(`${dir}/package.json`)) {

    const pkg: any = JSON.parse(String(readFileSync(`${dir}/package.json`) ?? ""))

    const cf = {
        dir: dir,
        debug: false,
        types: false,
        bundle: false,
        inDir: `${dir}/src`,
        outDir: `${dir}/dist`,
    }

    const _log = (al: string) => ({
        info: (t: string) => log.info(`[${al}]: ${t}`),
        warn: (t: string) => log.warn(`[${al}]: ${t}`),
        error: (t: string) => log.error(`[${al}]: ${t}`),
    })

    if (pkg && pkg.name && pkg.version) {

        if (args.includes('--debug')) cf.debug = true
        if (args.includes('--silent')) cf.debug = false
        if (args.includes('--types')) cf.types = true
        if (args.includes('--bundle')) cf.bundle = true

        if (args.includes('watch_app')) { } /** ! **/
        if (args.includes('build_app')) { } /** ! **/
        if (args.includes('serve_app')) { } /** ! **/

        if (args.includes('watch_api')) watch_api({ ...cf, log: _log('watch_api') })
        if (args.includes('build_api')) build_api({ ...cf, log: _log('build_api') })
        if (args.includes('serve_api')) serve_api({ ...cf, log: _log('serve_api') })

    } else {

        log.warn(`[ubin]: Could not get package name!`)

    }

} else {

    log.warn(`[ubin]: Use it as a dependency!`)

}