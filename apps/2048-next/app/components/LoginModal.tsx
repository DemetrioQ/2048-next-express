"use client"

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getMe, loginWithOAuth } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const authContext = useAuth();
  if (!isBrowser) return null;



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
            <form className="space-y-4 mt-4">
              <input type="email" placeholder="Email" className="w-full border p-2 rounded" />
              <input type="password" placeholder="Password" className="w-full border p-2 rounded" />
              <Button className="w-full">Login</Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">or continue with</div>
            <div className="mt-2 flex justify-center gap-2">
              <Button onClick={() => authContext.handleOAuth("google", onClose)} variant="outline">
                Google
              </Button>
              <Button onClick={() => authContext.handleOAuth("github", onClose)} variant="outline">
                GitHub
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="register">
            <form className="space-y-4 mt-4">
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