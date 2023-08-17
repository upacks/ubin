#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("utils");
const node_fs_1 = require("node:fs");
const path_1 = __importDefault(require("path"));
const build_api_1 = require("./build_api");
const args = process.argv;
const dir = path_1.default.join(__dirname, '..', '..', '..'); // __dirname + '/../../..'
if ((0, node_fs_1.existsSync)(`${dir}/package.json`)) {
    console.log(args);
    console.log(dir);
    const pkg = JSON.parse(String((0, node_fs_1.readFileSync)(`${dir}/package.json`) ?? ""));
    const cf = {
        debug: false,
        types: false,
    };
    if (pkg && pkg.name && pkg.version) {
        if (args.includes('--debug'))
            cf.debug = true;
        if (args.includes('--silent'))
            cf.debug = false;
        if (args.includes('--types'))
            cf.types = true;
        if (args.includes('build_app')) {
            cf.debug && utils_1.log.info(`[ubin]: Building app.${pkg.name}`);
        }
        if (args.includes('build_api')) {
            cf.debug && utils_1.log.info(`[ubin]: Building api.${pkg.name}`);
            (0, build_api_1.build_api)(cf, dir);
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
//# sourceMappingURL=ubin.js.map