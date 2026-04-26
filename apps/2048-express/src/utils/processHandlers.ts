// Catch process-level errors that escape Express's request lifecycle.
// We log with context, then exit so the process manager (Docker, systemd, etc.)
// can restart from a clean slate — continuing with an unknown-state process is
// worse than a fast restart.
export function registerProcessHandlers(): void {
    process.on('uncaughtException', (err) => {
        console.error('[uncaughtException]', err);
        // Give logs a tick to flush before exit.
        setTimeout(() => process.exit(1), 100);
    });

    process.on('unhandledRejection', (reason) => {
        console.error('[unhandledRejection]', reason);
        setTimeout(() => process.exit(1), 100);
    });

    process.on('SIGTERM', () => {
        console.log('[SIGTERM] shutting down gracefully');
        process.exit(0);
    });

    process.on('SIGINT', () => {
        console.log('[SIGINT] shutting down gracefully');
        process.exit(0);
    });
}
