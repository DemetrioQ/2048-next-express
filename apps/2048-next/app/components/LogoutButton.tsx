
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut } from "lucide-react";



interface LogoutButtonProps {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await onLogout();
    setShowConfirm(false);
    setLoading(false);
    router.push('/');
  };


  return (
    <>
      <Button variant="outline" onClick={() => setShowConfirm(true)}>
        <LogOut className="w-4 h-4" />
        Logout
      </Button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Are you sure you want to logout?</DialogTitle>
            <DialogDescription className="text-center">
              You will need to sign in again to submit scores.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout} disabled={loading}>
              <LogOut className="w-4 h-4" />
              {loading ? "Logging out..." : "Confirm Logout"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
