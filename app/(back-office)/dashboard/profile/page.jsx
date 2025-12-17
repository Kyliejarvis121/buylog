import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { prisma } from "@/lib/prismadb";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  return (
    <div className="max-w-3xl bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-6">
        <Image
          src={user.profile?.avatar || "/avatar.png"}
          width={96}
          height={96}
          className="rounded-full border"
          alt="Profile picture"
        />

        <div>
          <p className="text-lg font-medium">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-500 capitalize">{user.role}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileField label="Phone" value={user.profile?.phone} />
        <ProfileField label="Address" value={user.profile?.address} />
        <ProfileField label="Country" value={user.profile?.country} />
        <ProfileField label="Bio" value={user.profile?.bio} />
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value || "Not set"}</p>
    </div>
  );
}
