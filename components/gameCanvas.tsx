import React, { useRef, useEffect } from "react";
import { Asteroid } from "./classes/asteroids";
import { Bullet } from "./classes/bullet";

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parentDiv = parentDivRef.current;
    if (!canvas || !parentDiv) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrameId: number;
    const numSections = 10;
    let sectionSize: number;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = parentDiv.clientWidth;
      canvas.height = parentDiv.clientHeight;
      sectionSize = canvas.width / numSections;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Initialize spaceship state
    const spaceship = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: 30,
      rotation: 0,
      speed: 0,
    };

    // User input state
    const userInput = {
      left: false,
      right: false,
      up: false,
    };

    // Event listeners for user input
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case " ":
        case "Spacebar":
          shoot();
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          userInput.left = true;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          userInput.right = true;
          break;
        case "ArrowUp":
        case "w":
        case "W":
          userInput.up = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          userInput.left = false;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          userInput.right = false;
          break;
        case "ArrowUp":
        case "w":
        case "W":
          userInput.up = false;
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Initialize asteroids
    const asteroids: Asteroid[] = [];
    for (let i = 0; i < 5; i++) {
      const size = 20 + Math.random() * 30;
      asteroids.push(
        new Asteroid(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          size
        )
      );
    }

    // Initialize bullets
    const bullets: Bullet[] = [];
    let lastShotTime = 0;
    const shootCooldown = 300; // Cooldown period in milliseconds

    const shoot = () => {
      const currentTime = Date.now();
      if (currentTime - lastShotTime >= shootCooldown) {
        bullets.push(new Bullet(spaceship.x, spaceship.y, spaceship.rotation));
        lastShotTime = currentTime;
      }
    };

    function isCollision(bullet: Bullet, asteroid: Asteroid): boolean {
      const dx = bullet.x - asteroid.x;
      const dy = bullet.y - asteroid.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < asteroid.size;
    }

    function getSection(x: number, y: number): { row: number; col: number } {
      const col = Math.floor(x / sectionSize);
      const row = Math.floor(y / sectionSize);
      return { row, col };
    }

    const gameLoop = () => {
      if (userInput.left) spaceship.rotation -= 0.05;
      if (userInput.right) spaceship.rotation += 0.05;
      if (userInput.up) spaceship.speed = 5;
      else spaceship.speed = 0;

      spaceship.x += spaceship.speed * Math.cos(spaceship.rotation);
      spaceship.y += spaceship.speed * Math.sin(spaceship.rotation);

      // Canvas wrap around logic for spaceship
      if (spaceship.x > canvas.width) spaceship.x = 0;
      else if (spaceship.x < 0) spaceship.x = canvas.width;
      if (spaceship.y > canvas.height) spaceship.y = 0;
      else if (spaceship.y < 0) spaceship.y = canvas.height;

      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the spaceship
      context.save();
      context.translate(spaceship.x, spaceship.y);
      context.rotate(spaceship.rotation);
      context.beginPath();
      context.moveTo(-10, -10);
      context.lineTo(10, 0);
      context.lineTo(-10, 10);
      context.closePath();
      context.fillStyle = "white";
      context.fill();
      context.restore();

      // Draw asteroids
      asteroids.forEach((asteroid) => asteroid.draw(context));

      // Draw bullets
      bullets.forEach((bullet) => bullet.draw(context));

      // Update asteroids and bullets
      asteroids.forEach((asteroid) => asteroid.update());
      bullets.forEach((bullet) => bullet.update());

      // Collision detection
      bullets.forEach((bullet, bulletIndex) => {
        asteroids.forEach((asteroid, asteroidIndex) => {
          if (isCollision(bullet, asteroid)) {
            // Remove bullet and asteroid on collision
            bullets.splice(bulletIndex, 1);
            asteroids.splice(asteroidIndex, 1);
          }
        });
      });

      // Request the next frame
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <div
      ref={parentDivRef}
      className="w-full max-w-6xl max-h-[75vh] min-h-[50vh] bg-gray-700 mb-6"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GameCanvas;
