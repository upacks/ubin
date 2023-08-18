#!/usr/bin/env node

import nodemon from 'nodemon'

export const watch_api = (cf) => {

    const { dir, debug, log } = cf

    try {

        nodemon({
            "watch": [`${dir}/src`],
            "ignore": [
                `${dir}/node_modules`,
                `${dir}/build`,
                `${dir}/dist`,
            ],
            "ext": "ts,tsx,js,jsx,mjs,json",
            "exec": "yarn build && yarn serve"
        })
            .on('start', () => debug && log.info('Nodemon event start'))
            .on('crash', () => debug && log.warn('Nodemon event crush'))
            .on('exit', () => debug && log.error('Nodemon event exit'))

    } catch (err) {

        log.warn(err.message)

    }

}