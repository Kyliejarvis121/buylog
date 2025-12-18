import { createUploadthing } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";

const f = createUploadthing();

/**
 * =====================================
 * UploadThing File Router
 * =====================================
 */
export const ourFileRouter = {
  /* ===============================
     CATEGORY IMAGE
  =============================== */
  categoryImageUploader: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    async ({ file }) => {
      return { url: file.url };
    }
  ),

  /* ===============================
     BANNER IMAGE
  =============================== */
  bannerImageUploader: f({ image: { maxFileSize: "2MB" } }).onUploadComplete(
    async ({ file }) => {
      return { url: file.url };
    }
  ),

  /* ===============================
     MARKET LOGO
  =============================== */
  marketLogoUploader: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    async ({ file }) => {
      return { url: file.url };
    }
  ),

  /* ===============================
     PRODUCT IMAGE
  =============================== */
  productImageUploader: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    async ({ file }) => {
      return { url: file.url };
    }
  ),

  /* ===============================
     TRAINING IMAGE
  =============================== */
  trainingImageUploader: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    async ({ file }) => {
      return { url: file.url };
    }
  ),

  /* ===============================
     MULTIPLE PRODUCT IMAGES
  =============================== */
  multipleProductsUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),

  /* ===============================
     CUSTOMER PROFILE AVATAR
  =============================== */
  customerProfileUploader: f({ image: { maxFileSize: "1MB" } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.profile.upsert({
        where: { userId: metadata.userId },
        update: { avatar: file.url },
        create: {
          userId: metadata.userId,
          avatar: file.url,
        },
      });

      return { avatarUrl: file.url };
    }),

  /* ===============================
     FARMER PROFILE AVATAR
  =============================== */
  farmerProfileUploader: f({ image: { maxFileSize: "1MB" } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.profile.upsert({
        where: { userId: metadata.userId },
        update: { avatar: file.url },
        create: {
          userId: metadata.userId,
          avatar: file.url,
        },
      });

      return { avatarUrl: file.url };
    }),
};
