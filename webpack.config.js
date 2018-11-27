const HtmlWebpackPlugin = require("html-webpack-plugin")
const merge = require("webpack-merge")
const path = require("path")

const TARGET = process.env.npm_lifecycle_event

const common = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{ loader: "ts-loader", options: { transpileOnly: true } }]
            },
            {
                test: /\.(png|jpg|jpeg|gif|mp3|ogg|wav)$/,
                exclude: /node_modules/,
                use: [{ loader: "file-loader" }]
            }
        ]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "game.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
            title: "Game :: GitHub Game Jam 2018"
        })
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    }
}

const development = {
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        open: true,
        overlay: true,
        port: 9000
    },
    devtool: "cheap-module-source-map",
    mode: "development"
}

const production = {
    devtool: "none",
    mode: "production"
}

const configuration = TARGET === "start" ? merge(common, development) : merge(common, production)

module.exports = configuration
