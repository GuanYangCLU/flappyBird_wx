// 变量缓存器，方便我们在不同类中访问和修改变量
// 统一管理数据
// 全局只有一个Data Store
export class DataStore {
  static getInstance() {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  constructor() {
    this.map = new Map();
  }

  // 实现链式调用连续赋值
  put(key, value) {
    if (typeof value === 'function') {
      value = new value();
    }
    this.map.set(key, value);
    return this;
  }

  get(key) {
    return this.map.get(key);
  }

  destroy() {
    for (let value of this.map.values()) {
      value = null;
    }
  }
}
