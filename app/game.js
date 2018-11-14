import * as HordeUtil from "./horde_util";
import Asteroid from './asteroid';
import Platform from './platform';
import Player from './player';
import Bullet from './bullet';
import Enemy from './enemy';


class Game {
    constructor() {
      this.asteroids = [];
      this.bullets = [];
      this.players = [];
      this.platforms = [];
      this.enemies = [];

      this.currentLevel = 1;

      this.levels = {
        1: {
          platforms: [
            {pos: [0, Game.DIM_Y-50], width: Game.DIM_X},
            {pos: [700, 425],  width: 100},
            {pos: [400, 300],  width: Game.DIM_X/4}
          ],
          enemies: []
        },
        2: {
          platforms: [
            {pos: [0, Game.DIM_Y-50], width: Game.DIM_X},
            {pos: [700, 300], width: 100},
            {pos: [400, 425], width: Game.DIM_X/4}
          ],
          enemies: []
        }
      };

      // this.addAsteroids();
      // this.addPlatforms();
      // this.setUpLevel();

      this.createPlayer = this.createPlayer.bind(this);
      this.checkCollisions = this.checkCollisions.bind(this);
      this.countEnemies = this.countEnemies.bind(this);
      this.loadNextLevel = this.loadNextLevel.bind(this);
      this.levelLost = this.levelLost.bind(this);
      this.levelComplete = this.levelComplete.bind(this);
      this.resetMap = this.resetMap.bind(this);
      this.resetPlayer = this.resetPlayer.bind(this);

    }

    add(object) {
        if (object instanceof Asteroid) {
            this.asteroids.push(object);
        } else if (object instanceof Enemy) {
            this.enemies.push(object);
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

    resetMap(){
      this.platforms = [];
      this.enemies = [];
      this.bullets = [];
    }

    resetPlayer(){
      let player = this.players[0];

      player.pos = [10, 499];
      player.vel[1] = 1;
    }

    setUpLevel(){
      // Clear Map
      this.resetMap();

      let currentLevel = this.levels[this.currentLevel];

      // Add Platforms
      currentLevel.platforms.forEach(platform => {
          this.add(new Platform({pos: [platform.pos[0], platform.pos[1]], width: platform.width, game: this}));
          console.log('added Platform');
      });

      // Add an Enemy on each platform
      this.platforms.forEach(platform => {
        if (platform.pos != [0, Game.DIM_Y-50]){
          console.log('added Enemy');
          this.add(new Enemy({platform: platform, game: this}));
        }
      });

      // Add player
      this.resetPlayer();
    }

    levelComplete(){
      if (this.countEnemies() === 0) {return true;}
      return false;
    }

    levelLost(){
      if (!this.players[0].alive) { return true;}
      return false;
    }

    loadNextLevel(){
      // setTimeout();
      if (this.currentLevel < 3) {
        this.currentLevel += 1;
        this.setUpLevel();
      }
    }

    displayLevelComplete(){
      let levelComplete = document.getElementById('level-complete');
      levelComplete.classList.remove('hidden');
    }

    displayGameComplete(){
      let gameComplete = document.getElementById('game-complete');
      gameComplete.classList.remove('hidden');
    }

    countEnemies(){
      let count = 0;
      this.enemies.forEach( enemy => {
        if (enemy.alive) {count += 1};
      })
      return count;
    }

    createPlayer() {
        const player = new Player({
            pos: [100, 400],
            game: this
        });
        this.add(player);
        return player;
    }

    step(delta) {
      this.moveObjects(delta);
      this.movePlayer(delta);

      this.checkCollisions();
    }

    movePlayer(delta){
      this.players[0].move(delta);
    }

    allObjects() {
        return [].concat(this.platforms, this.players, this.enemies, this.bullets);
    }

    allMovingObjects() {
        return [].concat(this.bullets, this.enemies);
    }

    checkCollisions(){
      for( let i = 0; i < this.bullets.length; i++){
        for (let j = 0; j < this.enemies.length; j++) {
          let bullet = this.bullets[i];
          let enemy = this.enemies[j];

          if(bullet.isCollidedWith(enemy)){
            //Remove Enemy at j
            // this.enemies.splice(j, 1);
            this.enemies[j].alive = false;
          }
        }
      }
    }

    // checkCollisions() {
    //     const allObjects = this.allObjects();
    //
    //     if (allObjects.length > 1){
    //       for (let i = 0; i < allObjects.length; i++) {
    //           for (let j = 0; j < allObjects.length; j++) {
    //               let obj1 = allObjects[i];
    //               let obj2 = allObjects[j];
    //               // debugger;
    //
    //               if (obj1 != obj2 && obj1.isCollidedWith(obj2)) {
    //                   const collision = obj1.collideWith(obj2);
    //                   if (collision) return;
    //               }
    //           }
    //       }
    //     }
    // }

    draw(ctx) {
        ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
        ctx.fillStyle = Game.BG_COLOR;
        // ctx.fillStyle = 'grey';
        // debugger;
        ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
        // debugger;

        this.allObjects().forEach((object) => {
          //Only draw living objects
          if (!(object instanceof Enemy && object.alive === false) &&
            !(object instanceof Player && object.alive === false)) {
            object.draw(ctx);
          }
        });
    }

    isOutOfBounds(pos) {
        return (pos[0] < 0) || (pos[1] < 0) ||
            (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
    }

    moveObjects(delta) {
        this.allMovingObjects().forEach((object) => {
          object.move(delta);
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

// Game.BG_COLOR = "#0099e6";
Game.BG_COLOR = "#003300";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;
Game.NUM_ASTEROIDS = 10;

export default Game;
