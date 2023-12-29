export class Bullet {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  lifeSpan: number;

  constructor(x: number, y: number, angle: number) {
    this.x = x;
    this.y = y;
    this.velocityX = Math.cos(angle) * 5; // Speed of the bullet
    this.velocityY = Math.sin(angle) * 5;
    this.lifeSpan = 120; // Life span of bullet in frames
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.lifeSpan--;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, 2, 0, Math.PI * 2, false); // Small circle for bullet
    context.strokeStyle = "white";
    context.lineWidth = 2; // Width of the bullet
    context.stroke();
    context.closePath();
  }

  isExpired() {
    return this.lifeSpan <= 0;
  }


}
