import * as HordeUtil from "./horde_util";
import StaticObject from './static_object';
import Player from './player';
import Bullet from './bullet';

const DEFAULTS = {
    COLOR: "#ff0000",
    RADIUS: 25,
    SPEED: 4
};

class Platform extends StaticObject {
    constructor(options = {}) {
        options.color = DEFAULTS.COLOR;
        options.pos = options.pos;
        options.height = 50;
        // options.radius = DEFAULTS.RADIUS;
        // options.vel = options.vel || HordeUtil.randomVec(DEFAULTS.SPEED);
        // console.log('creating platform' , options);
        super(options);

        this.image = new Image();
        this.image.src = "../images/platform_ground.png";
        // this.pos = options.pos;
        this.center = [this.pos[0] + options.width/2, this.pos[1] + options.height/2];
    }

    draw(ctx){
      ctx.drawImage(this.image,
        0,0, 100, 20,
        this.pos[0] + this.game.viewportDiffX, this.pos[1], this.width, this.height);
    }

    collideWith(otherObject) {
        // if (otherObject instanceof Player) {
        //     otherObject.relocate();
        //     return true;
        // } else if (otherObject instanceof Bullet) {
        //     this.remove();
        //     otherObject.remove();
        //     return true;
        // }
        //
        return false;
    }

    isCollidedWith(otherObject) {
      // if (otherObject instanceof Player || otherObject instanceof Player  )
      // const centerDist = HordeUtil.dist(this.pos, otherObject.pos);
      // return centerDist < (this.radius + otherObject.radius);
      // if (otherObject instanceof Player) {
      //   let y_diff = this.pos[1] - otherObject.pos[1];
      //   if (y_diff < otherObject.height){
      //     return true;
      //   }
      //   return false;s
      //
      // } else {
      // let top =
      // let bottom
      // let cpos = otherObject.pos
      let circleDistance = {};

      circleDistance.x = Math.abs(otherObject.pos[0] - this.center[0]);
      circleDistance.y = Math.abs(otherObject.pos[1] - this.center[1]);

      if (circleDistance.x > (this.width/2 + otherObject.radius)) { return false; }
      if (circleDistance.y > (this.height/2 + otherObject.radius)) { return false; }

      if (circleDistance.x <= (this.width/2)) { return true; }
      if (circleDistance.y <= (this.height/2)) { return true; }

      let cornerDistance_sq = (circleDistance.x - this.width/2)^2 + (circleDistance.y - this.height/2)^2;
      return (cornerDistance_sq <= (otherObject.radius^2));
      // // if()
      //   let y_diff = this.pos[1] - otherObject.pos[1];
      //   if (y_diff < otherObject.radius){
      //     return true;
      //   }
      //   return false;
      // // }
    }
}

export default Platform;
