#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_api = void 0;
const esbuild_1 = require("esbuild");
const child_process_1 = require("child_process");
const build_api = (cf) => {
    const { debug, outDir, inDir, types, bundle, log } = cf;
    try {
        const input = `${inDir}/index.ts`;
        const output = `${outDir}/index.js`;
        const startTime = performance.now();
        (0, esbuild_1.buildSync)({
            entryPoints: [input],
            ...(debug ? { logLevel: "info" } : {}),
            platform: "node",
            sourcemap: false,
            outfile: output,
            bundle: bundle,
            minify: true,
            format: 'cjs',
        });
        const endTime = performance.now();
        debug && log.info(`Built in ${endTime - startTime} milliseconds`);
        types && (0, child_process_1.execSync)(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`);
    }
    catch (err) {
        log.warn(err.message);
    }
};
exports.build_api = build_api;
