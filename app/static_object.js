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

    remove() {
        this.game.remove(this);
    }
}

const NORMAL_FRAME_TIME_DELTA = 1000 / 60;

export default StaticObject;
