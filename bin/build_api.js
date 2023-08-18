#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_api = void 0;
const utils_1 = require("utils");
const esbuild_1 = require("esbuild");
const child_process_1 = require("child_process");
const build_api = (cf) => {
    try {
        const { dir, debug, outDir, inDir, types, bundle } = cf;
        const input = `${dir}/src/index.ts`;
        const output = `${dir}/build/index.js`;
        debug && utils_1.log.info(`[ubin]: Building source ${input}`);
        debug && utils_1.log.info(`[ubin]: Building output ${output}`);
        (0, esbuild_1.buildSync)({
            entryPoints: [input],
            platform: "node",
            outfile: output,
            bundle: bundle,
            minify: true,
            sourcemap: false,
            format: 'cjs',
        });
        types && (0, child_process_1.execSync)(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`);
        debug && utils_1.log.info(`[ubin]: Building completed`);
    }
    catch (err) {
        utils_1.log.warn(`[ubin]: Building failed / ${err.message}`);
    }
};
exports.build_api = build_api;
