module.exports = function (api) {
  api.cache(false);
  const presets = [];
  const plugins = [];

  // console.log('__dirname: ', __dirname);
  // console.log('process.pwd(): ', process.pwd());
  console.log('--- SubPackage "babel-registry-test" babel.config.js loaded ---')

  return {
    presets,
    plugins,
    overrides: [
      {
        "test": "./moduleA.js",
        "plugins": ["@babel/plugin-transform-arrow-functions"]
      }
    ]
  };
}