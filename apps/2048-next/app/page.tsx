import GameClient from "@/components/Game/GameClient";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center h-[calc(100dvh-4rem)] overflow-hidden px-3 py-2 sm:p-4">
            <GameClient />
        </main>
    );
}
