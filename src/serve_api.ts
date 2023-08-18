#!/usr/bin/env node

import { log } from 'utils'
import { execSync } from 'child_process'

export const serve_api = (cf) => {

    try {

        const { dir, debug } = cf
        const entry = `${dir}/build/index.js`

        debug && log.info(`[ubin]: Serving source ${entry}`)

        execSync(`node ${entry}`)

        debug && log.info(`[ubin]: Serving completed`)

    } catch (err) {

        log.warn(`[ubin]: Serving failed / ${err.message}`)

    }

}