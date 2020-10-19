const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const fs = require("fs");
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const common = require("./common.base");
const { server: serverLoaders } = require("./loaders");
const plugins = require("./plugins");
const config = require("../config");

const { serverPath } = config[process.env.NODE_ENV || "development"];
const remotePath = path.resolve(
  __dirname,
  "../../../website2/buildServer/container.js"
);
const deps = require("../../package.json").dependencies;

module.exports = merge(common, {
  name: "server",
  target: "async-node",
  entry: {
    main: ["@babel/polyfill", path.resolve(__dirname, "../../server/index.js")],
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
    new ModuleFederationPlugin({
      name: "website1",
      filename: "container.js",
      remotes: {
        website2: {
          external: remotePath,
          // we dont need to do this, just intersting to see in action
          // external: `promise new Promise((resolve)=>{ console.log('requring remote'); require('${remotePath}'); resolve(require('${remotePath}')) })`
        },
      },
      shared: [{ react: deps.react, "react-dom": deps["react-dom"] }],
    }),
  ],
  stats: {
    colors: true,
  },
});
