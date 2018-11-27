import 'styles/index.scss';
import Game from './game';
import GameView from './game_view';
import Intersection from 'intersection';

document.addEventListener("DOMContentLoaded", () => {
    let canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    window.ctx = ctx;
    const game = new Game();

    document.getElementById('start').addEventListener('click', ()=>{
      document.getElementById('start-screen').classList.add('hidden');
      document.getElementById('canvas').classList.remove('hidden');
      document.getElementById('game-meta-info').classList.remove('hidden');
      new GameView(game, ctx).newGame();
    });
});
