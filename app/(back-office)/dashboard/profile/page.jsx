import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { prisma } from "@/lib/prismadb";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      farmers: true,
    },
  });

  const farmer = user.farmers?.[0];

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-zinc-900 text-zinc-100 rounded-2xl shadow-xl p-8">
      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-8 border-b border-zinc-700 pb-4">
        My Profile
      </h2>

      {/* PROFILE HEADER */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-zinc-700">
          <Image
            src={user.profile?.avatar || "/avatar.png"}
            fill
            className="object-cover"
            alt="Profile picture"
          />
        </div>

        <div className="text-center md:text-left">
          <p className="text-xl font-semibold">{user.name}</p>
          <p className="text-sm text-zinc-400">{user.email}</p>
          <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-emerald-600 text-white">
            {user.role}
          </span>
        </div>
      </div>

      {/* FARMER INFO */}
      {farmer && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4 text-emerald-400">
            Farmer Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-800 rounded-xl p-5">
            <Info label="Farm Name" value={farmer.name} />
            <Info
              label="Status"
              value={farmer.isActive ? "Active" : "Inactive"}
            />
          </div>
        </div>
      )}

      {/* PROFILE DETAILS */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-blue-400">
          Personal Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-zinc-800 rounded-xl p-5">
          <Info label="Phone" value={user.profile?.phone} />
          <Info label="Address" value={user.profile?.address} />
          <Info label="Country" value={user.profile?.country} />
          <Info label="Bio" value={user.profile?.bio} />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-400 mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-zinc-100">
        {value || "Not set"}
      </p>
    </div>
  );
}
