#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const utils_1 = require("utils");
const watch_api_1 = require("./watch_api");
const build_api_1 = require("./build_api");
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
        outDir: `${dir}/build`,
    };
    if (pkg && pkg.name && pkg.version) {
        if (args.includes('--debug'))
            cf.debug = true;
        if (args.includes('--silent'))
            cf.debug = false;
        if (args.includes('--types'))
            cf.types = true;
        if (args.includes('--bundle'))
            cf.bundle = true;
        if (args.includes('dev_app')) {
            cf.debug && utils_1.log.info(`[ubin]: Watching app.${pkg.name}`);
        }
        if (args.includes('dev_api')) {
            cf.debug && utils_1.log.info(`[ubin]: Watching api.${pkg.name}`);
            (0, watch_api_1.watch_api)(cf);
        }
        if (args.includes('build_app')) {
            cf.debug && utils_1.log.info(`[ubin]: Building app.${pkg.name}`);
        }
        if (args.includes('build_api')) {
            cf.debug && utils_1.log.info(`[ubin]: Building api.${pkg.name}`);
            (0, build_api_1.build_api)(cf);
        }
        if (args.includes('serve_app')) {
            cf.debug && utils_1.log.info(`[ubin]: Serving app.${pkg.name}`);
        }
        if (args.includes('build_api')) {
            cf.debug && utils_1.log.info(`[ubin]: Serving api.${pkg.name}`);
        }
    }
    else {
        utils_1.log.warn(`[ubin]: Could not get package name!`);
    }
}
else {
    utils_1.log.warn(`[ubin]: Use it as a dependency!`);
}
