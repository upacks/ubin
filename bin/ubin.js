#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const utils_1 = require("utils");
const watch_api_1 = require("./watch_api");
const build_api_1 = require("./build_api");
const serve_api_1 = require("./serve_api");
const watch_app_1 = require("./watch_app");
const build_app_1 = require("./build_app");
const serve_app_1 = require("./serve_app");
const args = process.argv;
const dir = process.cwd();
if ((0, node_fs_1.existsSync)(`${dir}/package.json`)) {
    const pkg = JSON.parse(String((0, node_fs_1.readFileSync)(`${dir}/package.json`) ?? ""));
    const cf = {
        dir: dir,
        debug: false,
        types: false,
        bundle: false,
        inDir: `${dir}/src`,
        outDir: `${dir}/dist`,
        port: args.indexOf('--port') !== -1 ? Number(args[args.indexOf('--port') + 1]) : 3000,
    };
    const _log = (al) => ({
        info: (t) => cf.debug && utils_1.log.info(`[${al}]: ${t}`),
        warn: (t) => utils_1.log.warn(`[${al}]: ${t}`),
        error: (t) => utils_1.log.error(`[${al}]: ${t}`),
    });
    if (pkg && pkg.name && pkg.version) {
        if (args.includes('--debug'))
            cf.debug = true;
        if (args.includes('--silent'))
            cf.debug = false;
        if (args.includes('--types'))
            cf.types = true;
        if (args.includes('--bundle'))
            cf.bundle = true;
        if (args.includes('watch_app'))
            (0, watch_app_1.watch_app)({ ...cf, log: _log('watch_app') });
        if (args.includes('build_app'))
            (0, build_app_1.build_app)({ ...cf, log: _log('build_app') });
        if (args.includes('serve_app'))
            (0, serve_app_1.serve_app)({ ...cf, log: _log('serve_app') });
        if (args.includes('watch_api'))
            (0, watch_api_1.watch_api)({ ...cf, log: _log('watch_api') });
        if (args.includes('build_api'))
            (0, build_api_1.build_api)({ ...cf, log: _log('build_api') });
        if (args.includes('serve_api'))
            (0, serve_api_1.serve_api)({ ...cf, log: _log('serve_api') });
    }
    else {
        utils_1.log.warn(`[ubin]: Could not get package name!`);
    }
}
else {
    utils_1.log.warn(`[ubin]: Use it as a dependency!`);
}
