#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_api = void 0;
const esbuild_1 = require("esbuild");
const child_process_1 = require("child_process");
const node_fs_1 = require("node:fs");
const build_api = (cf) => {
    const { dir, debug, outDir, inDir, types, bundle, log } = cf;
    try {
        const input = `${inDir}/index.ts`;
        const output = `${outDir}/index.js`;
        const startTime = performance.now();
        (0, esbuild_1.buildSync)({
            entryPoints: [input],
            // ...(debug ? { logLevel: "info" } : {}),
            platform: "node",
            sourcemap: false,
            outfile: output,
            bundle: bundle,
            minify: true,
            format: 'cjs',
        });
        !(0, node_fs_1.existsSync)(`${dir}/dist/run.js`) && (0, node_fs_1.writeFileSync)(`${dir}/dist/run.js`, `/* serve */
            const api = require("./index.js")
        `);
        const endTime = performance.now();
        debug && log.info(`Build in ${((endTime - startTime) / 1000).toFixed(2)}s`);
        types && (0, child_process_1.execSync)(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`);
    }
    catch (err) {
        log.warn(err.message);
    }
};
exports.build_api = build_api;
