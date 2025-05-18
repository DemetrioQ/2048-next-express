import GameClient from "./components/GameClient";
import Navbar from "./components/NavBar";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
            <GameClient />
        </main>
    );
}
