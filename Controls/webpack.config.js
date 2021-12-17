const path = require('path');
const fs = require("fs")

const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
    mode: 'production',
    entry: path.resolve(appDirectory, "typescript/babylon-renderer.ts"),
    output: {
        path: path.resolve(__dirname, 'wwwroot/js'),
        filename: 'babylonBundle.js'
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
        ],
    },
};