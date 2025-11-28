// app/api/files/route.ts
import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export GET and POST handlers for App Router
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
  // Optional: add global onUploadComplete handler if needed
  onUploadComplete: async ({ metadata, file }) => {
    // Example: save file info to database
    // await prisma.file.create({ data: { url: file.url, name: metadata.name } });
    console.log("Upload complete:", file.url, metadata);
  },
});
