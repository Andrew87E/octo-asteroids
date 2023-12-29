import React, { useRef, useEffect } from "react";

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parentDiv = parentDivRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    if (!parentDiv) return;

    let animationFrameId: number;
    // Set canvas size based on window size
    const setCanvasSize = () => {
      canvas.width = parentDiv.clientWidth;
      canvas.height = parentDiv.clientHeight;
    };

    setCanvasSize();
    // Resize listener
    const handleResize = () => {
      setCanvasSize();
      // Redraw or reinitialize game elements as needed
    };

    window.addEventListener("resize", handleResize);

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
        // Add more cases if needed
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
        // Add more cases if needed
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Game loop
    const gameLoop = () => {
      // Update game state
      if (userInput.left) spaceship.rotation -= 0.05;
      if (userInput.right) spaceship.rotation += 0.05;
      if (userInput.up) spaceship.speed = 5;
      else spaceship.speed = 0;

      spaceship.x += spaceship.speed * Math.cos(spaceship.rotation);
      spaceship.y += spaceship.speed * Math.sin(spaceship.rotation);

      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Wrap around logic
      if (spaceship.x > canvas.width) spaceship.x = 0;
      else if (spaceship.x < 0) spaceship.x = canvas.width;

      if (spaceship.y > canvas.height) spaceship.y = 0;
      else if (spaceship.y < 0) spaceship.y = canvas.height;

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

      // Request the next frame
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    // Start the game loop
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
      id="game-canvas"
      ref={parentDivRef}
      className="w-full max-w-6xl max-h-[75%] min-h-96 bg-gray-700 mb-6"
    >
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};

export default GameCanvas;
