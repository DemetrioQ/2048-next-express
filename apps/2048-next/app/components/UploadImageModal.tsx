'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { UploadDropzone } from '@/utils/uploadthing';
import { useState } from 'react';

export default function UploadImageModal({
    open,
    setOpen,
    onComplete,
}: {
    open: boolean;
    setOpen: (val: boolean) => void;
    onComplete: (ufsUrl: string) => void;
}) {
    const [uploading, setUploading] = useState(false); 1


    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed bg-white rounded-xl p-6 w-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl focus:outline-none">
                    <Dialog.Title className="text-center font-semibold mb-4">Upload Avatar</Dialog.Title>

                    <UploadDropzone
                        endpoint="avatarUploader"
                        onUploadBegin={(name) => {
                            setUploading(true);
                            console.log("Uploading: ", name);
                        }}
                        onClientUploadComplete={async (res) => {
                            setUploading(false);
                            setOpen(false);
                            if (res && res[0]?.ufsUrl) {
                                onComplete(res[0]?.ufsUrl);
                            }
                        }}
                        onUploadError={(e) => {
                            setUploading(false);
                            console.error('Upload error:', e);
                        }}
                        appearance={{
                            button: 'hidden',
                            container: 'border border-dashed border-gray-300 rounded-md p-4',
                        }}
   
                        config={{
                            mode: "auto"
                        }}
                    />

                    <Dialog.Close
                        className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                        aria-label="Close"
                    >
                        ✕
                    </Dialog.Close>

                    {uploading && (
                        <p className="mt-4 text-center text-sm text-gray-500">Uploading...</p>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
