import { useState } from "react";
import Link from "next/link";
import GameCanvas from "../components/gameCanvas";

const GamePage = () => {
  const [showControls, setShowControls] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const toggleControls = () => setShowControls(!showControls);
  const toggleHowToPlay = () => setShowHowToPlay(!showHowToPlay);
  const toggleScoring = () => setShowScoring(!showScoring);
  const toggleTips = () => setShowTips(!showTips);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Asteroids</h1>
      </div>

      <GameCanvas />

      <div className="mb-6">
        <h2
          className="text-xl font-bold mb-2 cursor-pointer"
          onClick={toggleControls}
        >
          Game Controls
        </h2>
        {showControls && (
          <div>
            <p>Use the following keyboard controls to play the game:</p>
            <ul className="list-disc list-inside mb-4">
              <li>
                <strong>Arrow Up/W:</strong> Move forward
              </li>
              <li>
                <strong>Arrow Left/A:</strong> Rotate left
              </li>
              <li>
                <strong>Arrow Right/D:</strong> Rotate right
              </li>
              <li>
                <strong>Spacebar:</strong> Shoot
              </li>
            </ul>
          </div>
        )}

        <h2
          className="text-xl font-bold mb-2 cursor-pointer"
          onClick={toggleHowToPlay}
        >
          How to Play
        </h2>
        {showHowToPlay && (
          <div>
            <p>
              Navigate your spaceship through space and avoid colliding with
              asteroids. Use your weapons to shoot and destroy asteroids. Each
              level gets progressively harder.
            </p>
            <p>
              Keep an eye on your health, represented by hearts at the top of
              the screen. If you run out of health, it's game over!
            </p>
          </div>
        )}

        <h2
          className="text-xl font-bold mb-2 cursor-pointer"
          onClick={toggleScoring}
        >
          Scoring
        </h2>
        {showScoring && (
          <div>
            <p>
              Earn points by destroying asteroids. The faster you clear the
              asteroids, the higher your score!
            </p>
          </div>
        )}

        <h2
          className="text-xl font-bold mb-2 cursor-pointer"
          onClick={toggleTips}
        >
          Tips
        </h2>
        {showTips && (
          <div>
            <ul className="list-disc list-inside mb-4">
              <li>Move strategically and don't get cornered by asteroids.</li>
              <li>
                Use short bursts of movement to dodge asteroids effectively.
              </li>
              <li>
                Regularly check for asteroids appearing from the edges of the
                screen.
              </li>
            </ul>
          </div>
        )}
      </div>

      <Link
        href="/"
        className="px-4 py-2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-700 transition duration-300"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default GamePage;
