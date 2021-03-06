// 导演类，控制游戏的逻辑
// 统管所有的逻辑运行、创建、销毁
import { DataStore } from "./base/DataStore.js";
import { UpPencil } from "./runtime/UpPencil.js";
import { DownPencil } from "./runtime/DownPencil.js";
// 单例模式
export class Director {
  static getInstance() {
    if (!Director.instance) {
      Director.instance = new Director();
    }
    return Director.instance;
  }

  constructor() {
    this.dataStore = DataStore.getInstance();
    this.moveSpeed = 2;
  }

  createPencil() {
    const minTop = DataStore.getInstance().canvas.height / 8;
    const maxTop = DataStore.getInstance().canvas.height / 2;
    const top = minTop + Math.random() * (maxTop - minTop);
    this.dataStore.get('pencils').push(new UpPencil(top));
    this.dataStore.get('pencils').push(new DownPencil(top));
  }

  birdsEvent() {
    for (let i = 0; i <= 2; i++) {
      this.dataStore.get('birds').y[i] = this.dataStore.get('birds').birdsY[i];
    }
    // 如果不把time置0 重力加速度运动计算就没有重置时间 会显示小鸟持续掉落 (time越来越大)
    this.dataStore.get('birds').time = 0;
  }

  // 判断小鸟是否和铅笔撞击
  static isStrike(bird, pencil) {
    let s = false;
    if (
      bird.top > pencil.bottom ||
      bird.bottom < pencil.top ||
      bird.right < pencil.left ||
      bird.left > pencil.right
    ) {
      s = true;
    }
    return !s;
  }

  // 判断小鸟是否撞击地板和铅笔
  check() {
    const birds = this.dataStore.get('birds');
    const land = this.dataStore.get('land');
    const score = this.dataStore.get('score');
    const pencils = this.dataStore.get('pencils');
    // 地板的撞击判断
    if (birds.birdsY[0] + birds.birdsHeight[0] >= land.y) {
      this.isGameOver = true;
      return;
    }
    // 小鸟的边框模型
    const birdsBorder = {
      top: birds.y[0],
      bottom: birds.birdsY[0] + birds.birdsHeight[0],
      left: birds.birdsX[0],
      right: birds.birdsX[0] + birds.birdsWidth[0]
    };

    const length = pencils.length;
    for (let i = 0; i < length; i++) {
      const pencil = pencils[i];
      const pencilBorder = {
        top: pencil.y,
        bottom: pencil.y + pencil.height,
        left: pencil.x,
        right: pencil.x + pencil.width
      };
      if (Director.isStrike(birdsBorder, pencilBorder)) {
        this.isGameOver = true;
        return;
      }
    }

    // 加分逻辑
    if (
      birds.birdsX[0] > pencils[0].x + pencils[0].width &&
      score.isScore
    ) {
      wx.vibrateShort({
        success: function () {}
      });
      score.isScore = false;
      score.scoreNumber++;
    }
  }

  run() {
    this.check();
    if (!this.isGameOver) {
      this.dataStore.get('background').draw();

      const pencils = this.dataStore.get('pencils');
      if (pencils[0].x + pencils[0].width <= 0 && pencils.length === 4) {
        // pop left up and down pencils as a group
        pencils.shift();
        pencils.shift();
        this.dataStore.get('score').isScore = true;
      }
      if (pencils[0].x <= (DataStore.getInstance().canvas.width - pencils[0].width) / 2 && pencils.length === 2) {
        this.createPencil();
      }
      this.dataStore.get('pencils').forEach(function (value) {
        value.draw();
      });
      this.dataStore.get('land').draw();
      this.dataStore.get('score').draw();
      this.dataStore.get('birds').draw();

      // console.log(this.dataStore.map);
      // 考虑浏览器性能的按时操作 在每一次浏览器刷新之前执行 效率远远高于setTimeout和setInterval
      let timer = requestAnimationFrame(() => this.run());
      this.dataStore.put('timer', timer);
    } else {
      this.dataStore.get('startButton').draw();
      cancelAnimationFrame(this.dataStore.get('timer'));
      // clear unnecessary variables
      this.dataStore.destroy();
      // 触发微信小游戏垃圾回收
      wx.triggerGC();
    }
  }
}
