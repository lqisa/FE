# VUEX

数据流

![img](assets/flow.png)

内部流程

![vuex](assets/vuex.png)

## 使用

### 项目结构

```js
├── index.html
├── main.js
├── api
│   └── ... # 抽取出API请求
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # 我们组装模块并导出 store 的地方
    ├── actions.js        # 根级别的 action
    ├── mutations.js      # 根级别的 mutation
    └── modules
        ├── cart.js       # 购物车模块
        └── products.js   # 产品模块
```

模块的 `store` 只需要在 `modules` 文件夹里定义导出后在 `store / index.js` 内合并即可

**通常不需要动态定义 Store** ，具体使用[参见](https://vuex.vuejs.org/zh/guide/modules.html#%E6%A8%A1%E5%9D%97%E5%8A%A8%E6%80%81%E6%B3%A8%E5%86%8C)

```js
import { createApp } from "vue";
import { createStore } from "vuex";

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      count: 0,
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});

const app = createApp({
  /* 根组件 */
});

// 将 store 实例作为插件安装
app.use(store);
```

## 核心概念

### state

- 单一状态树(SSOT: single source of truth)

- 一般通过 `computed` 动态获取对应值

  ```js
  const Counter = {
    template: `<div>{{ count }}</div>`,
    computed: {
      count () {
        return this.$store.state.count
      }
    }
  }
  ```

### Getter - 派生状态

```js
// BAD：混入业务代码，不利于复用
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}

// GOOD：使用 getter
const store = createStore({
  state: {
    todos: [....]
  },
  getters: {
    others: () => ....,
    doneTodos (state, getters) {
      // 可以获取 getters.others
      // ...
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

### Mutation  更改  store  的唯一方法

- 使用常量替代 Mutation 事件类型

  ```js
  // mutation-types.js
  export const SOME_MUTATION = 'SOME_MUTATION'
  ```

- **必须是同步函数**

### Action

- 异步支持

### Module

- 解决：单一状态树导致状态过于集中的体积问题
- 命名空间
  - 模块内部的 action 和 mutation 是注册在**全局命名空间**的——这样使得多个模块能够对同一个 action 或 mutation 作出响应
  - 不要在不同的、无命名空间的模块中定义两个相同的 getter 从而导致错误

## 部分实现

### vuex 如何接入 vue 的响应式

```js
import { reactive, ... } from 'vue'

function resetStoreState (...) {
  // ...
  store._state = reactive({
    data: state,
  });
  // ...
}
```

### app.use 插件安装

```js
Store.prototype.install = function install (app, ...) {
    // Vue3 注入 $store 到 this 上
    app.config.globalProperties.$store = this;

    // ...
};
```

### 防止直接/意外设置 state

```js
// set 拦截
set state (v) {
    if (__DEV__) {
      assert(false, `use store.replaceState() to explicit replace store state.`)
    }
  }
```

### Dispatch Action

```js
dispatch (_type, _payload) {
    // check object-style dispatch
    const {
      type,
      payload
    } = unifyObjectStyle(_type, _payload)

    // 构建 Action
    const action = { type, payload }

    // 检查是否配置了对应 actions
    const entry = this._actions[type]
    if (!entry) {
      if (__DEV__) {
        console.error(`[vuex] unknown action type: ${type}`)
      }
      return
    }

    // 触发 subscribeAction 回调
    try {
      this._actionSubscribers
        .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
        .filter(sub => sub.before)
        .forEach(sub => sub.before(action, this.state))
    } catch (e) {
     // ...
    }

    // 触发对应 action 回调
    const result = entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)

    // 触发 subscribeAction 回调
    return new Promise((resolve, reject) => {
      result.then(res => {
       // ...
          this._actionSubscribers
            .filter(sub => sub.after)
            .forEach(sub => sub.after(action, this.state))
      // ...
        resolve(res)
      }, error => {
             // ...
          this._actionSubscribers
            .filter(sub => sub.error)
            .forEach(sub => sub.error(action, this.state, error))
           // ...
        reject(error)
      })
    })
  }
```

### mutation

```js
commit (_type, _payload, _options) {
    // check object-style commit
    const {
      type,
      payload,
      options
    } = unifyObjectStyle(_type, _payload, _options)

    const mutation = { type, payload }

    // 查找对应的 mutation 配置
    const entry = this._mutations[type]
    if (!entry) {
      if (__DEV__) {
        console.error(`[vuex] unknown mutation type: ${type}`)
      }
      return
    }

    // ...

    // 调用 subsciber
    this._subscribers
      .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
      .forEach(sub => sub(mutation, this.state))
// ...
  }
```
