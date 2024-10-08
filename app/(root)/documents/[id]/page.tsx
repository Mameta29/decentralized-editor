import { getDocument } from "@/lib/actions/room.actions";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import DocumentClient from "./DocumentClient";

type UserType = 'editor' | 'viewer';

const DocumentPage = async ({ params: { id } }: { params: { id: string } }) => {
  const cookieStore = cookies();
  const userId = cookieStore.get('wallet_address')?.value;

  if (!userId) {
    redirect('/sign-in');
  }

  const room = await getDocument({ roomId: id, userId });

  if (!room) {
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

export default DocumentPage;