const VirtualModulesPlugin = require("webpack-virtual-modules");
const {DefinePlugin} = require('webpack')

class SuspenseModulesPlugin {
  apply(compiler) {
    const FederationPlugin = compiler.options.plugins.find((plugin) => {
      return plugin.constructor.name === "ModuleFederationPlugin";
    });
    const federationPluginOptions = Object.assign(
      {},
      FederationPlugin._options
    );

    compiler.hooks.thisCompilation.tap('SuspensePlugin', (compilation) => {
      new DefinePlugin({
        __MODULE_MAP__: federationPluginOptions.exposes ? JSON.stringify(federationPluginOptions.exposes) : '[]'
      }).apply(compiler)
    })
    const containerRequire =
      compiler.options.mode === "development"
        ? `__webpack_require__("webpack/container/entry/${federationPluginOptions.name}")`
        : `Object.keys(__webpack_modules__).reduce((p, c) => {
    if (c !== module.id) {
      const mod = __webpack_require__(c);
      console.log(mod);
      if (mod.get) {
        return mod;
      }
    }
    return p;
  }, module.exports)`;

    new VirtualModulesPlugin({
      "./routes-virtual-entry.js": 'console.log(`${__MODULE_MAP__}`);' + `
const container = ${containerRequire};
const preload = null
Object.defineProperty(container, "preload", { enumerable: true, get: () => preload });

module.exports = container;`,
    }).apply(compiler)
  }
}

module.exports = SuspenseModulesPlugin

