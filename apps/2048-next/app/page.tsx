import GameClient from "./components/GameClient";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-[#faf8ef] p-4">
            <GameClient />
        </main>
    );
}