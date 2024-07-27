// 测试 api.cache 相关 API

const babel = require("@babel/core");


process.env.NODE_ENV = "production";
var js = `var x = { catch: 4, bar: 7 };`;
var usingBabelRc = babel.transformSync(js)


process.env.NODE_ENV = "development";
var usingBabelRc = babel.transformSync(js)


process.env.NODE_ENV = "production";
var usingBabelRc = babel.transformSync(js)