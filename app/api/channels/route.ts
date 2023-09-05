import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(
  req: Request
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const isAuthorizedMember = await db.member.findFirst({
      where: {
        serverId: serverId,
        profileId: profile.id,
        role: {
          in: [MemberRole.ADMIN, MemberRole.MODERATOR]
        }
      }
    });

    if (isAuthorizedMember) {
      const newChannel = await db.channel.create({
        data: {
          profileId: profile.id,
          serverId: serverId,
          name,
          type
        }
      });
    
      return NextResponse.json(newChannel);
    } else {
      return new NextResponse("Unauthorized", { status: 401 });
    }

  } catch (error) {
    console.log("CHANNELS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
