import * as HordeUtil from "./horde_util";
import Bullet from './bullet';

class Enemy {
  constructor(options = {}){
    this.color = options.color || '#b3e0ff';
    this.width = options.width || 50;
    this.height = options.height || 50;

    this.game = options.game;
    this.platform = options.platform;
    this.pos = [this.platform.pos[0] + this.width, this.platform.pos[1] - this.height - 2]
    this.direction = 1;

    this.image = new Image();
    this.image.src = "images/sheet_snake_walk.png";

    this.tickCount = 0;
    this.ticksPerFrame = 4;
    this.frameIndex = 0;
    this.numberOfFrames = 7
    this.loop = options.loop;

    this.update = this.update.bind(this);
  }

  update(){
    this.tickCount += 1;

    if (this.tickCount > this.ticksPerFrame) {

    	this.tickCount = 0;

      // If the current frame index is in range
      if (this.frameIndex < this.numberOfFrames - 1) {
          // Go to the next frame
          this.frameIndex += 1;
      } else {
          this.frameIndex = 0;
      }
    }
  }

  draw(ctx) {
    if (this.direction === -1){
      ctx.drawImage(this.image,
        this.frameIndex * 448 / this.numberOfFrames,
        0,
        448 / this.numberOfFrames,
        64,
        this.pos[0],
        this.pos[1],
        this.width,
        this.height);

    } else {
      ctx.save();
      ctx.translate(this.pos[0] + (448 / this.numberOfFrames / 2),this.pos[1]);
      ctx.scale(-1,1);

      ctx.drawImage(this.image,
        this.frameIndex * 448 / this.numberOfFrames,
        0,
        448 / this.numberOfFrames,
        64,
        -(448 / this.numberOfFrames / 2),
        0,
        this.width,
        this.height);

      ctx.restore();
    }
  }

  validMove(nextLoc){
    if (nextLoc[0] > (this.platform.pos[0]) &&
      nextLoc[0] < (this.platform.pos[0] + this.platform.width - this.width)){
      return true;
    } else {
      return false;
    }
  }

  move(){
    this.update();

    let nextLoc = [this.pos[0] + (this.direction), this.pos[1]];

    if (this.validMove(nextLoc)){
      this.pos = nextLoc;
    } else {
      this.direction = -(this.direction);
      this.pos = [this.pos[0] + (this.direction * 2), this.pos[1]];
    }
  }
}

export default Enemy;
