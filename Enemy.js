import MovingDirection from "./MovingDirection.js";

export default class Enemy {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.#loadImages();

    this.movingDirection = Math.floor(
      Math.random() * Object.keys(MovingDirection).length
    );

    this.directionTimerDefault = this.#random(1, 3);
    this.directionTimer = this.directionTimerDefault;

    this.scaredAboutToExpireTimerDefault = 10;
    this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;

    this.blueExpireTimerDef = 10;
    this.blueExpireTimer = this.blueExpireTimerDef;
  }

  collideWith(pacman) {
    //source : https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    const size = this.tileSize / 2; // half way collision
    if (
      this.x < pacman.x + size &&
      this.x + size > pacman.x &&
      this.y < pacman.y + size &&
      this.y + size > pacman.y
    ) {
      return true;
    }
    return false;
  }

  draw(ctx, pause, pacman) {
    if (!pause) {
      this.move();
      this.changeDirection();
    }
    this.setImage(ctx, pacman);
  }
  setImage(ctx, pacman) {
    if (pacman.powerDotActive) {
      //   this.image = this.scaredGhost;
      this.setImageWhenBlueIsActive(pacman);
    } else {
      this.image = this.normalGhost;
    }
    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }
  setImageWhenBlueIsActive(pacman) {
    if (pacman.powerDotNearExp) {
      this.blueExpireTimer--;
      if (this.blueExpireTimer == 0) {
        this.blueExpireTimer = this.blueExpireTimerDef;
        if (this.image == this.scaredGhost) {
          this.image = this.scaredGhost2;
        } else {
          this.image = this.scaredGhost;
        }
      }
    } else {
      this.image = this.scaredGhost;
    }
  }

  changeDirection() {
    this.directionTimer--;
    let newMoveDirection = null;
    if (this.directionTimer == 0) {
      this.directionTimer = this.directionTimerDefault;
      newMoveDirection = Math.floor(
        Math.random() * Object.keys(MovingDirection).length
      );
    }

    if (newMoveDirection != null && this.movingDirection != newMoveDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            newMoveDirection
          )
        ) {
          this.movingDirection = newMoveDirection;
        }
      }
    }
  }

  move() {
    if (
      !this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.movingDirection
      )
    ) {
      switch (this.movingDirection) {
        case MovingDirection.up:
          this.y -= this.velocity;
          break;
        case MovingDirection.down:
          this.y += this.velocity;
          break;
        case MovingDirection.left:
          this.x -= this.velocity;
          break;
        case MovingDirection.right:
          this.x += this.velocity;
          break;
      }
    }
  }

  #random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  #loadImages() {
    this.normalGhost = new Image();
    this.normalGhost.src = "Assets/ghost.png";

    this.scaredGhost = new Image();
    this.scaredGhost.src = "Assets/scaredGhost.png";

    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = "Assets/scaredGhost2.png";

    this.image = this.normalGhost;
  }
}
