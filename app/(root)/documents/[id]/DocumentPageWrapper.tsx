'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DocumentPageContent from './DocumentPageContent';

const DocumentPageWrapper = ({ id }: { id: string }) => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      setIsLoading(false);
    } else if (!isConnected) {
      router.push('/sign-in');
    }
  }, [isConnected, address, router]);

  if (isLoading || !address) {
    return <div>Loading...</div>;
  }

  return <DocumentPageContent id={id} userId={address} />;
};

export default DocumentPageWrapper;