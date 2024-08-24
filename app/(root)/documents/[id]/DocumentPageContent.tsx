import { getDocument } from "@/lib/actions/room.actions";
import { redirect } from "next/navigation";
import DocumentClient from "./DocumentClient";

type UserType = 'editor' | 'viewer';

const DocumentPageContent = async ({ id, userId }: { id: string; userId: string }) => {
  console.log("DocumentPage: Fetching room", id);
  const room = await getDocument({
    roomId: id,
    userId: userId,
  });
  console.log("DocumentPage: Room fetched", !!room);

  if(!room) {
    console.log("DocumentPage: Room not found, redirecting to home");
    redirect('/');
  }

  const userIds = Object.keys(room.usersAccesses);
  const usersData = userIds.map((userId) => ({
    id: userId,
    name: "Unknown User",
    email: userId,
    avatar: "/default-avatar.png",
    color: "#000000",
    userType: room.usersAccesses[userId]?.includes('room:write') ? 'editor' as UserType : 'viewer' as UserType,
  }));

  const currentUserType: UserType = room.usersAccesses[userId]?.includes('room:write') ? 'editor' : 'viewer';

  return (
    <DocumentClient
      id={id}
      room={room}
      usersData={usersData}
      currentUserType={currentUserType}
    />
  );
};

export default DocumentPageContent;