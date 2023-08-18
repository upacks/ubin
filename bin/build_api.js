#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_api = void 0;
const esbuild_1 = require("esbuild");
const child_process_1 = require("child_process");
const build_api = (cf) => {
    const { dir, debug, outDir, inDir, types, bundle, log } = cf;
    try {
        const input = `${dir}/src/index.ts`;
        const output = `${dir}/build/index.js`;
        debug && log.info(`Source ${input}`);
        debug && log.info(`Output ${output}`);
        (0, esbuild_1.buildSync)({
            entryPoints: [input],
            logLevel: 'info',
            platform: "node",
            sourcemap: false,
            outfile: output,
            bundle: bundle,
            minify: true,
            format: 'cjs',
        });
        types && (0, child_process_1.execSync)(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`);
    }
    catch (err) {
        log.warn(err.message);
    }
};
exports.build_api = build_api;
