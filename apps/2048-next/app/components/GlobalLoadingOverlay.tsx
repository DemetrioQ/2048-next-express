// components/GlobalLoadingOverlay.tsx
import LoadingSpinner from '@/components/LoadingSpinner';

export default function GlobalLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <LoadingSpinner />
    </div>
  );
}
