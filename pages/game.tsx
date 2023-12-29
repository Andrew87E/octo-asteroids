import Link from "next/link";
import GameCanvas from "../components/gameCanvas";

const GamePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Asteroids Game</h1>
      </div>
      
        <GameCanvas />
      
      <div className="mb-6">
        <p>Game controls and information will go here</p>
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
