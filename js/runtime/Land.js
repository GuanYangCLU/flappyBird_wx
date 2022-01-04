import { Sprite } from "../base/Sprite.js";
import { Director } from "../Director.js";
import { DataStore } from "../base/DataStore.js";

export class Land extends Sprite {
  constructor() {
    const image = Sprite.getImage('land');
    super(
      image,
      0, 0, image.width, image.height,
      0, DataStore.getInstance().canvas.height - image.height, image.width, image.height
    );
    // land x mutate pos
    this.landX = 0;
    this.landSpeed = Director.getInstance().moveSpeed;
  }

  draw() {
    this.landX = this.landX + this.landSpeed;
    // keep loading land when moving
    if (this.landX > (this.img.width - DataStore.getInstance().canvas.width)) {
      this.landX = 0;
    }
    // console.log(this.image);
    super.draw(
      this.image,
      this.srcX, this.srcY, this.srcW, this.srcH,
      -this.landX, this.y, this.width, this.height
    );
  }
}
