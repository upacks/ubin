"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_app = void 0;
const esbuild_1 = require("esbuild");
const child_process_1 = require("child_process");
const node_fs_1 = require("node:fs");
const utils_1 = require("utils");
const build_app = (cf) => {
    const { name, version, dir, port, debug, outDir, inDir, types, bundle, log, minify, sourcemap } = cf;
    try {
        const key = `${Date.now()}`;
        const input = `${inDir}/index.tsx`;
        const output = `${outDir}/index.${key}.js`;
        const startTime = performance.now();
        (0, esbuild_1.buildSync)({
            entryPoints: [input],
            logLevel: debug ? "debug" : "warning",
            outfile: output,
            platform: "browser",
            format: 'cjs',
            bundle: bundle,
            minify: minify,
            sourcemap: sourcemap,
        });
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        (0, node_fs_1.cpSync)(`${__dirname}/../static`, `${dir}/dist`, { recursive: true });
        const html = (0, node_fs_1.readFileSync)(`${__dirname}/../static/index.html`, "utf-8");
        let modify = String(html)
            .replace(`index.js`, `index.${key}.js`)
            .replace(`env.js`, `env.${key}.js`)
            .replace(`GearLink ©`, `GearLink © [ ${name} ➧ ${version} ➧ ${(0, utils_1.Now)()} ] 🚀`);
        (0, node_fs_1.writeFileSync)(`${dir}/dist/index.html`, modify);
        (0, node_fs_1.writeFileSync)(`${dir}/dist/run.js`, `

            const path = require('path')
            const { writeFileSync, readdirSync, statSync, lstatSync } = require('node:fs')

            const { Sfy, decodeENV, log, moment } = require('utils')
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

            writeFileSync('./dist/env.${key}.js', "var env = " + Sfy(decodeENV()) + "; window.env = env;")

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
