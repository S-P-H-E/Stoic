"use client"
import Channels from '@/components/Community/Channels'
import Chat from '@/components/Community/Chat';
import Chatbox from '@/components/Community/Chatbox';
import Members from '@/components/Community/Members';
import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { collection, onSnapshot } from 'firebase/firestore';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
  permissions: {
    [key: string]: {
      canMessage: boolean;
      canSeeChannel: boolean;
      canSeeMessages: boolean;
      [key: string]: boolean; // additional dynamic permissions
    };
  };
}

interface Member {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  bannerUrl: string;
  status: string;
  canMessage: boolean;
}

export default function CommunityPage() {

  const { userId, userStatus } = UserDataFetcher()

  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel>();
  
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUser, setCurrentUser] = useState<Member | undefined>();

  const { channelId } = useParams();
  const currentChannelIdString = channelId || '';

    function truncateText(text: string, maxLength: number) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    }

    useEffect(() => {
      if (currentChannel) {
        const usersCollection = collection(db, 'users');
        const unsubscribe = onSnapshot(usersCollection, (querySnapshot) => {
          const membersData: Member[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              email: data.email,
              photoUrl: data.photoUrl,
              bannerUrl: data.bannerUrl,
              status: data.status,
              canMessage: currentChannel.permissions[data.status]?.canMessage || false,
            };
          });
          
          const filteredMembers = membersData.filter((member) => {
            const hasPermissionToSee =
              currentChannel.permissions[member.status]?.canSeeChannel || false;
            return member.status === 'admin' || (member.status === 'premium' && hasPermissionToSee);
          });

          setMembers(filteredMembers);

          const currentUserData = membersData.find((member) => member.id === userId);
          setCurrentUser(currentUserData);
        });
  
        return () => unsubscribe();
      }
    }, [currentChannel, userId]);

    useEffect(() => {
      const channelsCollection = collection(db, 'channels');
  
      const unsubscribe = onSnapshot(channelsCollection, (querySnapshot) => {
        const channelsData: Channel[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            icon: data.icon,
            permissions: data.permissions,
          };
        });
  
        setChannels(channelsData);

        const currentChannelData = channelsData.find((channel) => channel.id === currentChannelIdString);

        console.log(currentChannelData)
        setCurrentChannel(currentChannelData);
      });
  
      return () => unsubscribe();
    }, [currentChannelIdString]);

  return (
    <main className='h-full flex items-end w-full'>

      <section className="h-screen w-2/12 border-r border-[--border] flex flex-col gap-4 p-2">
        <h1 className="text-2xl font-medium justify-center flex">Community</h1>
        <Channels channelId={currentChannelIdString} channels={channels} userStatus={userStatus}/>
      </section>
      
      <section className="h-screen w-8/12 border-r border-[--border] flex flex-col gap-4">

        <div className='flex flex-col h-full w-full relative'>
          <div className="text-2xl py-2 font-medium justify-center flex border-b border-[--border]">
            <h1>{currentChannel ? truncateText(currentChannel.name, 30) : 'Loading...'}</h1>
          </div>
          
          <Chat channelId={channelId} members={members}/>
          <div className="sticky w-full p-2">
            <Chatbox currentChannelName={currentChannel?.name} messagePermission={currentUser?.canMessage || false} userStatus={userStatus} userId={userId} channelId={channelId}/>
          </div>
        </div>
      </section>

      <section className="h-screen w-2/12 flex flex-col gap-4 p-2">
        <h1 className="text-2xl font-medium justify-center flex">Members</h1>
        <Members members={members}/>
      </section>

    </main>
  )
}