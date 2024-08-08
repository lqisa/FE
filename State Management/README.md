# State Management

## Vuex VS Pinia

[来源](https://pinia.vuejs.org/zh/introduction.html#comparison-with-vuex)
Pinia API 与 Vuex(<=4) 也有很多不同，即：

- **mutation 已被弃用**。它们经常被认为是极其冗余的。它们初衷是带来 devtools 的集成方案，但这已不再是一个问题了。

- 无需要创建自定义的复杂包装器来**支持 TypeScript**，一切都可标注类型，API 的设计方式是尽可能地利用 TS 类型推理。

- 无过多的**魔法字符串**注入，只需要导入函数并调用它们，然后享受自动补全的乐趣就好。

  ```js
  // EXAMPLE FROM GPT 仅供参考

  /**
   **  VUEX
   **/
  // mutation-types.js
  export const SET_USER = "SET_USER";

  const mutations = {
    SET_USER(state, user) {
      state.user = user;
    },
  };

  // 通过字符串类型的 key 来调用
  store.commit(SET_USER, user);

  /**
   **  Pinia
   **/
  // 定义 store
  const useUserStore = defineStore("user", {
    state: () => ({
      user: null,
    }),
    actions: {
      setUser(user) {
        this.user = user;
      },
    },
  });
  // 使用 store
  const userStore = useUserStore();
  userStore.setUser(user);
  ```

- 无需要动态添加 Store，它们默认都是动态的，甚至你可能都不会注意到这点。注意，你仍然可以在任何时候手动使用一个 Store 来注册它，但因为它是自动的，所以你不需要担心它。

  - [Vuex 部分动态注册场景](https://vuex.vuejs.org/zh/guide/modules.html#%E6%A8%A1%E5%9D%97%E5%8A%A8%E6%80%81%E6%B3%A8%E5%86%8C)

- **不再有嵌套结构的模块**。你仍然可以通过导入和使用另一个 Store 来隐含地嵌套 stores 空间。虽然 Pinia 从设计上提供的是一个扁平的结构，但仍然能够在 Store 之间进行交叉组合。你甚至可以让 Stores 有循环依赖关系。

- 不再有可命名的模块。考虑到 Store 的扁平架构，Store 的命名取决于它们的定义方式，你甚至可以说所有 Store 都应该命名。
