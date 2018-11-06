/**
 * Application entry point
 */

// Load application styles
import 'styles/index.scss';

// ================================
// START YOUR APP HERE
// ================================


import Game from './game';
import GameView from './game_view';
import Intersection from 'intersection';
// import lineIntersect from 'line-intersect';

document.addEventListener("DOMContentLoaded", () => {
    let canvas = document.getElementById("canvas");
    // canvasEl.width = Game.DIM_X;
    // canvasEl.height = Game.DIM_Y;
    // canvas.width =

    const ctx = canvas.getContext("2d");
    window.ctx = ctx;
    const game = new Game();
    new GameView(game, ctx).start();

    window.intersection = Intersection;
    // window.lineIntersect = LineIntersect;
});


// let canvas = document.getElementById("canvas");

// let c = canvas.getContext('2d');

// //draw wider canvas
// c.fillStyle = "grey";
// c.fillRect(0, 0, 500, 500);












// let data = [16, 68, 20, 30, 54];

// let canvas = document.getElementById("canvas");

// let c = canvas.getContext('2d');

// //draw wider canvas
// c.fillStyle = "white";
// c.fillRect(0, 0, 500, 500);

// //Fill the example bars
// c.fillStyle = "blue";
// for (let i = 0; i < data.length; i++) {
//     let dp = data[i];
//     c.fillRect(40 + i * 100, 460 - dp * 5, 50, dp * 5);
// }

// //create axis
// c.fillStyle = "black";
// c.lineWidth = 2.0;
// c.beginPath();
// c.moveTo(30, 10);
// c.lineTo(30, 460);
// c.lineTo(490, 460);
// c.stroke();

// //create tick marks
// c.fillStyle = "black";
// for (let i = 0; i < 6; i++) {
//     c.fillText((5 - i) * 20 + "", 4, i * 80 + 60);
//     c.beginPath();
//     c.moveTo(25, i * 80 + 60);
//     c.lineTo(30, i * 80 + 60);
//     c.stroke();
// }

// let labels = ["JAN", "FEB", "MAR", "APR", "MAY"];
// //draw horiz text
// for (let i = 0; i < 5; i++) {
//     c.fillText(labels[i], 50 + i * 100, 475);
// }

// //a list of colors
// var colors = ["orange", "green", "blue", "yellow", "teal"];

// //calculate total of all data
// let data = [100, 68, 20, 30, 100];
// var total = 0;
// for (var i = 0; i < data.length; i++) {
//     total += data[i];
// }

// //draw pie data
// var prevAngle = 0;
// for (var i = 0; i < data.length; i++) {
//     //fraction that this pieslice represents
//     var fraction = data[i] / total;
//     //calc starting angle
//     var angle = prevAngle + fraction * Math.PI * 2;

//     //draw the pie slice
//     c.fillStyle = colors[i];

//     //create a path
//     c.beginPath();
//     c.moveTo(250, 250);
//     c.arc(250, 250, 100, prevAngle, angle, false);
//     c.lineTo(250, 250);

//     //fill it
//     c.fill();

//     //stroke it
//     c.strokeStyle = "black";
//     c.stroke();

//     //update for next time through the loop
//     prevAngle = angle;

// }

// //draw centered text
// c.fillStyle = "black";
// c.font = "24pt sans-serif";
// var text = "Sales Data from 2025";
// var metrics = c.measureText(text);
// c.fillText(text, 250 - metrics.width / 2, 400);

// //draw the pie slice
// //c.fillStyle = colors[i];

// //fill with a radial gradient
// var grad = c.createRadialGradient(250, 250, 10, 250, 250, 100);
// grad.addColorStop(0, "white");
// grad.addColorStop(1, colors[i]);
// c.fillStyle = grad;

// var pat1 = ctx.createPattern(img, 'repeat');
// ctx.fillStyle = pat1;
// ctx.fillRect(0, 0, 100, 100);

// var pat2 = ctx.createPattern(img, 'repeat-y');
// ctx.fillStyle = pat2;
// ctx.translate(200, 0);
// ctx.fillRect(0, 0, 100, 100);

// // shim layer with setTimeout fallback
// window.requestAnimFrame = (function () {
//     return window.requestAnimationFrame ||
//         window.webkitRequestAnimationFrame ||
//         window.mozRequestAnimationFrame ||
//         window.oRequestAnimationFrame ||
//         window.msRequestAnimationFrame ||
//         function (callback) {
//             window.setTimeout(callback, 1000 / 60);
//         };
// })();

// var x = 0;
// function drawIt() {
//     window.requestAnimFrame(drawIt);
//     var canvas = document.getElementById('canvas');
//     var c = canvas.getContext('2d');
//     c.clearRect(0, 0, canvas.width, canvas.height);
//     c.fillStyle = "red";
//     c.fillRect(x, 100, 200, 100);
//     x += 5;
// }

// window.requestAnimFrame(drawIt);


// var canvas = document.getElementById('canvas');
// var particles = [];
// var tick = 0;
// function loop() {
//     window.requestAnimFrame(loop);
//     createParticles();
//     updateParticles();
//     killParticles();
//     drawParticles();
// }

// function createParticles() {
//     //check on every 10th tick check
//     if (tick % 10 == 0) {
//         //add particle if fewer than 100
//         if (particles.length < 100) {
//             particles.push({
//                 x: Math.random() * canvas.width, //between 0 and canvas width
//                 y: 0,
//                 speed: 2 + Math.random() * 3, //between 2 and 5
//                 radius: 5 + Math.random() * 5, //between 5 and 10
//                 color: "white",
//             });
//         }
//     }
// }

// function updateParticles() {
//     for (var i in particles) {
//         var part = particles[i];
//         part.y += part.speed;
//     }
// }

// function killParticles() {
//     for (var i in particles) {
//         var part = particles[i];
//         if (part.y > canvas.height) {
//             part.y = 0;
//         }
//     }
// }

// function drawParticles() {
//     var c = canvas.getContext('2d');
//     c.fillStyle = "black";
//     c.fillRect(0, 0, canvas.width, canvas.height);
//     for (var i in particles) {
//         var part = particles[i];
//         c.beginPath();
//         c.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
//         c.closePath();
//         c.fillStyle = part.color;
//         c.fill();
//     }
// }

// window.requestAnimFrame(loop);

// let coinImage = new Image();
// coinImage.src = "../images/coin-sprite.png";

// console.log(coinImage);

// function sprite(options) {

//     let that = {};

//     that.context = options.context;
//     that.width = options.width;
//     that.height = options.height;
//     that.image = options.image;

//     that.render = () => {
//         console.log('rendering image');
//         // Draw the animation
//         that.context.drawImage(
//             that.image,
//             0,
//             0,
//             that.width,
//             that.height,a
//             0,
//             0,
//             that.width,
//             that.height);
//     };

//     that.update = () => {
//         tickCount += 1;
//         if (tickCount > ticksPerFrame) {
//             tickCount = 0;
//             // Go to the next frame
//             frameIndex += 1;
//         }
//     };

//     return that;
// }

// // var canvas = document.getElementById("coinAnimation");
// let canvas = document.getElementById("canvas");
// canvas.width = 100;
// canvas.height = 100;


// // sprite.prototype.render = () => {

// //     console.log('that is', that);
// //     // Draw the animation
// //     that.context.drawImage(
// //         that.image,
// //         0,
// //         0,
// //         that.width,
// //         that.height,
// //         0,
// //         0,
// //         that.width,
// //         that.height
// //     );
// // };

// var coin = sprite({
//     context: canvas.getContext("2d"),
//     width: 100,
//     height: 100,
//     image: coinImage
// });

// console.log(coin);
// console.log(sprite.prototype);

// coin.render();

// let c = canvas.getContext("2d");

// //create axis
// c.fillStyle = "black";
// c.lineWidth = 2.0;
// c.beginPath();
// c.moveTo(0, 0);
// c.lineTo(100, 0);
// c.lineTo(100, 100);
// c.lineTo(0, 100);
// c.lineTo(0, 0);
// c.stroke();
