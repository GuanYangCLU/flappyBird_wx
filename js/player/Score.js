import { DataStore } from "../base/DataStore.js";

export class Score {
  constructor() {
    this.ctx = DataStore.getInstance().ctx;
    this.scoreNumber = 0;
    // 因为canvas刷新很快 需要一个变量控制加分只加一次
    this.isScore = true;
  }

  draw() {
    // Arial available for all browser
    this.ctx.font = '25px Arial';
    this.ctx.fillStyle = '#ffcbeb';
    this.ctx.fillText(
      this.scoreNumber,
      DataStore.getInstance().canvas.width / 2,
      DataStore.getInstance().canvas.height / 18,
      // 限定字体最大大小 (optional)
      1000
    )
  }
}
