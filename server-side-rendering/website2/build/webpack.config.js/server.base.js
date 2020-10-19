const path = require("path");
const { merge } = require("webpack-merge");
const fs = require("fs");
const webpack = require("webpack");
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const common = require("./common.base");
const { server: serverLoaders } = require("./loaders");
const plugins = require("./plugins");
const config = require("../config");
const deps = require("../../package.json").dependencies;
const { serverPath } = config[process.env.NODE_ENV || "development"];

module.exports = merge(common, {
  name: "server",
  target: "async-node",
  entry: {
    main: ["@babel/polyfill", path.resolve(__dirname, "../../server/index.js")],
    // website2: path.resolve(__dirname, "../../server/startup.js"),
  },
  output: {
    path: serverPath,
    filename: "[name].js",
  },
  externals: ["enhanced-resolve"],
  module: {
    rules: serverLoaders,
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    ...plugins.server,
    new webpack.DefinePlugin({
      REMOTE_NAME: JSON.stringify("website2"),
    }),
    new ModuleFederationPlugin({
      name: "website2",
      filename: "container.js",
      library: { type: "commonjs-module" },
      exposes: {
        "./SomeComponent": "./src/components/SomeComponent",
      },
      shared: [{ react: deps.react, "react-dom": deps["react-dom"] }],
    }),
  ],
  stats: {
    colors: true,
  },
});
