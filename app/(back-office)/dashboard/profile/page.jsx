import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { prisma } from "@/lib/prismadb";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  // Fetch user from Prisma
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      farmers: true, // include farmer info if any
      orders: true,  // optional
    },
  });

  return (
    <div className="max-w-3xl bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-6">
        <Image
          src="/avatar.png" // default avatar (no profile relation yet)
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

      {/* Farmer Details (if user is a farmer) */}
      {user.farmers.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Farmer Info</h3>
          {user.farmers.map((farmer) => (
            <div key={farmer.id} className="space-y-1">
              <p className="font-medium">Farm Name: {farmer.name}</p>
              <p>Status: {farmer.isActive ? "Active" : "Inactive"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Optional profile fields (add these manually if needed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileField label="Phone" value={user.phone || "Not set"} />
        <ProfileField label="Address" value={user.address || "Not set"} />
        <ProfileField label="Country" value={user.country || "Not set"} />
        <ProfileField label="Bio" value={user.bio || "Not set"} />
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
