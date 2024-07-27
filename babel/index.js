const babylon = require("babylon");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generate = require("@babel/generator").default;

const code = `function square(n) {
  return n * n;
};
n;
`;

const ast = babylon.parse(code);

// const updateParamNameVisitor = {
//   Identifier(path) {
//     if (path.node.name === this.paramName) {
//       path.node.name = "x";
//     }
//   },
// };

traverse(ast, {
  enter(path) {
    console.log("enter");
    if (t.isFunctionDeclaration(path) && path.node.id.name === "square") {
      const param = path.node.params[0];
      param.name = "x";
    } else if (
      // if the identifier is either a local variable (has a binding in the current scope)
      path.scope.hasBinding("n") ||
      // is inside a function declaration
      t.isFunctionDeclaration(path.parent.type)
    ) {
      path.node.name = "x";
    }
  },
});

console.log(generate(ast, {}).code);
