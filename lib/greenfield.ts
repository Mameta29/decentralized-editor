import { client } from '../client';
import { VisibilityType, Long } from '@bnb-chain/greenfield-js-sdk';

export const createBucket = async (bucketName: string, creator: string, primarySpAddress: string) => {
  const createBucketTx = await client.bucket.createBucket({
    bucketName,
    creator,
    visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
    chargedReadQuota: Long.ZERO,
    paymentAddress: creator,
    primarySpAddress,
  });

  const simulateInfo = await createBucketTx.simulate({
    denom: 'BNB',
  });

  const res = await createBucketTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: creator,
    granter: '',
  });

  return res;
};