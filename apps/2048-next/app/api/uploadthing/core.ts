// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: "2MB" } })
    .onUploadComplete(({ file, metadata }) => {
      // Save to DB if needed
      console.log("Upload complete:", file.ufsUrl);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
