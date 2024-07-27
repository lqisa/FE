// 假设源码 foo === bar;


module.exports = function ({ types: t }, options) {
  console.log("-- plugin revert options --: ", options);
  // 返回一个对象
  return {
    visitor: {
      // 赋值表达式 如 a = 1;
      AssignmentExpression(path) {
        // ...
      },
      // 二元表达式
      BinaryExpression(path) {
        // 只关注哪些使用了 === 的 BinaryExpression
        // if (path.node.operator !== "===") {
        //   return;
        // }


        // 左操作数 （babel 内部 Node 类型）
        path.node.left;
        // 右操作数 （babel 内部 Node 类型）
        path.node.right;
        // 运算符 （babel 内部 Node 类型）
        path.node.operator;

        // 访问到该属性内部的 path，使用 path 对象的 get 方法，传递该属性的字符串形式作为参数
        path.get('left');

        // 检查节点的类型
        // a === 1 => true
        if (t.isIdentifier(path.node.left)) {
          // ...
        }
        // 1 === 1 => true
        if (t.isNumericLiteral(path.node.left)) {
          // ...
        }

        // shallow Compare
        /**
         * 参见源码 isIdentifier
         * 其他比较均类似 shallow Compare opts
         * export function isIdentifier(
            node: t.Node | null | undefined,
            opts?: Opts<t.Identifier> | null,
          ): node is t.Identifier {
            if (!node) return false;

            if (node.type !== "Identifier") return false;

            return opts == null || shallowEqual(node, opts);
          }
         */
        if (t.isIdentifier(path.node.left, { name: "n" })) {
          // ...
        }
        // 等价于下方代码
        // 检查路径（Path）类型
        if (path.get('left').isIdentifier({ name: "n" })) {
          // ...
        }
        // 等价于下方代码
        if (
          path.node.left != null &&
          path.node.left.type === "Identifier" &&
          path.node.left.name === "n"
        ) {
          // ...
        }

      },

      // 检查标识符（Identifier）是否被引用
      Identifier(path) {
        if (path.isReferencedIdentifier()) {
          // ...
          debugger
        }
        // 等价于
        if (t.isReferenced(path.node, path.parent)) {
          // ...
          debugger
        }
      },




      Program(path) {
        // 访问到该属性内部的 path，使用 path 对象的 get 方法，传递该属性的字符串形式作为参数
        path.get('body.0');
      }
    },
  };
};
