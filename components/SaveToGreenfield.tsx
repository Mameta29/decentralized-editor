'use client'

import React, { useState } from 'react'
import { Button } from "./ui/button"
import Image from "next/image"
import { createBucket, saveTextToGreenfield } from '@/lib/greenfield'
import { useAccount } from 'wagmi';

interface SaveToGreenfieldProps {
  roomId: string;
  title: string;
  editorContent: string;
  currentUserType: UserType;
}

const SaveToGreenfield: React.FC<SaveToGreenfieldProps> = ({ roomId, title, editorContent, currentUserType }) => {
  const [loading, setLoading] = useState(false);
  const { address, connector } = useAccount();
  if (!address) {
    return null;
  }

  const handleSave = async () => {
    setLoading(true);
    const bucketName = "my-bucket2";
    const objectName = `${title}.txt`;
    console.log('text:', editorContent);

    try {
      // バケットの作成
    //   const bucketCreationResult = await createBucket(bucketName, address, connector);
    //   console.log('Bucket creation result:', bucketCreationResult);
      try {
        // テキストの保存
        const saveResult = await saveTextToGreenfield(bucketName, objectName, editorContent, address, connector);
        console.log('テキストが正常に保存されました:', saveResult);
      } catch (error) {
        console.error('オブジェクトテキストの保存に失敗しました:', error);
      } 
    } catch (error) {
      console.error('バケットテキストの保存に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="gradient-blue flex h-9 gap-1 px-4"
      onClick={handleSave}
      disabled={loading || currentUserType !== 'editor'}
    >
      <Image
        src="/assets/icons/save.svg"
        alt="save"
        width={20}
        height={20}
        className="min-w-4 md:size-5"
      />
      <p className="mr-1 hidden sm:block">
        {loading ? 'Saving...' : 'Save'}
      </p>
    </Button>
  )
}

export default SaveToGreenfield