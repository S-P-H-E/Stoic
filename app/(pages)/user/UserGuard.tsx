'use client'

import Locked from '@/components/Locked';
import UserComponent from './User';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import PageLoader from '@/components/PageLoader';
import { isUserAllowedToFetch } from '@/utils/utils';

export default function UserGuard() {
  const { userStatus } = UserDataFetcher();
  
  const allowedToFetch = isUserAllowedToFetch(userStatus)

  // Check if userStatus is 'user' and userStatus is loaded before rendering.
  if (allowedToFetch) {
    return <UserComponent />;
  } else if (userStatus) {
    return (
      <>
        <Locked />
        <UserComponent />
      </>
    );
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return (
      <PageLoader/>
    );
  }
}
