#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve_api = void 0;
const serve_api = (cf) => {
    const { dir, outDir, debug, log } = cf;
    try {
        const entry = `${outDir}/index.js`;
        debug && log.info(`Source ${entry}`);
        require(entry);
    }
    catch (err) {
        log.warn(err.message);
    }
};
exports.serve_api = serve_api;
