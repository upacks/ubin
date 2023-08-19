#!/usr/bin/env node

import nodemon from 'nodemon'
import { writeFileSync, existsSync } from 'node:fs'

export const watch_api = (cf) => {

    const { dir, debug, log, npm } = cf

    try {

        const onExit = (code) => {

            if (code && code === 'SIGUSR2') {
                debug && log.info('Nodemon reload')
            } else {
                debug && log.error('Nodemon event exit')
                process.exit(0)
            }

        }

        !existsSync(`${dir}/dist/run.js`) && writeFileSync(`${dir}/dist/run.js`, `/* serve */
            const api = require("./index.js")
        `)

        nodemon({
            "watch": [`${dir}/src`],
            "ignore": [
                `${dir}/node_modules`,
                `${dir}/build`,
                `${dir}/dist`,
            ],
            "ext": "ts,tsx,js,jsx,mjs,json",
            "exec": npm ? "npm run build && npm run serve" : "yarn build && yarn serve"
        })
            .on('start', () => debug && log.info('Nodemon event start'))
            .on('crash', () => debug && log.warn('Nodemon event crush'))
            .on('exit', onExit)

    } catch (err) {

        log.warn(err.message)

    }

}