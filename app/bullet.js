import MovingObject from './moving_object';
import Intersects from 'intersects';

class Bullet extends MovingObject {
    constructor(options) {
        options.radius = Bullet.RADIUS;
        super(options);
        this.isWrappable = false;
        this.width = 15;
        this.height = 15;
        this.origin = options.origin;

        this.image = new Image();
        this.image.src = "images/M484BulletCollection1.png";

        this.isCollidedWith = this.isCollidedWith.bind(this);
    }

    isCollidedWith(otherObject) {
      if (otherObject != this.origin){
        let boxPos = [Math.floor(this.pos[0]), Math.floor(this.pos[1])];
        let otherPos = [Math.floor(otherObject.pos[0]), Math.floor(otherObject.pos[1])];

        return Intersects.boxBox(boxPos[0], boxPos[1], this.width, this.height,
        otherPos[0], otherPos[1], otherObject.width, otherObject.height)
      }
      return false;
    }

    draw() {
      ctx.drawImage(this.image,
        251,
        325,
        20,
        20,
        this.pos[0],
        this.pos[1],
        this.width,
        this.height);
    }
}

Bullet.RADIUS = 2;
Bullet.SPEED = 15;

export default Bullet;
