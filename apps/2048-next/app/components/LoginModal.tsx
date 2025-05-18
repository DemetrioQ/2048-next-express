
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

import { FaGoogle, FaGithub } from "react-icons/fa";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isBrowser, setIsBrowser] = useState(false);
  const authContext = useAuth();

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) return null;

  const handleOAuthClick = async (provider: "google" | "github") => {
    try {
      await authContext.handleOAuth(
        provider, 
        onClose,
        () => toast.success(`Logged in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`)
      );
    } catch (error) {
      toast.error(`Failed to login with ${provider}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Login to Submit Score</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="mt-4 w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // add real login logic here
                toast.success("Logged in");
                onClose();
              }}
              className="space-y-4 mt-4"
            >
              <input type="email" placeholder="Email" className="w-full border p-2 rounded" />
              <input type="password" placeholder="Password" className="w-full border p-2 rounded" />
              <Button className="w-full">Login</Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">or continue with</div>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                onClick={() => handleOAuthClick("google")}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <FaGoogle className="h-5 w-5" />
                Continue with Google
              </Button>
              <Button
                onClick={() => handleOAuthClick("github")}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <FaGithub className="h-5 w-5" />
                Continue with GitHub
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="register">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Registered successfully");
                onClose();
              }}
              className="space-y-4 mt-4"
            >
              <input type="email" placeholder="Email" className="w-full border p-2 rounded" />
              <input type="password" placeholder="Password" className="w-full border p-2 rounded" />
              <Button className="w-full">Register</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
