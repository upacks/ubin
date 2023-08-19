#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch_api = void 0;
const nodemon_1 = __importDefault(require("nodemon"));
const node_fs_1 = require("node:fs");
const watch_api = (cf) => {
    const { dir, debug, log, npm } = cf;
    try {
        const onExit = (code) => {
            if (code && code === 'SIGUSR2') {
                debug && log.info('Nodemon reload');
            }
            else {
                debug && log.error('Nodemon event exit');
                process.exit(0);
            }
        };
        !(0, node_fs_1.existsSync)(`${dir}/dist/run.js`) && (0, node_fs_1.writeFileSync)(`${dir}/dist/run.js`, `/* serve */
            const api = require("./index.js")
        `);
        (0, nodemon_1.default)({
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
            .on('exit', onExit);
    }
    catch (err) {
        log.warn(err.message);
    }
};
exports.watch_api = watch_api;
