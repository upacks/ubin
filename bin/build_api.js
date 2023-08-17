#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_api = void 0;
const utils_1 = require("utils");
const esbuild_1 = require("esbuild");
const child_process_1 = require("child_process");
const build_api = (cf, dir) => {
    const inDir = `${dir}/src`;
    const outDir = `${dir}/build`;
    const input = `${dir}/src/index.ts`;
    const output = `${dir}/build/index.js`;
    try {
        cf.debug && utils_1.log.info(`[ubin]: Building source ${input}`);
        cf.debug && utils_1.log.info(`[ubin]: Building output ${output}`);
        (0, esbuild_1.buildSync)({
            entryPoints: [input],
            platform: "node",
            outfile: output,
            bundle: cf.bundle,
            minify: true,
            sourcemap: false,
            format: 'cjs',
        });
        cf.types && (0, child_process_1.execSync)(`tsc --emitDeclarationOnly --declaration --comments --outDir ${outDir} --baseUrl ${inDir}`);
        cf.debug && utils_1.log.info(`[ubin]: Building completed`);
    }
    catch (err) {
        cf.debug && utils_1.log.warn(`[ubin]: Building failed / ${err.message}`);
    }
};
exports.build_api = build_api;
