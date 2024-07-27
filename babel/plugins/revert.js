module.exports = function ({ types: t }, options) {
  console.log("-- plugin revert options --: ", options);
  // 返回一个对象
  return {
    // 其 visitor 属性是这个插件的主要访问者
    visitor: {
      // Visitor 中的每个函数接收2个参数：path 和 state
      Identifier(path, state) {
        console.log('path.traverse:', JSON.stringify(path.traverse));
        const name = path.node.name;
        console.log('path.node.name:', name);
        // reverse the name: JavaScript -> tpircSavaJ
        path.node.name = name.split("").reverse().join("");
      },
    },
  };
};
