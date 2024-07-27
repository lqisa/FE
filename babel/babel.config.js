
module.exports = function (api) {
  api.cache.invalidate(() => {
    return process.env.NODE_ENV
  });
  // api.cache.never();
  console.log('--- Root babel.config.js loaded ---')
  // console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
  return {
    "presets": [
      "./presets/a.js",
      "./presets/b.js"
      // [
      //   "@babel/preset-env",
      //   {
      //     // "targets": "> 0.25%, not dead",
      //     "useBuiltIns": "usage",
      //     "corejs": "3.37.1"
      //   }
      // ]
    ],
    "plugins": [],
    // "babelrcRoots": [
    //   ".",
    //   "packages/*",
    // ]
  }
}