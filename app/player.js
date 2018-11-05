// import StaticObject from './environment';
import MovingObject from './moving_object';
import * as HordeUtil from "./horde_util";
import Bullet from './bullet';
import Platform from './platform';
import Intersection from 'intersection';

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
        this.nextValidMove = this.nextValidMove.bind(this);
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
          // if (this.grounded === true && move[1] > 0) { return; }
          if (this.grounded && move[1] < 0){
            this.pos[1] += move[1];
            this.vel[1] = move[1] * 20;
            this.grounded = false;
          }
          // }
        } else if (move[1] === 0) {
          this.pos[0] += move[0];
          this.vel[0] = move[0] * 3;

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



    nextValidMove(offsetX, offsetY){
      let collided = false;

      let next_loc = [this.pos[0] + offsetX, this.pos[1] + offsetY];

      this.game.platforms.some(platform => {
        if (next_loc[0] < platform.pos[0] + platform.width &&
           next_loc[0] + this.width > platform.pos[0] &&
           next_loc[1] < platform.pos[1] + platform.height &&
           next_loc[1] + this.height > platform.pos[1]) {

            // this.grounded = true;
            // debugger;

            // if (this.grounded === true){
            //   return [this.pos[0] + offsetX, this.pos[1]];
            // }


            // if we're not grounded, check where we hit next box
            // let slope = (next_loc[1] - this.pos[1])/(next_loc[0] - this.pos[0]);

            let x = 0;
            // let y = slope(x - this.[0]) + this.pos[1];

            let smallest_dist_intersected = '';
            let shortest_line = {};
            let intersect = '';
            // let results = { dist: point };

            let platformLines = [
              [[platform.pos[0], platform.pos[1]], [platform.pos[0] + platform.width, platform.pos[1]], { x: 0, y: -1}],
              [[platform.pos[0] + platform.width, platform.pos[1]], [platform.pos[0] + platform.width, platform.pos[1] + platform.height], { x: 1, y: 0}],
              [[platform.pos[0] + platform.width, platform.pos[1] + platform.height], [platform.pos[0], platform.pos[1] + platform.height], { x: 0, y: 1}],
              [[platform.pos[0], platform.pos[1]], [platform.pos[0], platform.pos[1]+ platform.height], { x: -1, y: 0}]
            ];

            platformLines.some(line => {
              let intersection = Intersection.intersect(
                { start:{ x: this.pos[0], y: this.pos[1]}, end:{x: next_loc[0], y: next_loc[1]} },
                { start:{ x: line[0][0], y: line[0][1]}, end:{x: line[1][0], y: line[1][1]} }
              )

              if (intersection != false){
                let dist = ((intersection.x - this.pos[0])^2 + (intersection.y - this.pos[1])^2)^(1/2);
                if (smallest_dist_intersected === ""  || dist < smallest_dist_intersected){
                  shortest_line = line;
                  intersect = intersection;
                  smallest_dist_intersected = dist;
                }
              }

            });

            // let slope = (intersect[1] - this.pos[1])/(intersect[0] - this.pos[0]);

            let unit_divisor = ((this.vel[0])^2 + (this.vel[1])^2)^(1/2);

            let new_vect = [(0 - this.vel[0])/unit_divisor, (0 - this.vel[1])/unit_divisor];

            let new_vect_dirs = [];

            // if (new_vect[0] != 0){
            //     new_vect_dirs.push(new_vect[0]/Math.abs[new_vect[0]]);
            //   } else {
            //     new_vect_dirs.push(0);
            //   }
            //
            //   if (new_vect[1] != 0){
            //       new_vect_dirs.push(new_vect[1]/Math.abs[new_vect[1]]);
            //     } else {
            //       new_vect_dirs.push(0);
            //     }
            new_vect.forEach(num => {
              if (num != 0){
                new_vect_dirs.push(num/Math.abs(num));
              } else {
                new_vect_dirs.push(0);
              }
            });
            // let new_vect_dirs = [new_vect[0]/Math.abs[new_vect[0]], new_vect[1]/Math.abs[new_vect[1]]]

            let new_x = intersect.x + new_vect[0] + (new_vect_dirs[0] * this.width);
            let new_y = intersect.y + new_vect[1] + (new_vect_dirs[1] * this.height);

            // debugger;
            // let new_x = (shortest_line[2].x * (this.width + 1)) + intersect.x;
            // let new_y = (shortest_line[2].y * (this.height + 1)) + intersect.y;

            //stop y velocity when you hit bottom and top, same for x
            if (shortest_line[2].y === -1 || shortest_line[2].y === 1){
              this.vel[1] =  1;
            } else {
              this.vel[0] = 0;
            }

            // grounded if we hit the top
            if (shortest_line[2].y === -1) {
              this.grounded = true;
              // console.log('we\'re grounded');
            }

            // set next location

            // if (this.grounded) {
            //   next_loc = [new_x, this.pos[1]];
            // } else {
            //   next_loc = [new_x, new_y];
            // }

            next_loc = [new_x, new_y];

            // debugger;
            return next_loc;
        }
      });
      //
      // this.grounded = false;


      return next_loc
    }

    move(timeDelta) {
        // console.log('velocity', this.vel[1])
        if (this.vel[1] < 20 && this.grounded === false) {
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
        // console.log(offsetX, offsetY)

        // let next_loc = '';
        // if (this.grounded){
        //   next_loc = [this.pos[0] + offsetX, this.pos[1]];
        // } else {
        //   next_loc = [this.pos[0] + offsetX, this.pos[1] + offsetY];
        // }


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
        // console.log('prev_position', this.pos);
        this.pos = this.nextValidMove(offsetX, offsetY);
        // console.log('updated pos', this.pos);

        // if (this.nextValidMove(next_loc)){
        //   // this.pos = next_loc;
        //   this.grounded = true;
        //   console.log('grounded', this.grounded);
        //   // this.next_best(next_loc, )
        //
        // } else {
        //   this.grounded = false;
        //   console.log('grounded', this.grounded);
        //   this.pos = next_loc;
        // }
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
