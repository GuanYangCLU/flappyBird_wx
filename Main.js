// 初始化整个游戏的精灵，做为游戏开始的入口
import { ResourceLoader } from "./js/base/ResourceLoader.js";
import { DataStore } from "./js/base/DataStore.js";
import { BackGround } from "./js/runtime/BackGround.js";
import { Land } from "./js/runtime/Land.js";
import { Director } from "./js/Director.js";
import { Birds } from "./js/player/Birds.js";
import { StartButton } from "./js/player/StartButton.js";
import { Score } from "./js/player/Score.js";
import { ApiExamples } from "./js/ApiExamples.js";

export class Main {
  constructor() {
    // when move to mini-game devtools, remove index.html and change canvas load to:
    this.canvas = wx.createCanvas();
    // this.canvas = document.getElementById('game_canvas');
    this.ctx = this.canvas.getContext('2d');
    this.dataStore = DataStore.getInstance();
    this.director = Director.getInstance();
    // call factory method
    const loader = ResourceLoader.create();
    loader.onLoaded(map => this.onResourceFirstLoaded(map));
  }

  createBackgroundMusic() {
    const bgm = wx.createInnerAudioContext();
    bgm.autoplay = true;
    bgm.loop = true;
    bgm.src = 'audios/bgm.mp3';
  }

  onResourceFirstLoaded(map) {
    // 给DataStore赋永远不变的值 不随游戏的变化而创建或销毁 故放在dataStore创建的map之外
    // 因为dataStore是单例 这里的赋值将得到持久保存 (放在原型链中)
    this.dataStore.canvas = this.canvas;
    this.dataStore.ctx = this.ctx;
    this.dataStore.res = map;
    // this.createBackgroundMusic();
    const examples = new ApiExamples();
    // examples.getUserInfo();
    // examples.login();
    // examples.getSettings();
    // examples.httpExample();
    // examples.socketExample();
    // examples.download();
    this.init();
  }

  init() {
    this.director.isGameOver = false;
    this.dataStore
      .put('pencils', [])
      .put('background', BackGround)
      .put('land', Land)
      .put('birds', Birds)
      .put('score', Score)
      .put('startButton', StartButton);
    this.registerEvent();
    // 创建铅笔要在游戏逻辑运行之前
    this.director.createPencil();
    this.director.run();
  }

  registerEvent() {
    // Web Dev Use Commented api
    // this.canvas.addEventListener('touchstart', e => {
    //   // 屏蔽js原来的事件冒泡
    //   e.preventDefault();
    //   if (this.director.isGameOver) {
    //     this.init();
    //   } else {
    //     this.director.birdsEvent();
    //   }
    // })
    // Wechat Mini Game use this api
    wx.onTouchStart(() => {
      if (this.director.isGameOver) {
        this.init();
      } else {
        this.director.birdsEvent();
      }
    });
  }
}
