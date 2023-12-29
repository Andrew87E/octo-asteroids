import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold mb-6">Asteroids!</h1>
        <p className="text-lg mb-8">
          Get ready to navigate through space and avoid asteroids.
        </p>
        <Link
          href="/game"
          className="inline-block px-6 py-3 bg-blue-500 text-white font-bold hover:bg-blue-700 transition duration-300 rounded-xl"
        >
          Start Game
        </Link>
      </div>
    </div>
  );
}
