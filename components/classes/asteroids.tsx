export class Asteroid {
  x: number;
  y: number;
  size: number;
  velocityX: number;
  velocityY: number;
  points: { x: number; y: number }[];
  numPoints: number;

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    const angle = Math.random() * Math.PI * 2;
    this.velocityX = Math.cos(angle);
    this.velocityY = Math.sin(angle);

    // Define the irregular shape of the asteroid
    this.numPoints = Math.round(5 + Math.random() * 5); // Random number of vertices
    this.points = [];
    for (let i = 0; i < this.numPoints; i++) {
      // Randomize the vertices around a circle to create an irregular shape
      const variance = Math.random() * 0.4 + 0.8; // Random variance
      const a =
        (i / this.numPoints) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const x = Math.cos(a) * size * variance;
      const y = Math.sin(a) * size * variance;
      this.points.push({ x, y });
    }
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.moveTo(this.x + this.points[0].x, this.y + this.points[0].y);
    for (let i = 1; i < this.numPoints; i++) {
      context.lineTo(this.x + this.points[i].x, this.y + this.points[i].y);
    }
    context.closePath();
    context.strokeStyle = "white";
    context.lineWidth = 2;
    context.stroke();
  }
}
