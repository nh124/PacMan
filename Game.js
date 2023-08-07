import TileMap from "./TileMap.js";

const tileSize = 32;
const velocity = 2;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

const gameMusic = new Audio("sounds/Music.mp3");
gameMusic.play();
gameMusic.volume = 0.2;

let gameOver = false;
let gameWin = false;
const gameOverSound = new Audio("sounds/gameOver.wav");
const gameWinSound = new Audio("sounds/gameWin.wav");

function gameLoop() {
  // drawGameEnd();
  tileMap.draw(ctx);
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
    if (gameWin) {
      gameWinSound.play();
      document.getElementById("gameState").style.visibility = "visible";
      document.getElementById("gameState").innerHTML = "YOU WIN!!!";
      gameMusic.pause();
    }
  }
}
function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
      document.getElementById("gameState").style.visibility = "visible";
      document.getElementById("gameState").innerHTML = "GAME OVER!!";
      gameMusic.pause();
    }
  }
}
function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75);
