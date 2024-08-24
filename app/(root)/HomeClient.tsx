'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import AddDocumentBtn from '@/components/AddDocumentBtn';
import { DeleteModal } from '@/components/DeleteModal';
import Header from '@/components/Header';
import Notifications from '@/components/Notifications';
import { Button } from '@/components/ui/button';
import { dateConverter } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { DocumentsResponse } from '@/lib/actions/room.actions';

interface HomeClientProps {
  initialDocuments: DocumentsResponse;
}

interface HomeClientProps {
  initialDocuments: DocumentsResponse;
}

const HomeClient: React.FC<HomeClientProps> = ({ initialDocuments }) => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [documents, setDocuments] = useState(initialDocuments);
  console.log("HomeClient")

  useEffect(() => {
    if (!isConnected || !address) {
      router.push('/sign-in');
    }
  }, [isConnected, address, router]);

  if (!isConnected || !address) {
    return null; // または適切なローディング表示
  }

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          {/* ユーザーボタンの代わりにウォレット接続状態を表示 */}
          <Button>{address.slice(0, 6)}...{address.slice(-4)}</Button>
        </div>
      </Header>

      {documents.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All documents</h3>
            <AddDocumentBtn 
              userId={address}
              email={address}
            />
          </div>
          <ul className="document-ul">
            {documents.data.map(({ id, metadata, createdAt }: any) => (
              <li key={id} className="document-list-item">
                <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-4">
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image 
                      src="/assets/icons/doc.svg"
                      alt="file"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-lg">{metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">Created about {dateConverter(createdAt)}</p>
                  </div>
                </Link>
                <DeleteModal roomId={id} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="document-list-empty">
          <Image 
            src="/assets/icons/doc.svg"
            alt="Document"
            width={40}
            height={40}
            className="mx-auto"
          />

          <AddDocumentBtn 
            userId={address}
            email={address}
          />
        </div>
      )}
    </main>
  );
};

export default HomeClient;