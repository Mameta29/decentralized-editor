'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

const ConnectWallet = () => {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const setCookie = () => {
      if (isConnected && address) {
        // クッキーを設定
        document.cookie = `wallet_address=${address}; path=/; max-age=86400; SameSite=Strict`;
        console.log('Wallet address cookie set:', address);
        console.log('All cookies:', document.cookie);
      } else {
        console.log('Not connected or no address');
      }
    };

    setCookie();

    // 接続状態が変わった時にも再度チェック
    window.addEventListener('focus', setCookie);
    return () => window.removeEventListener('focus', setCookie);
  }, [isConnected, address]);

  return <ConnectButton accountStatus="address"/>;
};

export default ConnectWallet;