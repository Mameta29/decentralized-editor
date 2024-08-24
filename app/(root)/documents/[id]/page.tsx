// DocumentPage.tsx (サーバーコンポーネント)
import { getDocument } from "@/lib/actions/room.actions";
import { redirect } from "next/navigation";
import DocumentClient from "./DocumentClient";

type UserType = 'editor' | 'viewer';

const DocumentPage = async ({ params: { id } }: SearchParamProps) => {
  const room = await getDocument({
    roomId: id,
    userId: "", // ここでは空文字列を渡し、クライアントコンポーネントで処理します
  });
  console.log("Document")

  if(!room) redirect('/');

  const userIds = Object.keys(room.usersAccesses);
  const usersData = userIds.map((userId) => ({
    id: userId,
    name: "Unknown User",
    email: userId,
    avatar: "/default-avatar.png",
    color: "#000000",
    userType: room.usersAccesses[userId]?.includes('room:write') ? 'editor' as UserType : 'viewer' as UserType,
  }));

  return (
    <DocumentClient
      id={id}
      room={room}
      usersData={usersData}
    />
  );
};

export default DocumentPage;
