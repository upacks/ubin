#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve_api = void 0;
const utils_1 = require("utils");
const child_process_1 = require("child_process");
const serve_api = (cf) => {
    try {
        const { dir, debug } = cf;
        const entry = `${dir}/build/index.js`;
        debug && utils_1.log.info(`[ubin]: Serving source ${entry}`);
        (0, child_process_1.execSync)(`node ${entry}`);
        debug && utils_1.log.info(`[ubin]: Serving completed`);
    }
    catch (err) {
        utils_1.log.warn(`[ubin]: Serving failed / ${err.message}`);
    }
};
exports.serve_api = serve_api;
