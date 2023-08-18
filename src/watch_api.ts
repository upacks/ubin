#!/usr/bin/env node

import { log } from 'utils'
import nodemon from 'nodemon'
import { build_api } from './build_api'
import { serve_api } from './serve_api'

/**
 * ubin --watch
 * ubin --build
 * ubin --serve
 */

export const watch_api = (cf) => {

    try {

        const { dir, debug, bundle } = cf
        debug && log.info(`[ubin]: Watching started ${dir}/src`)

        const onStart = () => {

            try {

                build_api(cf)
                serve_api(cf)

                log.error(`[ubin]: Watching [:)]`)

            } catch (err) {
                log.error(`[ubin]: ${err.message}`)
            }

        }

        nodemon({
            "watch": [`src`],
            "ignore": [
                `node_modules`,
                `build`,
                `dist`,
            ],
            "ext": "ts,tsx,js,jsx,mjs,json",
            "exec": "echo 0",
            "legacyWatch": true,
        })
            .on('start', () => onStart())
            .on('crash', () => log.warn('[watch] crush'))
            .on('exit', () => log.warn('[watch] exit'))

        debug && log.info(`[ubin]: Watching completed`)

    } catch (err) {

        log.warn(`[ubin]: Watching failed / ${err.message}`)

    }

}