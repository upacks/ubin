#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve_app = void 0;
const serve_app = (cf) => {
    const { dir, outDir, debug, log, port } = cf;
    try {
        const entry = `${outDir}/index.js`;
        debug && log.info(`Source ${entry}`);
        const express = require("express");
        const app = express();
        /* const livereload = require("livereload")
        const liveReloadServer = livereload.createServer()
        liveReloadServer.watch(`${dir}/dist`) */
        const connectLivereload = require("connect-livereload");
        app.use(connectLivereload());
        app.use(express.static(`${dir}/dist`));
        app.use(express.static(`${dir}/public`));
        app.use((req, res, next) => res.sendFile(`${dir}/public/index.html`));
        const l = app.listen(port, () => debug && log.info(`Started on port ${l.address().port}`));
    }
    catch (err) {
        log.warn(err.message);
    }
};
exports.serve_app = serve_app;
