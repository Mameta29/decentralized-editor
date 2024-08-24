"use client";

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DocumentsResponse } from '@/lib/actions/room.actions';
import { listBuckets, listBucketObjects } from '@/lib/greenfield';
import AddDocumentBtn from '@/components/AddDocumentBtn';
import { DeleteModal } from '@/components/DeleteModal';
import Header from '@/components/Header';
import Notifications from '@/components/Notifications';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dateConverter } from '@/lib/utils';

interface HomeClientProps {
  initialDocuments: DocumentsResponse;
}

interface BucketObject {
  ObjectInfo: {
    ObjectName: string;
    PayloadSize: string;
    CreateAt: string;
    ContentType: string;
  };
}

const HomeClient: React.FC<HomeClientProps> = ({ initialDocuments }) => {
  const { address, isConnected, connector } = useAccount();
  const router = useRouter();
  const [documents, setDocuments] = useState(initialDocuments);
  const [buckets, setBuckets] = useState<string[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string>('');
  const [bucketObjects, setBucketObjects] = useState<BucketObject[]>([]);

  useEffect(() => {
    if (!isConnected || !address) {
      console.log("Home: Redirecting to sign-in", { isConnected, address });
      router.push('/sign-in');
    } else {
      fetchBuckets();
    }
  }, [isConnected, address, router]);

  const fetchBuckets = async () => {
    if (address && connector) {
      try {
        const bucketList = await listBuckets(address, connector);
        setBuckets(bucketList);
      } catch (error) {
        console.error('Error fetching buckets:', error);
      }
    }
  };

  const fetchBucketObjects = async (bucketName: string) => {
    if (address && connector) {
      try {
        const objects = await listBucketObjects(bucketName, connector, address);
        setBucketObjects(objects as any);
      } catch (error) {
        console.error('Error fetching bucket objects:', error);
      }
    }
  };

  const handleBucketChange = (value: string) => {
    setSelectedBucket(value);
    fetchBucketObjects(value);
  };

  const handleObjectClick = (objectName: string) => {
    // オブジェクト名からroomIdを抽出する（例：objectName が "roomId_title.txt" の形式だと仮定）
    const roomId = objectName.split('_')[0];
    router.push(`/documents/${roomId}`);
  };

  if (!isConnected || !address) {
    return null;
  }

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <Button>{address.slice(0, 6)}...{address.slice(-4)}</Button>
        </div>
      </Header>

      <div className="document-list-container">
        <div className="document-list-title">
          <h3 className="text-28-semibold">All documents</h3>
          <div className="flex items-center gap-4">
            <Select onValueChange={handleBucketChange} value={selectedBucket}>
              <SelectTrigger className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <SelectValue placeholder="Select a bucket" />
              </SelectTrigger>
              <SelectContent>
                {buckets.map((bucket) => (
                  <SelectItem key={bucket} value={bucket}>
                    {bucket}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AddDocumentBtn 
              userId={address}
              email={address}
            />
          </div>
        </div>

        {selectedBucket ? (
          bucketObjects.length > 0 ? (
            <ul className="document-ul">
              {bucketObjects.map((object) => (
                <li 
                  key={object.ObjectInfo.ObjectName} 
                  className="document-list-item cursor-pointer"
                  onClick={() => handleObjectClick(object.ObjectInfo.ObjectName)}
                >
                  <div className="flex flex-1 items-center gap-4">
                    <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                      <Image 
                        src="/assets/icons/doc.svg"
                        alt="file"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="line-clamp-1 text-lg">{object.ObjectInfo.ObjectName}</p>
                      <p className="text-sm font-light text-blue-100">
                        Size: {parseInt(object.ObjectInfo.PayloadSize).toLocaleString()} bytes
                      </p>
                      <p className="text-sm font-light text-blue-100">
                        Created: {new Date(parseInt(object.ObjectInfo.CreateAt) * 1000).toLocaleString()}
                      </p>
                      <p className="text-sm font-light text-blue-100">
                        Type: {object.ObjectInfo.ContentType}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No objects found in this bucket.</p>
          )
        ) : documents.data.length > 0 ? (
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
        ) : (
          <div className="document-list-empty">
            <Image 
              src="/assets/icons/doc.svg"
              alt="Document"
              width={40}
              height={40}
              className="mx-auto"
            />
            <p>No documents or buckets selected. Choose a bucket or create a new document.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default HomeClient;