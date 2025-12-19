import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { prisma } from "@/lib/prismadb";
import AvatarUploader from "@/components/backoffice/profile/AvatarUploader";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true, farmers: true },
  });

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-zinc-900 text-white rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border">
          <Image
            src={user.profile?.avatar || "/avatar.png"}
            fill
            className="object-cover"
            alt="Avatar"
          />
        </div>

        <div className="text-center sm:text-left">
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-zinc-400">{user.email}</p>
          <AvatarUploader />
        </div>
      </div>
    </div>
  );
}
