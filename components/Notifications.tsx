'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { InboxNotification, InboxNotificationList, LiveblocksUIConfig } from "@liveblocks/react-ui"
import { useInboxNotifications, useUnreadInboxNotificationsCount } from "@liveblocks/react/suspense"
import Image from "next/image"
import { ReactNode } from "react"

const Notifications = () => {
  const { address, isConnected } = useAccount();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      // クッキーにウォレットアドレスを設定
      document.cookie = `wallet_address=${address}; path=/; max-age=3600; SameSite=Strict`;
    } else {
      console.log('Wallet not connected or address not available');
      setError('Please connect your wallet to view notifications');
    }
  }, [isConnected, address]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isConnected || !address) {
    return <div>Please connect your wallet to view notifications</div>;
  }

  return <NotificationsContent />;
};

const NotificationsContent = () => {
  return (
    <Popover>
      <PopoverTrigger className="relative flex size-10 items-center justify-center rounded-lg">
        <Image 
          src="/assets/icons/bell.svg"
          alt="inbox"
          width={24}
          height={24}
        />
        <NotificationCount />
      </PopoverTrigger>
      <PopoverContent align="end" className="shad-popover">
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
};

const NotificationCount = () => {
  const { count } = useUnreadInboxNotificationsCount();
  
  if (count > 0) {
    return <div className="absolute right-2 top-2 z-20 size-2 rounded-full bg-blue-500" />;
  }
  
  return null;
};

const NotificationList = () => {
  const { inboxNotifications } = useInboxNotifications();
  const unreadNotifications = inboxNotifications.filter((notification) => !notification.readAt);

  return (
    <LiveblocksUIConfig 
      overrides={{
        INBOX_NOTIFICATION_TEXT_MENTION: (user: ReactNode) => (
          <>{user} mentioned you.</>
        )
      }}
    >
      <InboxNotificationList>
        {unreadNotifications.length <= 0 && (
          <p className="py-2 text-center text-dark-500">No new notifications</p>
        )}

        {unreadNotifications.length > 0 && unreadNotifications.map((notification) => (
          <InboxNotification 
            key={notification.id}
            inboxNotification={notification}
            className="bg-dark-200 text-white"
            href={`/documents/${notification.roomId}`}
            showActions={false}
            kinds={{
              thread: (props) => (
                <InboxNotification.Thread {...props} 
                  showActions={false}
                  showRoomName={false}
                />
              ),
              textMention: (props) => (
                <InboxNotification.TextMention {...props} 
                  showRoomName={false}
                />
              ),
              $documentAccess: (props) => (
                <InboxNotification.Custom {...props} title={props.inboxNotification.activities[0].data.title} aside={<InboxNotification.Icon className="bg-transparent">
                  <Image 
                    src={props.inboxNotification.activities[0].data.avatar as string || ''}
                    width={36}
                    height={36}
                    alt="avatar"
                    className="rounded-full"
                  />
                </InboxNotification.Icon>}>
                  {props.children}
                </InboxNotification.Custom>
              )
            }}
          />
        ))}
      </InboxNotificationList>
    </LiveblocksUIConfig>
  );
};

export default Notifications;