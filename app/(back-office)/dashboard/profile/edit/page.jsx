import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prismadb";
import EditProfileForm from "@/components/backoffice/profile/EditProfileForm";

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="p-6">
      <EditProfileForm profile={profile} />
    </div>
  );
}
