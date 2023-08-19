#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_app = void 0;
const esbuild_1 = require("esbuild");
const child_process_1 = require("child_process");
const node_fs_1 = require("node:fs");
const build_app = (cf) => {
    const { dir, port, debug, outDir, inDir, types, bundle, log } = cf;
    try {
        const input = `${inDir}/index.tsx`;
        const output = `${outDir}/index.js`;
        const startTime = performance.now();
        (0, esbuild_1.buildSync)({
            entryPoints: [input],
            // ...(debug ? { logLevel: "info" } : {}),
            platform: "browser",
            sourcemap: false,
            outfile: output,
            bundle: bundle,
            minify: true,
            format: 'cjs',
        });
        !(0, node_fs_1.existsSync)(`${dir}/dist/run.js`) && (0, node_fs_1.writeFileSync)(`${dir}/dist/run.js`, `/* serve */
            const express = require("express")
            const app = express()
            app.use(express.static("${dir}/dist"))
            app.use(express.static("${dir}/public"))
            app.use((req, res, next) => res.sendFile("${dir}/public/index.html"))
            const l = app.listen(${port}, () => console.log("Started on port: " + l.address().port))
        `);
        const endTime = performance.now();
        debug && log.info(`Build in ${((endTime - startTime) / 1000).toFixed(2)}s`);
        types && (0, child_process_1.execSync)(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`);
    }
    catch (err) {
        log.warn(err.message);
    }
};
exports.build_app = build_app;
