
"use client";

import { useAccount } from 'wagmi';
import { redirect } from "next/navigation";
import CollaborativeRoom from "@/components/CollaborativeRoom";

type UserType = 'editor' | 'viewer';

interface DocumentClientProps {
  id: string;
  room: any; // roomの型は適切に定義してください
  usersData: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    color: string;
    userType: UserType;
  }>;
}

const DocumentClient: React.FC<DocumentClientProps> = ({ id, room, usersData }) => {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) {
    redirect('/sign-in');
  }

  const currentUserType = room.usersAccesses[address]?.includes('room:write') ? 'editor' : 'viewer';

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom 
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default DocumentClient;