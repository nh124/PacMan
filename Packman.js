import MovingDirection from "./MovingDirection.js";
export default class packman {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;

    this.packmanDefaultAniTimer = 10;
    this.packmanAniTimer = null;

    this.sound1 = new Audio("./sounds/waka.wav");

    this.PowerSound = new Audio("./sounds/power_dot.wav");
    this.eatGhostSound = new Audio("./sounds/eat_ghost.wav");

    this.powerDotActive = false;
    this.powerDotNearExp = false; // ghost flashes
    this.timers = [];

    this.madeFirstMove = false;

    document.addEventListener("keydown", this.keydown);

    this.loadPacmanImages();
  }
  draw(ctx, pause, enemies) {
    if (!pause) {
      this.move();
      this.animation();
    }
    this.eatFood();
    this.eatPowerDot();
    this.eatGhost(enemies);

    const size = this.tileSize / 2;
    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.packmanRotation * 90 * Math.PI) / 180);
    ctx.drawImage(
      this.packmanImages[this.whichPackman],
      -size,
      -size,
      this.tileSize,
      this.tileSize
    );
    ctx.restore();
    // ctx.drawImage(
    //   this.packmanImages[this.whichPackman],
    //   this.x,
    //   this.y,
    //   this.tileSize,
    //   this.tileSize
    // );
  }
  loadPacmanImages() {
    const packman1 = new Image();
    packman1.src = "./Assets/pac0.png";

    const packman2 = new Image();
    packman2.src = "./Assets/pac1.png";

    const packman3 = new Image();
    packman3.src = "./Assets/pac2.png";

    const packman4 = new Image();
    packman4.src = "./Assets/pac1.png";

    this.packmanRotation = this.rotation.right;
    this.packmanImages = [packman1, packman2, packman3, packman4];

    this.whichPackman = 0;
  }
  rotation = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,
  };

  keydown = (event) => {
    //up
    if (event.keyCode == 38) {
      if (this.currentMovingDirection == MovingDirection.down)
        this.currentMovingDirection = MovingDirection.up;
      this.requestedMovingDirection = MovingDirection.up;
      this.madeFirstMove = true;
    }
    //down
    if (event.keyCode == 40) {
      if (this.currentMovingDirection == MovingDirection.up)
        this.currentMovingDirection = MovingDirection.down;
      this.requestedMovingDirection = MovingDirection.down;
      this.madeFirstMove = true;
    }
    //left
    if (event.keyCode == 37) {
      if (this.currentMovingDirection == MovingDirection.right)
        this.currentMovingDirection = MovingDirection.left;
      this.requestedMovingDirection = MovingDirection.left;
      this.madeFirstMove = true;
    }
    //right
    if (event.keyCode == 39) {
      if (this.currentMovingDirection == MovingDirection.left)
        this.currentMovingDirection = MovingDirection.right;
      this.requestedMovingDirection = MovingDirection.right;
      this.madeFirstMove = true;
    }
  };

  move() {
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            this.requestedMovingDirection
          )
        )
          this.currentMovingDirection = this.requestedMovingDirection;
      }
    }
    if (
      this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.currentMovingDirection
      )
    ) {
      return;
    } else if (
      this.currentMovingDirection != null &&
      this.packmanAniTimer == null
    ) {
      this.packmanAniTimer = this.packmanDefaultAniTimer;
    }

    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        // console.log(MovingDirection.up);
        this.y -= this.velocity;
        this.packmanRotation = this.rotation.up;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        this.packmanRotation = this.rotation.down;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        this.packmanRotation = this.rotation.left;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        this.packmanRotation = this.rotation.right;
        break;
    }
  }

  animation() {
    if (this.packmanAniTimer == null) {
      return;
    }
    this.packmanAniTimer--;
    if (this.packmanAniTimer == 0) {
      this.packmanAniTimer = this.packmanDefaultAniTimer;
      this.whichPackman++;
      if (this.whichPackman == this.packmanImages.length) {
        this.whichPackman = 0;
      }
    }
  }

  eatFood() {
    if (this.tileMap.eatFood(this.x, this.y)) {
      this.sound1.play();
    }
  }
  eatPowerDot() {
    if (this.tileMap.eatPowerDot(this.x, this.y)) {
      // turn ghost blue
      this.PowerSound.play();
      this.powerDotActive = true;
      this.powerDotNearExp = false;
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers = [];
      let powerDotTimer = setTimeout(() => {
        this.powerDotActive = false;
        this.powerDotNearExp = false;
      }, 1000 * 6);
      this.timers.push(powerDotTimer);

      let powerDotNearExpTimer = setTimeout(() => {
        this.powerDotNearExp = true;
      }, 1000 * 3);

      this.timers.push(powerDotNearExpTimer);
    }
  }

  eatGhost(enemies) {
    if (this.powerDotActive) {
      const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
      collideEnemies.forEach((enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1);
        this.eatGhostSound.play();
      });
    }
  }
}
