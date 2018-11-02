// import StaticObject from './environment';
import MovingObject from './moving_object';
import * as HordeUtil from "./horde_util";
import Bullet from './bullet';
import Platform from './platform';

function randomColor() {
    const hexDigits = "0123456789ABCDEF";

    let color = "#";
    for (let i = 0; i < 3; i++) {
        color += hexDigits[Math.floor((Math.random() * 16))];
    }

    return color;
}

class Player extends MovingObject {
    constructor(options) {
        // options.radius = Player.RADIUS;
        options.width = 50;
        options.height = 50;
        options.vel = [0, 1];
        options.color = options.color || randomColor();
        // options.color = options.color || '#e51709';
        super(options);

        // this.center = [options.pos[0] + (options.width/2), options.pos[1] + (options.height/2)];
        // this.pos = options.pos;
        this.move = this.move.bind(this);
        this.isCollidedWith = this.isCollidedWith.bind(this);
        this.playerMove = this.playerMove.bind(this);
        this.facing = 1; //1 is facing right
        this.fireBullet = this.fireBullet.bind(this);
        this.draw = this.draw.bind(this);
        this.grounded = false;
        this.width = options.width;
        this.height = options.height;

        this.image = new Image();
        this.image.src = "images/sheet_hero_idle.png";
        console.log('image created' , this.image)

     }

    fireBullet() {
        const norm = HordeUtil.norm(this.vel);

        // if (norm === 0) {
        //     // Can't fire unless moving.
        //     return;
        // }

        // const relVel = HordeUtil.scale(
        //     HordeUtil.dir(this.vel),
        //     Bullet.SPEED
        // );
        //
        // const bulletVel = [
        //     relVel[0] + this.vel[0], relVel[1] + this.vel[1]
        // ];
        console.log('facing is', this.facing)
        const bullet = new Bullet({
            pos: this.pos,
            vel: [this.facing* 8, 0],
            color: this.color,
            game: this.game
        });

        this.game.add(bullet);
    }

    playerMove(move) {
      // console.log('running player power', move)
        // this.vel[0] += impulse[0];
        // this.vel[1] += impulse[1];
      // console.log()

      let next_loc = [this.pos[0] + move[0], this.pos[1] + move[1]];
      console.log('next loc, player moved ', next_loc);
      if (!this.validMove(next_loc)){
        if (move[0] === 0){
          // if (!this.validMoveY(next_loc)){
          this.pos[1] += move[1];
          this.vel[1] = move[1] * 20;
          // }
        } else if (move[1] === 0) {
          this.pos[0] += move[0];
          this.vel[0] = move[0] * 6;

          //Change orientation
          if (this.facing > 0 && move[0] < 0){
            console.log('change facing');
            this.facing = -1;
          } else if (this.facing < 0 && move[0] > 0){
            this.facing = 1;
          }
        }
      }
    }

    validMoveX(next_loc){
      //check for collisions
      let collided = false;
      // debugger
      this.game.platforms.some(platform => {
        // let circleDistance = {};
        // circleDistance.x = Math.abs(platform.center[0] - next_loc[0]) - 1;
        //
        // if (circleDistance.x > (platform.width/2 + this.radius)) {
        //    return collided;
        // }
        //
        // if (circleDistance.x <= (platform.width/2 + this.radius)) {
        //    return collided = true;
        // }
        //
        // let cornerDistance_sq = Math.abs(circleDistance.x - platform.width/2)^2 +
        //   Math.abs(circleDistance.y - platform.height/2)^2;
        //
        // if (cornerDistance_sq <= (this.radius^2)) {
        //   return collided = true;
        // }
        // console.log('player', this.pos);
        // console.log('platform pos', platform.pos);
        // console.log('platform', platform);
        if (this.pos[0] < platform.pos[0] + platform.width &&
           this.pos[0] + this.width > platform.pos[0]) {
          return collided = true;
        }

      });
      console.log('collided?', collided);
      //check if in bounds
      // if (this.game.isOutOfBounds(next_loc)) {return true};
      console.log('x collision', collided);
      return collided;
    }

    validMoveY(next_loc){
      //check for collisions
      let collided = false;

      this.game.platforms.some(platform => {
        // let circleDistance = {};
        //
        // circleDistance.y = Math.abs(platform.center[1] - next_loc[1]) - 1;
        // if (circleDistance.y > (platform.height/2 + this.radius)) {
        //    return collided;
        // }
        //
        // if (circleDistance.y <= (platform.height/2 + this.radius)) {
        //    return collided = true;
        // }
        //
        // let cornerDistance_sq = Math.abs(circleDistance.x - platform.width/2)^2 +
        //   Math.abs(circleDistance.y - platform.height/2)^2;
        //
        // if (cornerDistance_sq <= (this.radius^2)) {
        //   return collided = true;
        // }
        // console.log('player', this.pos);
        // console.log('platform pos', platform.pos);
        // console.log('platform', platform);
        if (this.pos[1] < platform.pos[1] + platform.height &&
           this.pos[1] + this.height > platform.pos[1]) {
            return collided = true;
        }

      });

      //check if in bounds
      // if (this.game.isOutOfBounds(next_loc)) {return true};
      console.log('y collision', collided);
      return collided;
    }

    validMove(next_loc){
      let collided = false;

      this.game.platforms.some(platform => {
        if (next_loc[0] < platform.pos[0] + platform.width &&
           next_loc[0] + this.width > platform.pos[0] &&
           next_loc[1] < platform.pos[1] + platform.height &&
           next_loc[1] + this.height > platform.pos[1]) {

            return collided = true;
        }
      });

      return collided;
    }

    move(timeDelta) {

        if (this.vel[1] < 20) {
          this.vel[1] += 1;
        }

        if (this.vel[0] > 0){
          this.vel[0] -= 0.1;
        } else if (this.vel[0] < 0) {
          this.vel[0] += 0.1 ;
        }

        const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
        offsetX = this.vel[0] * velocityScale,
        offsetY = this.vel[1] * velocityScale;
        console.log(offsetX, offsetY)

        let next_loc = '';
        if (this.grounded){
          next_loc = [this.pos[0] + offsetX, this.pos[1]];
        } else {
          next_loc = [this.pos[0] + offsetX, this.pos[1] + offsetY];
        }
        // this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
        //
        // if (!this.validMoveX(next_loc)){
        //   // console.log('valid move');
        //   this.pos[0] = next_loc[0];
        // }
        // //
        // if (!this.validMoveY(next_loc)){
        //   // console.log('valid move');
        //   this.pos[1] = next_loc[1];
        // }
        if (this.validMove(next_loc)){
          // this.pos = next_loc;
          this.grounded = true;
          console.log('grounded', this.grounded);
        } else {
          this.grounded = false;
          console.log('grounded', this.grounded);
          this.pos = next_loc;
        }
    }

    // valid_move?()

    collideWith(otherObject) {
      if (otherObject instanceof Platform){
        // console.log('its a platform')
        this.grounded = true;
        this.vel[1] = 0;
      }

    }

    step(move) {

    }

    relocate() {
        this.pos = this.game.randomPosition();
        // this.vel = [0, 0];
    }

    isCollidedWith(otherObject) {
      // if (otherObject instanceof Player || otherObject instanceof Player  )
      // const centerDist = HordeUtil.dist(this.pos, otherObject.pos);
      // return centerDist < (this.radius + otherObject.radius);


      if (otherObject instanceof Platform) {
        // console.log('checking for player plat collision');

        let circleDistance = {};

        circleDistance.x = Math.abs(otherObject.center[0] - this.pos[0]);
        circleDistance.y = Math.abs(otherObject.center[0] - this.pos[0]);

        if (circleDistance.x > (otherObject.width/2 + this.radius)) { return false; }
        if (circleDistance.y > (otherObject.height/2 + this.radius)) { return false; }

        if (circleDistance.x <= (otherObject.width/2)) { return true; }
        if (circleDistance.y <= (otherObject.height/2)) { return true; }

        let cornerDistance_sq = (circleDistance.x - otherObject.width/2)^2 + (circleDistance.y - otherObject.height/2)^2;
        return (cornerDistance_sq <= (this.radius^2));

      } else {
        // debugger;
        const centerDist = HordeUtil.dist(this.pos, otherObject.pos);
        return centerDist < (this.radius + otherObject.radius);
      }
    }

    draw(ctx) {
      // debugger;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // c.fillStyle = "black";
        // c.lineWidth = 2.0;
        // c.beginPath();
        // ctx.arc(
        //     this.pos[0], this.pos[1], Player.RADIUS, 0, 2 * Math.PI, true
        // );

        // ctx.moveTo(this.pos[0], this.pos[1]);
        // ctx.lineTo(this.pos[0] + this.width, this.pos[1]);
        // ctx.lineTo(this.pos[0] + this.width, this.pos[1] + this.height);
        // ctx.lineTo(this.pos[0], this.pos[1] + this.height);
        // ctx.stroke();


        ctx.moveTo(this.pos[0], this.pos[1]);
        ctx.drawImage(this.image,
           0,
           35,
           50,
           30,
           this.pos[0],
           this.pos[1],
           this.width,
           this.height);
        ctx.fill();
    }
}

Player.RADIUS = 15;
const NORMAL_FRAME_TIME_DELTA = 1000 / 60;

export default Player;
