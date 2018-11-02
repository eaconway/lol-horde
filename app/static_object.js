import HordeUtil from './horde_util';

class StaticObject {
    constructor(options) {
        this.pos = options.pos;
        this.width = options.width;
        this.height = options.height;
        this.color = options.color;
        this.game = options.game;
        this.isWrappable = true;
    }

    collideWith(otherObject) {
        // default do nothing
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // ctx.arc(
        //     this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
        // );

        let x = this.pos[0];
        let y = this.pos[1];

        ctx.moveTo(x , y);
        ctx.lineTo(x + this.width, y);
        ctx.lineTo(x + this.width, y + this.height);
        ctx.lineTo(x, y + this.height);
        ctx.lineTo(x, y);
        ctx.fill();
    }

    // isCollidedWith(otherObject) {
    //     // if (otherObject instanceof Player || otherObject instanceof Player  )
    //     const centerDist = HordeUtil.dist(this.pos, otherObject.pos);
    //     return centerDist < (this.radius + otherObject.radius);
    // }

    // move(timeDelta) {
    //     // timeDelta is number of milliseconds since last move
    //     // if the computer is busy the time delta will be larger
    //     // in this case the MovingObject should move farther in this frame
    //     // velocity of object is how far it should move in 1/60th of a second
    //     // const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
    //     //     offsetX = this.vel[0] * velocityScale,
    //     //     offsetY = this.vel[1] * velocityScale;
    //
    //     this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
    //
    //     if (this.game.isOutOfBounds(this.pos)) {
    //         if (this.isWrappable) {
    //             this.pos = this.game.wrap(this.pos);
    //         } else {
    //             this.remove();
    //         }
    //     }
    // }

    remove() {
        this.game.remove(this);
    }
}

const NORMAL_FRAME_TIME_DELTA = 1000 / 60;

export default StaticObject;
