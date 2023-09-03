import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    include: {
      members: {
        where: {
          profileId: profile.id
        }
      }
    }
  });

  if (server) {
    // const isMember = server.members.find((member: any) => member.profileId === profile.id);

    // if (isMember) {
      return redirect(`/servers/${server.id}`);
    // }
  }

  return <InitialModal />;
}
 
export default SetupPage;