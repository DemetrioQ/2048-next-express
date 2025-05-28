import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export function DropzoneArea({ onFileAccepted }: { onFileAccepted: (file: File) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileAccepted(file);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center text-gray-500 cursor-pointer transition
        ${isDragActive ? 'bg-blue-100 border-blue-400' : 'bg-gray-100 border-gray-300'}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-full" />
      ) : (
        <p>{isDragActive ? 'Drop the image here...' : 'Drag & drop or click to select an image'}</p>
      )}
    </div>
  );
}
