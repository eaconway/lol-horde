class GameView {
    constructor(game, ctx) {
        this.ctx = ctx;
        this.game = game;
        this.player = this.game.createPlayer();

        this.bindKeyHandlers = this.bindKeyHandlers.bind(this);
        this.start = this.start.bind(this);
        this.animate = this.animate.bind(this);

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

    }


    start() {
        this.bindKeyHandlers();
        this.lastTime = 0;
        // start the animation
        requestAnimationFrame(this.animate.bind(this));
    }

    animate(time) {
        const timeDelta = time - this.lastTime;

        this.game.step(timeDelta);
        this.game.draw(this.ctx);
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
