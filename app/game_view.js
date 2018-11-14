class GameView {
    constructor(game, ctx) {
        this.ctx = ctx;
        this.game = game;
        this.player = this.game.createPlayer();

        this.bindKeyHandlers = this.bindKeyHandlers.bind(this);
        this.start = this.start.bind(this);
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
            player.isMoving = true;
            // while (this.move) {
            player.playerMove(move);
            // }
          }
        });

        document.addEventListener('keyup', (e) => {
          if (e.keyCode >= 37 && e.keyCode <= 40 ){
            player.isMoving = false;
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
        })

        document.getElementById('play').addEventListener('click', () =>{
          this.pause = false;
        })

    }

    updateUI(){
      document.querySelector('#level').innerHTML = this.game.currentLevel;

      document.querySelector('#enemies').innerHTML = this.game.countEnemies();
    }

    start() {
        this.bindKeyHandlers();
        this.lastTime = 0;
        // start the animation
        requestAnimationFrame(this.animate.bind(this));
    }

    animate(time) {
        const timeDelta = time - this.lastTime;

        if (this.pause === false){
          this.game.step(timeDelta);
          this.game.draw(this.ctx);
          this.updateUI();
        }
        this.lastTime = time;
        // console.log('animating');
        // every call to animate requests causes another call to animate
        requestAnimationFrame(this.animate.bind(this));
    }
}

GameView.MOVES = {
    38: [0, -1],
    37: [-1, 0],
    40: [0, 1],
    39: [1, 0],
};

export default GameView;
