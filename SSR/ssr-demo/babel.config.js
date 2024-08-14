const presets = [
  "@babel/preset-react",
  [
    "@babel/preset-env",
    {
      useBuiltIns: "entry",
      corejs: "3.22",
      // "modules": false
    },
  ],
];

console.log(' --- babel config loaded --- ')

module.exports = { presets };
