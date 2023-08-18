#!/usr/bin/env node

export const serve_api = (cf) => {

    const { dir, debug, log } = cf

    try {

        const entry = `${dir}/build/index.js`

        debug && log.info(`Source ${entry}`)

        require(entry)

    } catch (err) {

        log.warn(err.message)

    }

}