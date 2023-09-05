import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const isMember = await db.member.findFirst({
      where: {
        serverId: params.serverId,
        profileId: profile.id,
      }
    });
    
    if (isMember) {
      await db.member.deleteMany({
        where: {
          profileId: profile.id,
          serverId: params.serverId,
        }
      });
    
      return NextResponse.json({ message: 'Membership deleted successfully.' });
    } else {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
  } catch (error) {
    console.log("[SERVER_ID_LEAVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
