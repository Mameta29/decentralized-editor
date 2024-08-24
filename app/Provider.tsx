'use client';

import Loader from '@/components/Loader';
import { getDocumentUsers } from '@/lib/actions/user.actions';
import { useAccount } from 'wagmi';
import { ClientSideSuspense, LiveblocksProvider } from '@liveblocks/react/suspense';
import { ReactNode } from 'react';
import { WagmiConfig, createConfig } from 'wagmi';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chains, publicClient } from '@/app/config/wallet';

const projectId = '9bf3510aab08be54d5181a126967ee71';
const { connectors } = getDefaultWallets({
  projectId,
  appName: 'greenfield js sdk demo',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

// wagmiフックを使用する新しいコンポーネント
const LiveblocksWrapper = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        return []; // 必要に応じて適切なデータを返す
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({
          roomId,
          currentUser: address || '',
          text,
        });
        return roomUsers;
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {() => children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider modalSize="compact" chains={chains}>
        <LiveblocksWrapper>
          {children}
        </LiveblocksWrapper>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Provider;