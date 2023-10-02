"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_app = void 0;
const esbuild_1 = require("esbuild");
const child_process_1 = require("child_process");
const node_fs_1 = require("node:fs");
const utils_1 = require("utils");
const build_app = (cf) => {
    const { name, dir, port, debug, outDir, inDir, types, bundle, log, minify } = cf;
    try {
        const input = `${inDir}/index.tsx`;
        const output = `${outDir}/index.js`;
        const startTime = performance.now();
        (0, esbuild_1.buildSync)({
            entryPoints: [input],
            logLevel: debug ? "debug" : "warning",
            outfile: output,
            bundle: bundle,
            minify: minify,
            sourcemap: false,
            platform: "browser",
            format: 'cjs',
        });
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        const env = `var env = ${(0, utils_1.Sfy)((0, utils_1.decodeENV)())}`;
        (0, node_fs_1.cpSync)(`${__dirname}/../static`, `${dir}/dist`, { recursive: true });
        (0, node_fs_1.writeFileSync)(`${dir}/dist/run.js`, `

            const path = require('path')
            const { readdirSync, statSync, lstatSync } = require('node:fs')

            const { log, moment } = require('utils')
            const { Host } = require('unet')

            const traverseDir = (dir, ls = []) => {

                const files = readdirSync(dir)
                files.forEach(file => {
                    let fullPath = path.join(dir, file)
                    if (lstatSync(fullPath).isDirectory()) { ls = traverseDir(fullPath, ls) }
                    else { ls.push(fullPath) }
                })

                ls.map(file => {
                    const stats = statSync(file)
                    const fileSizeInBytes = stats.size
                    const fileSizeInMegabytes = (fileSizeInBytes / (1024 * 1024)).toFixed(2)
                    const show = file.indexOf('.js') >= 0
                    show && log.info("..." + file.substring(file.length - 24, file.length) + " -> " + fileSizeInMegabytes + "mb bundle size / [" + moment(stats.mtime).fromNow() + "]")
                })

                return ls

            }

            traverseDir(__dirname)

            writeFileSync('/env.js', ${env})

            log.success("Created at ${(0, utils_1.Now)()} / Build in ${duration}s / Process " + process.pid + " / Port ${port}")

            new Host({ name: '${name}', port: ${port}, static: '${dir}' })

        `);
        types && (0, child_process_1.execSync)(`tsc --declaration --emitDeclarationOnly --outDir ${outDir} --baseUrl ${inDir}`);
    }
    catch (err) {
        log.warn(err.message);
    }
};
exports.build_app = build_app;
