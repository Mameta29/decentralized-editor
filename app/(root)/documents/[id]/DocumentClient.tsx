"use client";
import { memo } from 'react';
import CollaborativeRoom from "@/components/CollaborativeRoom";

type UserType = 'editor' | 'viewer';

interface DocumentClientProps {
  id: string;
  room: any;
  usersData: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    color: string;
    userType: UserType;
  }>;
  currentUserType: UserType;
}

const DocumentClient: React.FC<DocumentClientProps> = memo(({ id, room, usersData, currentUserType }) => {
  console.log("DocumentClient:id", id);

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
});

DocumentClient.displayName = 'DocumentClient';

export default DocumentClient;