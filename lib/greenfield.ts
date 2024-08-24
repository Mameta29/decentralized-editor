// import { BucketInfo } from './greenfield';
import { client, selectSp } from '../client';
import { VisibilityType, Long, OnProgressEvent, GetUserBucketsRequest, ListObjectsByBucketNameResponse } from '@bnb-chain/greenfield-js-sdk';
import { getOffchainAuthKeys } from './offchainAuth';

export const createBucket = async (bucketName: string, creator: string, connector: any) => {
  const bucketNameNotEmpty = "my-bucket3";
  const spInfo = await selectSp();
  const provider = await connector?.getProvider();
  console.log("connector", connector)
  const offChainData = await getOffchainAuthKeys(creator, provider);
  if (!offChainData) {
    alert('No offchain, please create offchain pairs first');
    return;
  }
  console.log('createBucket', bucketName, creator);
  const createBucketTx = await client.bucket.createBucket({
    bucketName: bucketNameNotEmpty,
    creator,
    visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
    chargedReadQuota: Long.ZERO,
    paymentAddress: creator,
    primarySpAddress: spInfo.primarySpAddress
  });

  const simulateInfo = await createBucketTx.simulate({
    denom: 'BNB',
  });
  console.log('simulateInfo', simulateInfo);

  const res = await createBucketTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: creator,
    granter: '',
  });
  console.log('createBucketTx', res);

  return res;
};

export const saveTextToGreenfield = async (bucketName: string, objectName: string, text: string, creator: string, connector: any) => {
  const spInfo = await selectSp();
  console.log('spInfo', spInfo);

  const provider = await connector?.getProvider();
  const offChainData = await getOffchainAuthKeys(creator, provider);
  if (!offChainData) {
    throw new Error('No offchain, please create offchain pairs first');
  }
  console.log("bucketName", bucketName)
  console.log("objectName", objectName)
  // const bucketNameNotEmpty = "my-bucket3";
  // console.log("bucketNameNotEmpty", bucketNameNotEmpty)


  // createBucket(bucketNameNotEmpty, creator, connector);
  // .txt 拡張子が既に含まれているかチェック
  const fileName = objectName.endsWith('.txt') ? objectName : `${objectName}.txt`;

  // テキストを Blob オブジェクトに変換
  const blob = new Blob([text], { type: 'text/plain' });
  // Blob から File オブジェクトを作成
  const file = new File([blob], fileName, { type: 'text/plain' });

  try {
    const res = await client.object.delegateUploadObject({
      bucketName,
      objectName,
      body: file,
      delegatedOpts: {
        visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
      },
      onProgress: (e: OnProgressEvent) => {
        console.log('progress: ', e.percent);
      },
    }, {
      type: 'EDDSA',
      address: creator,
      domain: window.location.origin,
      seed: offChainData.seedString,
    })

    if (res.code === 0) {
      alert('create object success');
    }
  } catch (err) {
    console.log(typeof err)
    if (err instanceof Error) {
      alert(err.message);
    }
    if (err && typeof err ==='object') {
      alert(JSON.stringify(err))
    }
  }
};

export const deleteObject = async (bucketName: string, objectName: string, operator: string, connector: any) => {
  const spInfo = await selectSp();
  const provider = await connector?.getProvider();
  console.log("connector", connector);
  const offChainData = await getOffchainAuthKeys(operator, provider);
  if (!offChainData) {
    throw new Error('No offchain, please create offchain pairs first');
  }

  // バケット名が空の場合はデフォルト値を使用
  const effectiveBucketName = bucketName || "my-bucket3";

  try {
    console.log('Deleting object', effectiveBucketName, objectName, operator);
    const deleteObjectTx = await client.object.deleteObject({
      bucketName: effectiveBucketName,
      objectName,
      operator,
    });

    // シミュレーション
    const simulateInfo = await deleteObjectTx.simulate({
      denom: 'BNB',
    });
    console.log('Simulate info:', simulateInfo);

    // ブロードキャスト
    const res = await deleteObjectTx.broadcast({
      denom: 'BNB',
      gasLimit: Number(simulateInfo?.gasLimit),
      gasPrice: simulateInfo?.gasPrice || '5000000000',
      payer: operator,
      granter: '',
    });
    console.log('Delete object transaction:', res);

    if (res.code === 0) {
      console.log('Object deleted successfully');
      return res;
    } else {
      throw new Error(`Failed to delete object: ${res}`);
    }
  } catch (err) {
    console.error('Error deleting object:', err);
    if (err instanceof Error) {
      throw new Error(`Error deleting object: ${err.message}`);
    } else {
      throw new Error(`Unknown error deleting object: ${JSON.stringify(err)}`);
    }
  }
};

// バケットのリスト取得
export const listBuckets = async (address: string, connector: any): Promise<string[]> => {
  const spInfo = await selectSp();
  const provider = await connector?.getProvider();
  console.log("connector", connector)
  const offChainData = await getOffchainAuthKeys(address, provider);

  // if (!offChainData) {
  //   alert('No offchain, please create offchain pairs first');
  //   return;
  // }
  try {
    const response = await client.bucket.listBuckets({
      address: address,
      endpoint: spInfo.endpoint,
    });
    console.log('listBuckets response:', response);
    if (!response.body) {
      return [];
    } 
    return response.body.map((bucket: any) => bucket.BucketInfo.BucketName);
  } catch (error) {
    console.error('Error fetching buckets:', error);
    throw error;
  }
};

// バケット内のオブジェクトリスト取得
export const listBucketObjects = async (bucketName: string, connector: any, address: string): Promise<ListObjectsByBucketNameResponse[]> => {
  const spInfo = await selectSp();
  const provider = await connector?.getProvider();
  console.log("connector", connector)
  const offChainData = await getOffchainAuthKeys(address, provider);
  
  // if (!offChainData) {
  //   alert('No offchain, please create offchain pairs first');
  //   return;
  // }
  try {
    const spInfo = await selectSp();
    const response = await client.object.listObjects({
      bucketName,
      endpoint: spInfo.endpoint,
    });
    console.log('listObjects response:', response);
    if (!response || !response.body?.GfSpListObjectsByBucketNameResponse?.Objects) {
      return [];
    }
    return response.body.GfSpListObjectsByBucketNameResponse.Objects as any;
  } catch (error) {
    console.error('Error fetching bucket objects:', error);
    throw error;
  }
};


export interface BucketInfo {
  bucketName: string;
  bucketId: string;
  // 他の必要なプロパティを追加
}

export interface ObjectInfo {
  objectName: string;
  payloadSize: string;
  // 他の必要なプロパティを追加
}