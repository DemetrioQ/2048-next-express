'use client';

import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';
import { useCallback, useState } from 'react';
import getCroppedImg from '../../../utils/cropImage';
import { uploadFiles } from '@/utils/uploadthing';
import * as Dialog from '@radix-ui/react-dialog';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/context/AuthContext';

export default function CropUploadModal({
    open,
    setOpen,
    onComplete,
}: {
    open: boolean;
    setOpen: (val: boolean) => void;
    onComplete: (url: string, fileKey: string) => void;
}) {
    const { user } = useAuth();
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [uploading, setUploading] = useState(false);

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles[0]) handleFile(acceptedFiles[0]);
        },
        accept: { 'image/*': [] },
        multiple: false,
    });

    const getFileName = (): string => {
        const fileName = `avatar-${user?.id}.jpg`
        return fileName;
    }

const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setUploading(true);

    try {
        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        const fileName = getFileName();
        const file = new File([croppedBlob], fileName, { type: 'image/jpeg' });

        const res = await uploadFiles('avatarUploader', { files: [file] });
        const { ufsUrl, key } = res[0]!;

        // Send to backend to update avatar and delete old one
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/update-avatar`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageUrl: ufsUrl,
                imageKey: key,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update avatar');
        }

        const data = await response.json();

        onComplete(data.avatar.imageUrl, data.avatar.imageKey);
        setOpen(false);
    } catch (err) {
        console.error('Error uploading or updating avatar:', err);
        alert('Failed to upload avatar. Please try again.');
    } finally {
        setUploading(false);
    }
};


    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed bg-white rounded-xl p-6 w-[90vw] max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl focus:outline-none">
                    <Dialog.Title className="text-center font-semibold mb-4">Upload & Crop Avatar</Dialog.Title>

                    {!imageSrc ? (
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-md p-6 flex items-center justify-center text-gray-500 cursor-pointer aspect-square w-full
                ${isDragActive ? 'bg-blue-100 border-blue-400' : 'bg-gray-100 border-gray-300'}`}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? 'Drop the image here...' : 'Drag & drop or click to select an image'}
                        </div>
                    ) : (
                        <div className="relative w-full aspect-square bg-gray-100">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                    )}

                    {imageSrc && (
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Confirm & Upload'}
                        </button>
                    )}

                    <Dialog.Close className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 cursor-pointer">
                        ✕
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
