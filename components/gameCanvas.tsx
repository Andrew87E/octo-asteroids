import React, { useRef, useEffect, useState } from "react";
import { Asteroid } from "./classes/asteroids";
import { Bullet } from "./classes/bullet";
import Link from "next/link";

type SpaceShip = {
  x: number;
  y: number;
  size: number;
  rotation: number;
  speed: number;
};

// Game canvas component
const GameCanvas = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [health, setHealth] = useState(3); // Player starts with 3 health
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const asteroidsPerLevel = [5, 7, 10, 15, 20, 25, 30, 35, 40, 45];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentDivRef = useRef<HTMLDivElement>(null);

  const resetGame = () => {
    setHealth(3);
    setCurrentLevel(1);
    // setAsteroids(initializeAsteroids());
    setIsGameOver(false); // Reset the game over flag
  };

  // distance between points
  const distanceBetween = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Initialize asteroids for the current level
  const initializeAsteroids = (spaceship: SpaceShip) => {
    const canvas = canvasRef.current;
    if (!canvas) return [];

    const numAsteroids = asteroidsPerLevel[currentLevel - 1] || 5;
    const minDistance = 100; // Minimum distance from the spaceship
    let newAsteroids = [];

    for (let i = 0; i < numAsteroids; i++) {
      let x, y, dist;
      do {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
        dist = distanceBetween(x, y, spaceship.x, spaceship.y);
      } while (dist < minDistance);

      newAsteroids.push(new Asteroid(x, y, 20 + Math.random() * 30));
    }

    return newAsteroids;
  };

  // Disable scrolling when the user presses the arrow keys
  const disableScrollKeys = (event: KeyboardEvent) => {
    const keysToPreventDefault = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Space",
      " ",
    ];
    if (keysToPreventDefault.includes(event.key)) {
      event.preventDefault();
    }
  };

  // Game logic
  useEffect(() => {
    const canvas = canvasRef.current; // Get the canvas element
    const context = canvas?.getContext("2d"); // Get the context
    if (!canvas || !context) return; // Stop if canvas or context is null

    // Disable scrolling when the user presses the arrow keys
    canvas.addEventListener("keydown", disableScrollKeys);
    canvas.focus(); // Focus the canvas to receive key events

    // Load images
    const fullHeartImage = new Image();
    fullHeartImage.src = "/heart.png";
    const brokenHeartImage = new Image();
    brokenHeartImage.src = "/broken.png";

    // Animation frame ID
    let animationFrameId: number;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = parentDivRef.current?.clientWidth ?? window.innerWidth;
      canvas.height = parentDivRef.current?.clientHeight ?? window.innerHeight;
    };

    // Set canvas size on load and on resize
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize); // Set canvas size on resize

    // Initialize spaceship
    const spaceship: SpaceShip = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: 30,
      rotation: 0,
      speed: 0,
    };

    // Initialize asteroids
    setAsteroids(initializeAsteroids(spaceship));

    // User input
    const userInput = {
      left: false,
      right: false,
      up: false,
    };

    // Handle key down
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

    // Handle key up
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

    // Event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Bullets
    const bullets: Bullet[] = [];
    let lastShotTime = 0;
    const shootCooldown = 300;

    // Shoot bullet
    const shoot = () => {
      const currentTime = Date.now();
      if (currentTime - lastShotTime >= shootCooldown) {
        bullets.push(new Bullet(spaceship.x, spaceship.y, spaceship.rotation));
        lastShotTime = currentTime;
      }
    };

    // Check if bullet collides with asteroid
    const isCollision = (bullet: Bullet, asteroid: Asteroid): boolean => {
      const dx = bullet.x - asteroid.x;
      const dy = bullet.y - asteroid.y;
      return Math.sqrt(dx * dx + dy * dy) < asteroid.size;
    };

    // Check if spaceship collides with asteroid
    const checkSpaceshipCollision = (
      spaceship: SpaceShip,
      asteroids: Asteroid[]
    ) => {
      for (const asteroid of asteroids) {
        const dx = spaceship.x - asteroid.x;
        const dy = spaceship.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < spaceship.size / 2 + asteroid.size) {
          return true;
        }
      }
      return false;
    };

    // Render level text
    const renderLevelText = (
      context: CanvasRenderingContext2D,
      level: number,
      canvasWidth: number
    ) => {
      const margin = 20; // Margin from the right edge of the canvas
      context.font = "30px Arial";
      context.fillStyle = "white";
      const text = `Level ${level}`;
      const textWidth = context.measureText(text).width;
      context.fillText(text, canvasWidth - textWidth - margin, 50);
    };

    // Render hearts
    const renderHearts = (
      context: CanvasRenderingContext2D,
      health: number
    ) => {
      const totalHearts = 3;
      const heartSize = 30;
      const padding = 10;

      for (let i = 0; i < totalHearts; i++) {
        // Choose the image based on whether the heart is full or broken
        const heartImage = i < health ? fullHeartImage : brokenHeartImage;

        // Draw the heart image
        context.drawImage(
          heartImage,
          10 + i * (heartSize + padding),
          10,
          heartSize,
          heartSize
        );
      }
    };

    // ~~ Game Loop ~~
    const gameLoop = () => {
      // Check if the game is over before updating the game state
      if (isGameOver) {
        cancelAnimationFrame(animationFrameId); // Stop the game loop
        return;
      }

      // Update spaceship
      if (userInput.left) spaceship.rotation -= 0.05;
      if (userInput.right) spaceship.rotation += 0.05;
      if (userInput.up) spaceship.speed = 3; // Accelerate the spaceship forward
      else spaceship.speed = 0;
      spaceship.x += spaceship.speed * Math.cos(spaceship.rotation);
      spaceship.y += spaceship.speed * Math.sin(spaceship.rotation);
      spaceship.x = (spaceship.x + canvas.width) % canvas.width;
      spaceship.y = (spaceship.y + canvas.height) % canvas.height;
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw spaceship
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
      asteroids.forEach((asteroid) => {
        asteroid.update();
        asteroid.draw(context);
      });

      // Handle asteroids going off screen
      asteroids.forEach((asteroid) => {
        asteroid.x = (asteroid.x + canvas.width) % canvas.width;
        asteroid.y = (asteroid.y + canvas.height) % canvas.height;
      });

      // Draw bullets
      bullets.forEach((bullet, index) => {
        bullet.update();
        bullet.draw(context);
        if (bullet.isExpired()) {
          bullets.splice(index, 1);
        } else {
          asteroids.forEach((asteroid, asteroidIndex) => {
            if (isCollision(bullet, asteroid)) {
              bullets.splice(index, 1);
              asteroids.splice(asteroidIndex, 1);
            }
          });
        }
      });

      // Render level text and hearts
      renderLevelText(context, currentLevel, canvas.width);
      renderHearts(context, health);

      // Check for collisions
      if (checkSpaceshipCollision(spaceship, asteroids)) {
        if (health === 0) {
          if (!isGameOver) {
            setIsGameOver(true); // Set the game over flag
          }
        } else {
          setHealth((health) => Math.max(0, health - 1));
        }
      }

      // Check if the level is completed
      if (asteroids.length === 0 && !levelCompleted) {
        setLevelCompleted(true);
      }

      // Request next frame
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    animationFrameId = requestAnimationFrame(gameLoop);

    // Clean up
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", setCanvasSize);
      canvas.removeEventListener("keydown", disableScrollKeys);
      cancelAnimationFrame(animationFrameId); // Stop the game loop
    };
  }, [currentLevel, health, isGameOver]);

  // handle level completion
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const spaceship: SpaceShip = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: 30,
      rotation: 0,
      speed: 0,
    };

    // Initialize asteroids
    if (levelCompleted) {
      setCurrentLevel((currentLevel) => currentLevel + 1);
      setAsteroids(initializeAsteroids(spaceship));
      setLevelCompleted(false);
    }
  }, [levelCompleted, currentLevel]);

  // handle game over
  return isGameOver ? (
    <div className="h-96 flex flex-col items-center justify-center bg-slate-800 w-[75vw] mb-16">
      <p className="text-4xl font-bold text-white mb-4">Game Over</p>
      <p className="text-xl text-white mb-4">Level Reached: {currentLevel}</p>
      <Link
        href="/game"
        onClick={resetGame}
        className="inline-block px-6 py-3 bg-blue-500 text-white font-bold hover:bg-blue-700 transition duration-300 rounded-xl"
      >
        Restart Game
      </Link>
    </div>
  ) : (
    <div
      ref={parentDivRef}
      className="w-full max-w-6xl max-h-[75vh] min-h-[50vh] bg-gray-700 mb-6"
    >
      <canvas ref={canvasRef} tabIndex={0} />
    </div>
  );
};

export default GameCanvas;
