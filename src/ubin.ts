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
        outDir: `${dir}/build`,
    }

    if (pkg && pkg.name && pkg.version) {

        if (args.includes('--debug')) cf.debug = true
        if (args.includes('--silent')) cf.debug = false
        if (args.includes('--types')) cf.types = true
        if (args.includes('--bundle')) cf.bundle = true

        if (args.includes('dev_app')) {
            cf.debug && log.info(`[ubin]: Watching app.${pkg.name}`)
        }

        if (args.includes('dev_api')) {
            cf.debug && log.info(`[ubin]: Watching api.${pkg.name}`)
            watch_api(cf)
        }

        if (args.includes('build_app')) {
            cf.debug && log.info(`[ubin]: Building app.${pkg.name}`)
        }

        if (args.includes('build_api')) {
            cf.debug && log.info(`[ubin]: Building api.${pkg.name}`)
            build_api(cf)
        }

        if (args.includes('serve_app')) {
            cf.debug && log.info(`[ubin]: Serving app.${pkg.name}`)
        }

        if (args.includes('build_api')) {
            cf.debug && log.info(`[ubin]: Serving api.${pkg.name}`)
            serve_api(cf)
        }

    } else {

        log.warn(`[ubin]: Could not get package name!`)

    }

} else {

    log.warn(`[ubin]: Use it as a dependency!`)

}