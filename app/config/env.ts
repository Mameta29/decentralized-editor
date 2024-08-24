// import getConfig from 'next/config';

// const { publicRuntimeConfig } = getConfig();
// const {
//   NEXT_PUBLIC_GRPC_URL,
//   NEXT_PUBLIC_GREENFIELD_RPC_URL,
//   NEXT_PUBLIC_GREEN_CHAIN_ID,
//   NEXT_PUBLIC_BSC_RPC_URL,
//   NEXT_PUBLIC_BSC_CHAIN_ID,
// } = publicRuntimeConfig || {};

// export const GRPC_URL = NEXT_PUBLIC_GRPC_URL;
// export const GREENFIELD_RPC_URL = NEXT_PUBLIC_GREENFIELD_RPC_URL;
// export const GREEN_CHAIN_ID = parseInt(NEXT_PUBLIC_GREEN_CHAIN_ID);
// export const BSC_RPC_URL = NEXT_PUBLIC_BSC_RPC_URL;
// export const BSC_CHAIN_ID = parseInt(NEXT_PUBLIC_BSC_CHAIN_ID);

// ./app/config/env.ts

export const GRPC_URL = process.env.NEXT_PUBLIC_GRPC_URL || '';
export const GREENFIELD_RPC_URL = process.env.NEXT_PUBLIC_GREENFIELD_RPC_URL || '';
export const GREEN_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_GREEN_CHAIN_ID || '0', 10);
export const BSC_RPC_URL = process.env.NEXT_PUBLIC_BSC_RPC_URL || '';
export const BSC_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_BSC_CHAIN_ID || '0', 10);


