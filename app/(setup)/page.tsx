import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();

  const server = await db.server.findMany({
    include: {
      members: true
    }
  });

  if (server) {
    let isServerMember = null;
    for (const serverItems of server) {
      if (serverItems.members.length > 0) {
        if (serverItems.members.find((member) => member.profileId === profile.id)) {
          isServerMember = serverItems;

          break;
        }
      }
    }

    if (isServerMember) {
      return redirect(`/servers/${isServerMember?.id}`);
    }
  }

  return <InitialModal />;
}
 
export default SetupPage;