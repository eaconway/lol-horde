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
        super(options);

        this.image = new Image();
        this.image.src = "../images/platform_ground.png";
        this.center = [this.pos[0] + options.width/2, this.pos[1] + options.height/2];
    }

    draw(ctx){
      ctx.drawImage(this.image,
        0,0, 100, 20,
        this.pos[0] + this.game.viewportDiffX, this.pos[1], this.width, this.height);
    }

    collideWith(otherObject) {
        return false;
    }
}

export default Platform;
