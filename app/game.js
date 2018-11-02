import * as HordeUtil from "./horde_util";
import Asteroid from './asteroid';
import Platform from './platform';
import Player from './player';
import Bullet from './bullet';

class Game {
    constructor() {
        this.asteroids = [];
        this.bullets = [];
        this.players = [];
        this.platforms = [];

        // this.addAsteroids();
        this.addPlatforms();
        this.createPlayer = this.createPlayer.bind(this);
        this.checkCollisions = this.checkCollisions.bind(this);
    }

    add(object) {
        if (object instanceof Asteroid) {
            this.asteroids.push(object);
        } else if (object instanceof Bullet) {
            this.bullets.push(object);
        } else if (object instanceof Player) {
            this.players.push(object);
        } else if (object instanceof Platform) {
            this.platforms.push(object);
        } else {
            throw new Error("unknown type of object");
        }
    }

    addAsteroids() {
        for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
            this.add(new Asteroid({ game: this }));
        }
    }

    addPlatforms(){
      this.add(new Platform({pos: [0, Game.DIM_Y-50], width: Game.DIM_X, game: this}));
      this.add(new Platform({pos: [700, 400], width: Game.DIM_X/3, game: this}))
      this.add(new Platform({pos: [400, 200], width: Game.DIM_X/4, game: this}))
    }

    createPlayer() {
        console.log('creating player');
        console.log("Dim_y is ", Game.DIM_Y);
        console.log("what is this?", this);
        console.log('initial player position', [Game.DIM_X/2, Game.DIM_Y/2],)
        const player = new Player({
            pos: [Game.DIM_X/2, 350],
            game: this
        });

        this.add(player);

        console.log('player created and added');
        return player;

    }

    step(delta) {
      this.moveObjects(delta);
      this.movePlayer(delta);
      // this.checkCollisions();
    }

    movePlayer(delta){
      // console.log('moving player');
      // debugger;
      this.players[0].move(delta);
    }

    allObjects() {
        return [].concat(this.players, this.asteroids, this.bullets, this.platforms);
    }

    allCollidableObjects() {
        return [].concat(this.players, this.asteroids, this.bullets, this.platforms);
    }

    checkCollisions() {
        const allObjects = this.allObjects();

        if (allObjects.length > 1){
          for (let i = 0; i < allObjects.length; i++) {
              for (let j = 0; j < allObjects.length; j++) {
                  let obj1 = allObjects[i];
                  let obj2 = allObjects[j];
                  // debugger;

                  if (obj1 != obj2 && obj1.isCollidedWith(obj2)) {
                      const collision = obj1.collideWith(obj2);
                      if (collision) return;
                  }
              }
          }
        }
    }

    draw(ctx) {
        ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
        ctx.fillStyle = Game.BG_COLOR;
        // ctx.fillStyle = 'grey';
        // debugger;
        ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
        this.allObjects().forEach((object) => {
            object.draw(ctx);
        });
    }

    isOutOfBounds(pos) {
        return (pos[0] < 0) || (pos[1] < 0) ||
            (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
    }

    moveObjects(delta) {
        this.allObjects().forEach((object) => {
          // console.log()
          // if (object instanceof Player){
          //   object.move(delta, this.platforms);
          // }
          if (!(object instanceof Platform || object instanceof Player)) {
            // console.log(object)
            object.move(delta);
          }
        });
    }


    randomPosition() {
        return [
            Game.DIM_X * Math.random(),
            Game.DIM_Y * Math.random()
        ];
    }

    remove(object) {
        if (object instanceof Bullet) {
            this.bullets.splice(this.bullets.indexOf(object), 1);
        } else if (object instanceof Asteroid) {
            this.asteroids.splice(this.asteroids.indexOf(object), 1);
        } else if (object instanceof Player) {
            this.players.splice(this.players.indexOf(object), 1);
        } else {
            throw new Error("unknown type of object");
        }
    }

    wrap(pos) {
        return [
            HordeUtil.wrap(pos[0], Game.DIM_X), HordeUtil.wrap(pos[1], Game.DIM_Y)
        ];
    }
}

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;
Game.NUM_ASTEROIDS = 10;

export default Game;
