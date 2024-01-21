/* export interface User {
  userStripeId: string;
  userRoles: Role[] | "User" | undefined;
  generalLastCourse: string;
  userEmail: string | undefined;
  generalLastLesson: string;
  userName: string | null;
  userStatus: string | undefined;
  userProfileImageUrl: string;
  userProfileBannerUrl: string;
} */

export interface Task {
  id: string;
  name: string;
  description: string | undefined;
  createdAt: string;
  completed: boolean;
}

export interface User {
  id?: string | null
  stripeId?: string;
  roles?: Role[] | "User" | undefined;
  generalLastCourse?: string;
  generalLastLesson?: string;
  email?: string | undefined;
  name?: string | null;
  description?: string | null;
  status?: string | undefined;
  profileImageUrl?: string;
  profileBannerUrl?: string;
  social?: string | undefined;
}
  
export interface Role {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface GlobalUser {
  id: string | null;
  status: string | undefined;
  name: string | null
  stripeId: string | undefined;
}