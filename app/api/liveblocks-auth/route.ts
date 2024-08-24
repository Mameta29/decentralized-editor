import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  console.log('Liveblocks auth route called');

  try {
    // クッキーからウォレットアドレスを取得
    const cookieStore = cookies();
    const walletAddress = cookieStore.get('wallet_address')?.value;

    console.log('Wallet address from cookie:', walletAddress);

    if (!walletAddress) {
      console.log('No wallet address found, returning 401');
      return new Response(JSON.stringify({ error: 'Unauthorized: No wallet address' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ウォレットアドレスをユーザー情報として使用
    const user = {
      id: walletAddress,
      info: {
        id: walletAddress,
        name: `Wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        email: `${walletAddress}@example.com`, // 仮のメールアドレス
        avatar: "", // アバター画像がない場合は空文字列または適切なデフォルト値を設定
        color: getUserColor(walletAddress),
      }
    }

    console.log('User info:', user);

    // Identify the user and return the result
    const { status, body } = await liveblocks.identifyUser(
      {
        userId: user.info.email,
        groupIds: [],
      },
      { userInfo: user.info },
    );

    console.log('Liveblocks response:', { status, body });

    return new Response(body, { 
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    console.error('Error in liveblocks-auth route:', error);
    
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}