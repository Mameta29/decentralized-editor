'use client';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import CustomConnectButton from '@/components/ConnectWallet';

const SignInPage = () => {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/'); // ホームページまたはダッシュボードへリダイレクト
    }
  }, [isConnected]);

  return (
    <main className="auth-page">
      <p>Sign in page</p>
      <CustomConnectButton />
    </main>
  );
};

export default SignInPage;