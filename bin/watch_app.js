"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch_app = void 0;
const nodemon_1 = __importDefault(require("nodemon"));
const watch_app = (cf) => {
    const { dir, debug, log, npm, port } = cf;
    try {
        const onExit = (code) => {
            if (code && code === 'SIGUSR2') {
                debug && log.info('Nodemon reload');
            }
            else {
                debug && log.error('Nodemon event exit');
                process.exit(0);
            }
        };
        (0, nodemon_1.default)({
            "watch": [`${dir}/src`],
            "ignore": [
                `${dir}/node_modules`,
                `${dir}/build`,
                `${dir}/dist`,
            ],
            "ext": "ts,tsx,js,jsx,mjs,json",
            "exec": npm ? "npm run build && npm run serve" : "yarn build && yarn serve"
        })
            .on('start', () => debug && log.info('Nodemon event start'))
            .on('crash', () => debug && log.warn('Nodemon event crush'))
            .on('exit', onExit);
    }
    catch (err) {
        log.warn(err.message);
    }
};
exports.watch_app = watch_app;
