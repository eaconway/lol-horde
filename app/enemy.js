import * as HordeUtil from "./horde_util";
import Bullet from './bullet';
import Intersects from 'intersects';

class Enemy {
  constructor(options = {}){
    this.color = options.color || '#b3e0ff';
    this.width = options.width || 50;
    this.height = options.height || 50;

    this.game = options.game;
    this.platform = options.platform;

    let randomX = 0;
    if (this.platform.pos[1] === 550){
      randomX = this.platform.pos[0] + this.platform.width - this.width;
    } else {
      // debugger;
      randomX = Math.floor(Math.random() * (this.platform.width - (this.width * 2) - 2)) +
        (this.platform.pos[0] + this.width + 1);
    }

    this.pos = [randomX, this.platform.pos[1] - this.height - 2]
    this.direction = 1;

    this.image = new Image();
    this.image.src = "../images/sheet_bat_fly.png";

    this.tickCount = 0;
    this.ticksPerFrame = 4;
    this.frameIndex = 0;
    this.numberOfFrames = 4
    this.loop = options.loop;

    this.update = this.update.bind(this);
    this.alive = true;
    this.framesSinceDead = null;
  }

  isCollidedWith(otherObject) {
    let boxPos = [Math.floor(this.pos[0]), Math.floor(this.pos[1])];
    let otherPos = [Math.floor(otherObject.pos[0]), Math.floor(otherObject.pos[1])];

    return Intersects.boxBox(boxPos[0], boxPos[1], this.width, this.height,
    otherPos[0], otherPos[1], otherObject.width, otherObject.height)
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
        this.frameIndex * 128 / this.numberOfFrames,
        3,
        128 / this.numberOfFrames,
        25,
        this.pos[0] + this.game.viewportDiffX,
        this.pos[1],
        this.width,
        this.height);

    } else {
      ctx.save();
      ctx.translate(this.pos[0] + this.game.viewportDiffX + (128 / this.numberOfFrames / 2),this.pos[1]);
      ctx.scale(-1,1);

      ctx.drawImage(this.image,
        this.frameIndex * 128 / this.numberOfFrames,
        3,
        128 / this.numberOfFrames,
        25,
        -(128 / this.numberOfFrames / 2),
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
