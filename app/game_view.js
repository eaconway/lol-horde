class GameView {
    constructor(game, ctx) {
        this.ctx = ctx;
        this.game = game;
        this.player = this.game.createPlayer();
        this.game.setUpLevel();

        this.bindKeyHandlers = this.bindKeyHandlers.bind(this);

        this.newGame = this.newGame.bind(this);
        this.start = this.start.bind(this);
        // this.restart = this.restart.bind(this);
        this.animate = this.animate.bind(this);
        this.pause = false;
        // this.drawBoard();
    }

    bindKeyHandlers() {
        const player = this.player;

        document.addEventListener('keydown', (e) => {
          if (e.keyCode >= 37 && e.keyCode <= 40 ){
            let move = GameView.MOVES[e.keyCode];
            console.log('move', move);
            player.isMovingX = true;
            // while (this.move) {
            player.playerMove(move);
            // }
          }
        });

        document.addEventListener('keyup', (e) => {
          if (e.keyCode === 37 || e.keyCode === 39 ){
            player.isMovingX = false;
            // player.playerMove();
          }
        });

        document.addEventListener('keydown',(e) => {
           if(e.keyCode === 32){
             console.log('fire bullet');
             player.fireBullet();
           }
         });

        document.getElementById('pause').addEventListener('click', () =>{
          this.pause = true;
        });

        document.getElementById('play').addEventListener('click', () =>{
          this.pause = false;
        });

        document.getElementById('next-level').addEventListener('click', () => {
          this.game.loadNextLevel();
          let levelComplete = document.getElementById('level-complete');
          levelComplete.classList.add('hidden');
          this.start();
        });

        document.getElementById('play-again').addEventListener('click', () => {
          this.game.currentLevel = 0;
          this.game.loadNextLevel();
          let gameComplete = document.getElementById('game-complete');
          gameComplete.classList.add('hidden');
          this.start();
        });

        document.getElementById('restart-l').addEventListener('click', () => {
          this.game.setUpLevel();
        });

        document.getElementById('restart-g').addEventListener('click', () => {
          this.game.currentLevel = 1;
          this.game.setUpLevel();
        });
    }

    updateUI(){
      document.querySelector('#level').innerHTML = this.game.currentLevel;

      document.querySelector('#enemies').innerHTML = this.game.countEnemies();
    }

    newGame() {
      this.bindKeyHandlers();
      this.game.currentLevel = 1;
      this.start();
    }

    start(){
      this.lastTime = 0;
      // start the animation
      requestAnimationFrame(this.animate.bind(this));
    }

    animate(time) {
      //check if its the end of the game
      if (this.game.levelLost()) {
        console.log("sorry, you lost");
        // this.game.displayLossScreen();
      } else if (this.game.levelComplete()) {
        // this.levelComplete = true;
        console.log("Congrats, onto the next level");
        if (this.game.currentLevel === 2){
          this.game.displayGameComplete();
        } else {
          this.game.displayLevelComplete();
        }
        // this.game.loadNextLevel();
        // setTimeout(this.loadNextLevel(), 1000);
      } else {
        const timeDelta = time - this.lastTime;

        if (this.pause === false){
          this.game.step(timeDelta);
          this.game.draw(this.ctx);
          this.updateUI();
        }
        this.lastTime = time;
        requestAnimationFrame(this.animate.bind(this));
      }
    }

}

GameView.MOVES = {
    38: [0, -1],
    37: [-1, 0],
    40: [0, 1],
    39: [1, 0],
};

export default GameView;
