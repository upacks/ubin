#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch_api = void 0;
const utils_1 = require("utils");
const nodemon_1 = __importDefault(require("nodemon"));
const build_api_1 = require("./build_api");
const serve_api_1 = require("./serve_api");
/**
 * ubin --watch
 * ubin --build
 * ubin --serve
 */
const watch_api = (cf) => {
    try {
        const { dir, debug, bundle } = cf;
        debug && utils_1.log.info(`[ubin]: Watching started ${dir}/src`);
        const onStart = () => {
            try {
                (0, build_api_1.build_api)(cf);
                (0, serve_api_1.serve_api)(cf);
                utils_1.log.error(`[ubin]: Watching [:)]`);
            }
            catch (err) {
                utils_1.log.error(`[ubin]: ${err.message}`);
            }
        };
        (0, nodemon_1.default)({
            "watch": [`${dir}/src`],
            "ignore": [
                `${dir}/node_modules`,
                `${dir}/build`,
                `${dir}/dist`,
            ],
            "ext": "ts,tsx,js,jsx,mjs,json",
            "exec": "echo :)",
            "legacyWatch": true,
        })
            .on('start', () => onStart())
            .on('crash', () => utils_1.log.warn('[watch] crush'))
            .on('exit', () => utils_1.log.warn('[watch] exit'));
        debug && utils_1.log.info(`[ubin]: Watching completed`);
    }
    catch (err) {
        utils_1.log.warn(`[ubin]: Watching failed / ${err.message}`);
    }
};
exports.watch_api = watch_api;
