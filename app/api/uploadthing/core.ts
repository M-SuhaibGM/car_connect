import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {


  carImage: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file }) => {
    }),
  receiptImage: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file }) => {
    }),
  driverImage: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file }) => {
    }),
};

export type OurFileRouter = typeof ourFileRouter;
