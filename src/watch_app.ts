#!/usr/bin/env node

import nodemon from 'nodemon'
import { writeFileSync, existsSync } from 'node:fs'

export const watch_app = (cf) => {

    const { dir, debug, log, npm, port } = cf

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
            const express = require("express")
            const app = express()
            app.use(express.static("../dist"))
            app.use(express.static("../public"))
            app.use((req, res, next) => res.sendFile("../index.html"))
            const l = app.listen(${port}, () => console.log("Started on port: " + l.address().port))
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