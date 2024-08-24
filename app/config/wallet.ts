"use client";

import { Chain, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { GREEN_CHAIN_ID, GREENFIELD_RPC_URL, BSC_CHAIN_ID, BSC_RPC_URL } from './env';

const greenFieldChain: Chain = {
  id: GREEN_CHAIN_ID,
  network: 'greenfield',
  rpcUrls: {
    default: { http: [GREENFIELD_RPC_URL] },
    public: { http: [GREENFIELD_RPC_URL] },
  },
  name: 'greenfield',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
};

const bscChain: Chain = {
  id: BSC_CHAIN_ID,
  name: 'BSC',
  network: 'bsc smart chain',
  rpcUrls: {
    default: { http: [BSC_RPC_URL] },
    public: { http: [BSC_RPC_URL] },
  },
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
};

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [greenFieldChain, bscChain],
  [publicProvider()]
);