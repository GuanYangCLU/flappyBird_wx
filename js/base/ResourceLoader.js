// 资源文件加载器，确保canvas在图片资源加载后才开始渲染
import { Resources } from './Resources.js';
export class ResourceLoader {
  constructor() {
    this.map = new Map(Resources);
    for (let [key, value] of this.map) {
      // const image = new Image();
      const image = wx.createImage();
      image.src = value;
      this.map.set(key, image);
    }
  }

  onLoaded(callback) {
    let loadedCount = 0;
    for (let value of this.map.values()) {
      value.onload = () => {
        loadedCount ++;
        if (loadedCount >= this.map.size) {
          callback(this.map);
        }
      }
    }
  }

  static create() {
    // factory
    return new ResourceLoader();
  }
}
