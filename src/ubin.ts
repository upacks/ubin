#!/usr/bin/env node

import { log } from 'utils'
import { readFileSync, existsSync } from 'node:fs'
import { build_api } from './build_api'

const args: string[] = process.argv
const dir: string = __dirname + '/../../..'

if (existsSync(`${dir}/package.json`)) {

    const pkg: any = JSON.parse(String(readFileSync(`${dir}/package.json`) ?? ""))

    const cf = {
        debug: false,
        types: false,
    }

    if (pkg && pkg.name && pkg.version) {

        if (args.includes('--debug')) cf.debug = true
        if (args.includes('--silent')) cf.debug = false
        if (args.includes('--types')) cf.types = true

        if (args.includes('build_app')) {
            cf.debug && log.info(`[ubin]: Building app.${pkg.name}`)
        }

        if (args.includes('build_api')) {
            cf.debug && log.info(`[ubin]: Building api.${pkg.name}`)
            build_api(cf, dir)
        }

        if (args.includes('serve_app')) {
            cf.debug && log.info(`[ubin]: Serving app.${pkg.name}`)
        }

        if (args.includes('build_api')) {
            cf.debug && log.info(`[ubin]: Serving api.${pkg.name}`)
        }

    } else {

        log.warn(`[ubin]: Could not get package name!`)

    }

} else {

    log.warn(`[ubin]: Use it as a dependency!`)

}