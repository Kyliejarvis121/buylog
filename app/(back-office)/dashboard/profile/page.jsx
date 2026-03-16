export const dynamic = "force-dynamic";
export const revalidate = 0;

import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { prisma } from "@/lib/prismadb";
import AvatarUploader from "@/components/backoffice/profile/AvatarUploader";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div className="p-6">Unauthorized</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      farmer: true,
    },
  });

  if (!user) {
    return <div className="p-6">User not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
        My Profile
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-6">

        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700">
          <Image
            src={user.profile?.avatar || "/avatar.png"}
            alt="User Avatar"
            fill
            className="object-cover"
          />
        </div>

        {/* User Info */}
        <div className="text-center sm:text-left space-y-1">
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">
            {user.name || "No Name"}
          </p>

          <p className="text-sm text-zinc-500">
            {user.email}
          </p>

          {/* Upload new avatar */}
          <div className="pt-2">
            <AvatarUploader />
          </div>
        </div>

      </div>
    </div>
  );
}