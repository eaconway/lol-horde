import * as HordeUtil from "./horde_util";
import MovingObject from './moving_object';
import Player from './player';
import Bullet from './bullet';

const DEFAULTS = {
    COLOR: "#505050",
    RADIUS: 25,
    SPEED: 4
};

class Asteroid extends MovingObject {
    constructor(options = {}) {
        options.color = DEFAULTS.COLOR;
        options.pos = options.pos || options.game.randomPosition();
        options.radius = DEFAULTS.RADIUS;
        options.vel = options.vel || HordeUtil.randomVec(DEFAULTS.SPEED);
        super(options);
    }

    collideWith(otherObject) {
        if (otherObject instanceof Player) {
            otherObject.relocate();
            return true;
        } else if (otherObject instanceof Bullet) {
            this.remove();
            otherObject.remove();
            return true;
        }

        return false;
    }
}

export default Asteroid;
