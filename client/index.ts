import { GREEN_CHAIN_ID, GRPC_URL } from '@/app/config/env';
import { Client } from '@bnb-chain/greenfield-js-sdk';

export const client = Client.create(GRPC_URL, String(GREEN_CHAIN_ID));

export const getSps = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter((v: any) => v.endpoint.includes('nodereal'));

  return finalSps;
};

export const getAllSps = async () => {
  const sps = await getSps();

  return sps.map((sp) => {
    return {
      address: sp.operatorAddress,
      endpoint: sp.endpoint,
      name: sp.description?.moniker,
    };
  });
};

export const selectSp = async () => {
  console.log("GREEN_CHAIN_ID", GREEN_CHAIN_ID)
  console.log("GRPC_URL", GRPC_URL)

  const finalSps = await getSps();
  console.log("finalSps", finalSps)

  const selectIndex = Math.floor(Math.random() * finalSps.length);
  console.log("selectIndex", selectIndex)

  const secondarySpAddresses = [
    ...finalSps.slice(0, selectIndex),
    ...finalSps.slice(selectIndex + 1),
  ].map((item) => item.operatorAddress);
  const selectSpInfo = {
    id: finalSps[selectIndex].id,
    endpoint: finalSps[selectIndex].endpoint,
    primarySpAddress: finalSps[selectIndex]?.operatorAddress,
    // primarySpAddress: "0xDfCC53C89526e4892F2C370dC99C4E47023A9eC8",
    sealAddress: finalSps[selectIndex].sealAddress,
    secondarySpAddresses,
  };
  console.log("selectSpInfo", selectSpInfo)

  return selectSpInfo;
};
