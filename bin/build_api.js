#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_api = void 0;
const utils_1 = require("utils");
const node_fs_1 = require("node:fs");
const esbuild_1 = require("esbuild");
const build_api = (cf, dir) => {
    const input = `${dir}/src/index.ts`;
    const output = `${dir}/build/index.js`;
    const tsconfig = (0, node_fs_1.existsSync)(`${dir}/tsconfig.json`) ? `${dir}/tsconfig.json` : `${__dirname}/../tsapi.json`;
    try {
        cf.debug && utils_1.log.info(`[ubin]: Building source ${input}`);
        cf.debug && utils_1.log.info(`[ubin]: Building output ${output}`);
        (0, esbuild_1.buildSync)({
            entryPoints: [input],
            platform: "node",
            tsconfig: tsconfig,
            outfile: output,
            bundle: true,
            minify: true,
            sourcemap: true,
            format: 'cjs',
        });
        cf.debug && utils_1.log.info(`[ubin]: Building completed`);
    }
    catch (err) {
        cf.debug && utils_1.log.warn(`[ubin]: Building failed / ${err.message}`);
    }
};
exports.build_api = build_api;
//# sourceMappingURL=build_api.js.map