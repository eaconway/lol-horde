// import StaticObject from './environment';
import MovingObject from './moving_object';
import * as HordeUtil from "./horde_util";
import Bullet from './bullet';
import Platform from './platform';
import Intersection from 'intersection';
import LineIntersection from 'line-intersection';
import intersects from 'rectangles-intersect';

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
      super(options);

      this.move = this.move.bind(this);
      this.isCollidedWith = this.isCollidedWith.bind(this);
      this.playerMove = this.playerMove.bind(this);
      this.fireBullet = this.fireBullet.bind(this);
      this.nextValidMove = this.nextValidMove.bind(this);
      this.draw = this.draw.bind(this);
      this.drawWalk = this.drawWalk.bind(this);
      this.drawIdle = this.drawIdle.bind(this);
      this.drawJump = this.drawJump.bind(this);
      this.grounded = false;
      this.width = options.width;
      this.height = options.height;
      this.isMovingX = false;
      this.platformOn = null;

      this.facing = 1; //1 is facing right
      this.playerCorners = [
        this.pos, [this.pos[0] + this.width, this.pos[1] ],
        [this.pos[0] + this.width, this.pos[1] + this.height ],
        [this.pos[0], this.pos[1] + this.height]
      ];

      this.image = new Image();
      this.image.src = "images/hero_spritesheet.png";

      this.tickCount = 0;
      this.ticksPerFrame = 4;
      this.frameIndex = 0;
      this.numberOfFrames = 8
      this.startY = 10;
      this.loop = options.loop;
      this.drawMode = 'idle';
      this.lastDrawMode = 'idle';

      this.update = this.update.bind(this);

      this.alive = true;
      this.framesSinceDead = null;
   }

  update(){
    this.tickCount += 1;

    if (this.drawMode != this.lastDrawMode){
      this.frameIndex = 0;
      this.lastDrawMode = this.drawMode;
    }

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

  fireBullet() {
      const norm = HordeUtil.norm(this.vel);

      console.log('facing is', this.facing)
      const bullet = new Bullet({
          pos: [this.pos[0] + this.width/2, this.pos[1] + this.height/2],
          vel: [this.facing * 8, 0],
          color: this.color,
          game: this.game,
          origin: this
      });

      this.game.add(bullet);
  }

  playerMove(move) {
    // MOVING VERTICALLY
    if (move[0] === 0){
      if (this.grounded && move[1] < 0){
        // console.log('jump', jump)
        let new_vel = move[1] * 17;
        this.vel[1] = Math.min(30, new_vel);
      }
    } else if (move[1] === 0) {
      // MOVING HORIZONTALLY
      this.vel[0] = move[0] * 4;

      //Change orientation
      if (this.facing > 0 && move[0] < 0){
        // console.log('change facing');
        this.facing = -1;
      } else if (this.facing < 0 && move[0] > 0){
        this.facing = 1;
      }
    }
  }

  nextValidMove(offsetX, offsetY){
    let collided = false;
    // determine next location. If grounded, not jumping, and
    // moving horizontally, adjust
    let nextOriginLoc = [Math.floor(this.pos[0] + offsetX), Math.floor(this.pos[1] + offsetY)];

    if(this.platformOn != null && ((this.platformOn.pos[0] > this.pos[0] &&
        this.platformOn.pos[0] > (this.pos[0] + this.width)) ||
        ((this.platformOn.pos[0] + this.platformOn.width) < this.pos[0] &&
        (this.platformOn.pos[0] + this.platformOn.width) < (this.pos[0] + this.width)))) {
          this.grounded = false;
    } else if (this.grounded && this.vel[0] === 0 && this.vel[1] > 0) {
      return this.pos;
    } else {
      this.grounded = false;
      this.platformOn = null;
    }

    console.log('this pos', this.pos);
    console.log('next pos', nextOriginLoc );
    console.log('velocity', this.vel);
    let next_loc = '';

    let playerCorners = [
      [Math.floor(this.pos[0]),Math.floor(this.pos[1])],
      [Math.floor(this.pos[0] + this.width), Math.floor(this.pos[1])],
      [Math.floor(this.pos[0] + this.width), Math.floor(this.pos[1] + this.height)],
      [Math.floor(this.pos[0]), Math.floor(this.pos[1] + this.height)]
    ];

    // find all the platforms and iterate through them
    let platforms = this.game.platforms;

    for (let i = 0; i < platforms.length; i++) {
      let platform = platforms[i];

      let shortestPlatformSide = [];
      let smallest_dist_intersected = '';
      let cornerIntersect = '';
      let cornerOrigin = '';

      // for each platform, check all corners
      for (let j = 0; j < playerCorners.length; j++){
        let corner = playerCorners[j];

        let platformLines = [
          [[platform.pos[0], platform.pos[1]], [platform.pos[0] + platform.width, platform.pos[1]], { x: 0, y: -1}, 'top'],
          [[platform.pos[0] + platform.width, platform.pos[1]], [platform.pos[0] + platform.width, platform.pos[1] + platform.height], { x: 1, y: 0}, 'right'],
          [[platform.pos[0] + platform.width, platform.pos[1] + platform.height], [platform.pos[0], platform.pos[1] + platform.height], { x: 0, y: 1}, 'bottom'],
          [[platform.pos[0], platform.pos[1]], [platform.pos[0], platform.pos[1]+ platform.height], { x: -1, y: 0}, 'left']
        ];

        if (this.grounded && this.vel[1] > 0 && this.vel[0] != 0){
          next_loc = [Math.floor(corner[0] + offsetX), Math.floor(corner[1])];
        } else {
          next_loc = [Math.floor(corner[0] + offsetX), Math.floor(corner[1] + offsetY)];
        }

        // Iterate through sides for intersections
        for (let k = 0; k < platformLines.length; k++){
          let line = platformLines[k];

          let pLine = [Math.floor(line[0][0]), Math.floor(line[0][1]),
              Math.floor(line[1][0]), Math.floor(line[1][1])];

          let intersection = LineIntersection.findSegmentIntersection([
            { x: corner[0], y: corner[1]},
            { x: next_loc[0], y: next_loc[1]},
            { x: pLine[0], y: pLine[1]},
            { x: pLine[2], y: pLine[3]}
          ]);

          if (intersection != false){
            let dist = Math.abs(
              ((intersection.x - corner[0])^2 + (intersection.y - corner[1])^2)^(1/2)
            );

            if (smallest_dist_intersected === ""  || dist < smallest_dist_intersected){
              shortestPlatformSide  = line;
              cornerIntersect = intersection;
              smallest_dist_intersected = dist;
              cornerOrigin = corner;
            }
          }
        };
      };

      console.log('cornerIntersect', cornerIntersect);

      if (cornerIntersect != '') {
        // find shortest distance from intersect
        // let unit_divisor = ((this.vel[0])^2 + (this.vel[1])^2)^(1/2);
        let unit_divisor = Math.pow((Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2)), .5);
        let unit_vect = [(0 - this.vel[0])/unit_divisor, (0 - this.vel[1])/unit_divisor];
        let unit_vect_dirs = [];

        unit_vect.forEach(num => {
          if (num != 0){
            unit_vect_dirs.push(num/Math.abs(num));
          } else {
            unit_vect_dirs.push(0);
          }
        });

        // Intersect +/- unit vector +/- adjustment to avoid collision
        console.log('unit vector x', unit_vect[0]);
        console.log('unit vector y', unit_vect[1]);

        let new_x = cornerIntersect.x + unit_vect_dirs[0]
        let new_y = cornerIntersect.y + unit_vect_dirs[1]

        //adjust next_loc based on corner
        // debugger
        switch(cornerOrigin) {
          case(playerCorners[0]):
          // console.log('top-left');
          next_loc = [new_x, new_y];
          break;
          case(playerCorners[1]):
          // console.log('top-right');
          next_loc = [new_x - this.width, new_y];
          break;
          case(playerCorners[2]):
          // console.log('bottom-right');
          next_loc = [new_x - this.width, new_y - this.height];
          break;
          case(playerCorners[3]):
          // console.log('bottom-left');
          next_loc = [new_x, new_y - this.height];
          break;
        }

        switch(shortestPlatformSide[3]){
          case 'top':
            this.vel[1] = 1;
            this.grounded = true;
            break;
          case 'right':
            this.vel[0] = 0;
            break;
          case 'bottom':
            this.vel[1] = 1;
            break;
          case 'left':
            this.vel[0] = 0;
            break;
          default:
            break;
        }

        this.platformOn = platform;
        this.collided = true;
        return next_loc;

      }
    }
    // there were no collisions, so return next_loc as is
    return nextOriginLoc;
  };

  move(timeDelta) {
    this.update();

    let terminal_vel_Y = 15;
    let deceleration_Y = 1;
    let deceleration_X = 0.3;

    //GRAVITY - Vertical Deceleration
    if (this.vel[1] < terminal_vel_Y && this.grounded === false) {
      this.vel[1] += deceleration_Y;
    }

    if (this.isMovingX === false) {
      this.vel[0] = 0;
    }

    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
    offsetX = Number(Number.parseFloat(this.vel[0] * velocityScale).toPrecision(3)),
    offsetY =  Number(Number.parseFloat(this.vel[1] * velocityScale).toPrecision(3));

    this.pos = this.nextValidMove(offsetX, offsetY);
  }

  draw(ctx){
    if(this.grounded && this.vel[0] === 0){
      this.drawIdle(ctx);
    } else if (this.grounded){
      this.drawWalk(ctx);
    } else if (!this.grounded){
      this.drawJump(ctx);
    }
  }

  drawIdle(ctx) {
    this.numberOfFrames = 8;
    this.startY = 10;
    this.ticksPerFrame = 4;
    this.drawMode = 'idle';
    // ctx.clearRect(this.pos[0], this.pos[1], this.width, this.height);
    // console.log('drawing idle');
    if (this.facing === 1) {
      ctx.drawImage(this.image,
        // this.frameIndex * 62,
        (this.frameIndex * 640 / this.numberOfFrames) + 5, this.startY,
        65,73,
        this.pos[0] + this.game.viewportDiffX, this.pos[1], this.width, this.height);
    } else {
      ctx.save();
      ctx.translate(this.pos[0] + this.game.viewportDiffX + (65 / 2),this.pos[1]);
      ctx.scale(-1,1);

      ctx.drawImage(this.image,
        // this.frameIndex * 65,
        (this.frameIndex * 640 / this.numberOfFrames) + 5, this.startY,
        65, 73,
        -(65 / 2), 0, this.width, this.height);

      ctx.restore();
    }
  }

  drawWalk(ctx) {
    this.numberOfFrames = 6;
    this.startY = 110;
    this.ticksPerFrame = 16;
    this.drawMode = 'walk';
    // ctx.clearRect(this.pos[0] + this.game.viewportDiffX, this.pos[1], this.width, this.height);
    // console.log('drawing walking');
    if (this.facing === 1) {
      ctx.drawImage(this.image,
        // this.frameIndex * 62,
        (this.frameIndex * 480 / this.numberOfFrames) + 5, this.startY,
        65,73,
        this.pos[0] + this.game.viewportDiffX, this.pos[1], this.width, this.height);
    } else {
      ctx.save();
      ctx.translate(this.pos[0] + this.game.viewportDiffX + (65 / 2),this.pos[1]);
      ctx.scale(-1,1);

      ctx.drawImage(this.image,
        // this.frameIndex * 65,
        (this.frameIndex * 480 / this.numberOfFrames) + 5, this.startY,
        65, 73,
        -(65 / 2), 0, this.width, this.height);

      ctx.restore();
    }
  }

  drawJump(ctx) {
    this.numberOfFrames = 3;
    this.startY = 290;
    this.ticksPerFrame = 10;
    this.drawMode = 'jump';
    // ctx.clearRect(this.pos[0] + this.game.viewportDiffX, this.pos[1], this.width, this.height);

    if (this.facing === 1) {
      ctx.drawImage(this.image,
        // this.frameIndex * 62,
        (this.frameIndex * 240 / this.numberOfFrames) + 5, this.startY,
        65,79,
        this.pos[0] + this.game.viewportDiffX, this.pos[1], this.width, this.height);
    } else {
      ctx.save();
      ctx.translate(this.pos[0] + this.game.viewportDiffX + (65 / 2),this.pos[1]);
      ctx.scale(-1,1);

      ctx.drawImage(this.image,
        // this.frameIndex * 65,
        (this.frameIndex * 240 / this.numberOfFrames) + 5, this.startY,
        65, 79,
        -(65 / 2), 0, this.width, this.height);

      ctx.restore();
    }
  }

  collideWith(otherObject) {
    if (otherObject instanceof Platform){
      // console.log('its a platform')
      this.grounded = true;
      this.vel[1] = 0;
    }

  }
}

Player.RADIUS = 15;
const NORMAL_FRAME_TIME_DELTA = 1000 / 60;

export default Player;
