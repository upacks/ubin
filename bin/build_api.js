#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_api = void 0;
const esbuild_1 = require("esbuild");
const child_process_1 = require("child_process");
const node_fs_1 = require("node:fs");
const path_1 = __importDefault(require("path"));
const utils_1 = require("utils");
const getAllFiles = (dirPath, arrayOfFiles = []) => {
    const files = (0, node_fs_1.readdirSync)(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach((file) => {
        if ((0, node_fs_1.statSync)(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        }
        else {
            arrayOfFiles.push(path_1.default.join(__dirname, dirPath, "/", file));
        }
    });
    return arrayOfFiles;
};
const build_api = (cf) => {
    const { dir, debug, outDir, inDir, types, bundle, log, minify } = cf;
    try {
        const input = `${inDir}`;
        const output = `${outDir}`;
        const startTime = performance.now();
        (0, esbuild_1.buildSync)({
            entryPoints: [getAllFiles(input)],
            outfile: output,
            bundle: bundle,
            minify: minify,
            sourcemap: false,
            platform: "node",
            format: 'cjs',
        });
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        !(0, node_fs_1.existsSync)(`${dir}/dist/run.js`) && (0, node_fs_1.writeFileSync)(`${dir}/dist/run.js`, `

            const { log, moment } = require('utils')
            log.success("Created at ${(0, utils_1.Now)()} / Build in ${duration}s / Process " + process.pid)
            require("./index.js")

        `);
        types && (0, child_process_1.execSync)(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`);
    }
    catch (err) {
        log.warn(err.message);
    }
};
exports.build_api = build_api;
