#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve_app = void 0;
const serve_app = (cf) => {
    const { dir, outDir, debug, log } = cf;
    try {
        const entry = `${outDir}/index.js`;
        debug && log.info(`Source ${entry}`);
        const express = require("express");
        const app = express();
        app.use(express.static(`${dir}/dist`));
        app.use(express.static(`${dir}/public`));
        app.use((req, res, next) => res.sendFile(`${dir}/public/index.html`));
        app.listen(5000, () => log.info("Started on port 5000"));
    }
    catch (err) {
        log.warn(err.message);
    }
};
exports.serve_app = serve_app;
