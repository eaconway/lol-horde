import * as HordeUtil from "./horde_util";
import Platform from './platform';
import Player from './player';
import Bullet from './bullet';
import Enemy from './enemy';


class Game {
    constructor() {
      this.bullets = [];
      this.players = [];
      this.platforms = [];
      this.enemies = [];
      this.defeatedEnemies = [];

      this.currentLevel = 1;
      this.DIM_X = 0;

      this.levels = {
        1: {
          platforms: [
            {pos: [0, Game.DIM_Y-50], width: 800},
            {pos: [100, 200], width: 200},
            {pos: [400, 325], width: 250},
            {pos: [700, 200], width: 100},
          ],
          enemiesPerPlat: 1,
          dims: {x: 800 , y: 500}
        },
        2: {
          platforms: [
            {pos: [0, Game.DIM_Y-50], width: 800},
            {pos: [700, 200], width: 100},
            {pos: [400, 325], width: 250}
          ],
          enemiesPerPlat: 1,
          dims: {x: 800 , y: 500}
        },
        3: {
          platforms: [
            {pos: [0, Game.DIM_Y-50], width: 2000},
            {pos: [50, 275],  width: 200},
            {pos: [150, 75],  width: 200},
            {pos: [400, 200],  width: 250},
            {pos: [700, 325],  width: 100},
            {pos: [900, 325],  width: 200},
            {pos: [900, 75],  width: 200},
            {pos: [1150, 200],  width: 100},
            {pos: [1300, 200],  width: 250},
          ],
          enemiesPerPlat: 1,
          dims: {x: 2000 , y: 500}
        },
        4: {
          platforms: [
            {pos: [0, Game.DIM_Y-50], width: 2000},
            {pos: [50, 275],  width: 200},
            {pos: [150, 75],  width: 200},
            {pos: [400, 200],  width: 250},
            {pos: [700, 325],  width: 100},
            {pos: [900, 325],  width: 200},
            {pos: [900, 75],  width: 200},
            {pos: [1150, 200],  width: 100},
            {pos: [1300, 200],  width: 250},
          ],
          enemiesPerPlat: 3,
          dims: {x: 2000 , y: 500}
        }
      };

      this.viewportDiffX = 0;

      this.createPlayer = this.createPlayer.bind(this);
      this.checkCollisions = this.checkCollisions.bind(this);
      this.countEnemies = this.countEnemies.bind(this);
      this.loadNextLevel = this.loadNextLevel.bind(this);
      this.levelLost = this.levelLost.bind(this);
      this.levelComplete = this.levelComplete.bind(this);
      this.resetMap = this.resetMap.bind(this);
      this.resetPlayer = this.resetPlayer.bind(this);
      this.setUpLevel = this.setUpLevel.bind(this);

    }

    add(object) {
        if (object instanceof Enemy) {
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

      player.pos = [10, 399];
      player.vel[1] = 1;
    }

    setUpLevel(){
      // Clear Map
      this.resetMap();
      let currentLevel = this.levels[this.currentLevel];

      //Set DIM_X
      this.DIM_X = currentLevel.dims.x;

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
      if (this.currentLevel < 4) {
        this.currentLevel += 1;
        this.setUpLevel();
      }
    }

    displayLossScreen(){
      let gameLost = document.getElementById('game-lost');
      gameLost.classList.remove('hidden');
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
      return this.enemies.length;
    }

    createPlayer() {
        const player = new Player({
            pos: [100, 300],
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
      let player = this.players[0];

      // Did bullets hit Enemies? Did Enemies hit player?
      for( let i = 0; i < this.bullets.length; i++){
        for (let j = 0; j < this.enemies.length; j++) {
          let bullet = this.bullets[i];
          let enemy = this.enemies[j];

          if(bullet && bullet.isCollidedWith(enemy)){
            //Remove Enemy at j
            this.defeatedEnemies.push(this.enemies.splice(j, 1));
            this.bullets.splice(i, 1);
            // this.enemies[j].alive = false;
          }
        }
      }

      //Check if an enemy hit the player
      for(let i = 0; i < this.enemies.length; i++){
        let enemy = this.enemies[i];
        if(enemy.isCollidedWith(player)) {
          player.alive = false;
        }
      }
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.DIM_X, Game.DIM_Y);
        ctx.fillStyle = Game.BG_COLOR;
        ctx.fillRect(0, 0, this.DIM_X, Game.DIM_Y);

        this.allObjects().forEach((object) => {
          //Only draw living objects
          if (!(object instanceof Enemy && object.alive === false)) {
            object.draw(ctx);
          }
        });
    }

    isOutOfBounds(pos) {
        return (pos[0] < 0) || (pos[1] < 0) ||
            (pos[0] > this.DIM_X) || (pos[1] > Game.DIM_Y);
    }

    moveObjects(delta) {
        this.allMovingObjects().forEach((object) => {
          object.move(delta);
        });
    }

    remove(object) {
        if (object instanceof Bullet) {
            this.bullets.splice(this.bullets.indexOf(object), 1);
        } else if (object instanceof Player) {
            this.players.splice(this.players.indexOf(object), 1);
        } else {
            throw new Error("unknown type of object");
        }
    }
}

// Game.BG_COLOR = "#0099e6";
Game.BG_COLOR = "#003300";
// Game.DIM_X = 1000;
Game.DIM_Y = 500;
Game.FPS = 32;
Game.NUM_ASTEROIDS = 10;

export default Game;
