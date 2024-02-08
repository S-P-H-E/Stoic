"use client"

import {useEffect, useState} from 'react';
import {collection, query, where, onSnapshot, updateDoc, doc, setDoc} from 'firebase/firestore';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth, db} from '@/utils/firebase';
import {useRouter} from 'next/navigation';
import {User} from 'firebase/auth';
import {SocialInfo} from "@/types/types";

interface UserDataFetcherResult {
    userStripeId: string;
    userRoles: Role[] | "User" | undefined;
    generalLastCourse: string;
    userEmail: string | undefined;
    generalLastLesson: string;
    userName: string | null;
    userStatus: string | undefined;
    user: User | null | undefined
    userId: string | null;
    userDescription: string | null;
    fetching: boolean;
    userProfileImageUrl: string;
    userProfileBannerUrl: string;
    userSocial: SocialInfo | undefined;
    userOnboarding: boolean;
    userCreatedAt: Date | undefined;
    userEmailVerified: boolean;
    userUid?: undefined | string;
    userPassword?: string | null;
}

interface Role {
    id: string;
    name: string;
    color: string;
    order: number;
}

// custom hook to get userName, userId, and user.email etc.
export function UserDataFetcher(): UserDataFetcherResult {
    const [user, fetching] = useAuthState(auth);
    const [userName, setUserName] = useState(null);
    const [userPassword, setUserPassword] = useState(null);
    const [userDescription, setUserDescription] = useState(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userStatus, setUserStatus] = useState<string>();
    const [userRoles, setUserRoles] = useState<Role[] | "User">();
    const [userEmail, setUserEmail] = useState<string>();
    const [generalLastCourse, setGeneralLastCourse] = useState('')
    const [generalLastLesson, setGeneralLastLesson] = useState('')
    const [userProfileImageUrl, setUserProfileImageUrl] = useState('')
    const [userProfileBannerUrl, setUserProfileBannerUrl] = useState('')
    const [userStripeId, setUserStripeId] = useState('')
    const [userSocial, setUserSocial] = useState<SocialInfo>({youtube: ''});
    const [userOnboarding, setUserOnboarding] = useState(false)
    const [userCreatedAt, setUserCreatedAt] = useState<Date | undefined>(undefined)
    const [userEmailVerified, setUserEmailVerified] = useState(false)
    const [userUid, setUserUid] = useState(undefined)

    const [roles, setRoles] = useState<Role[]>([]);

    const router = useRouter()

    useEffect(() => {
        const hasSubscription = async () => {
            try {
                if (userStripeId && user) {
                    const response = await fetch('/api/stripe/has-subscription', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userStripeId,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Issue with checking user subscription.');
                    }

                    const data = await response.json();
                    return data;
                }
            } catch (error) {
/*
                console.log(error)
*/
            }
        };

        const checkSubscription = async () => {
            const subscription = await hasSubscription();

            if (userId && subscription && userStatus === "user") {
                const userRef = doc(db, 'users', userId);

                await updateDoc(userRef, {
                    status: 'premium',
                });
            } else if (userId && !subscription && userStatus === "premium") {
                const userRef = doc(db, 'users', userId);

                await updateDoc(userRef, {
                    status: 'user',
                });
            }
        };

        if (userStripeId) {
            checkSubscription();
        }

    }, [userStripeId, user, userStatus, userId, router])


/*    // SYNCS DATABASE INFO TO FIREBASE AUTH
    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                const userRef = collection(db, 'users');
                const q = query(userRef,
                    where('email', '==', authUser.email),
                    where('custom', '==', true)
                );

                const unsubscribeFirestore = onSnapshot(q, async (querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();

                        const { emailVerified, displayName, photoURL } = authUser;
                        await updateDoc(doc(db, 'users', querySnapshot.docs[0].id), {
                            emailVerified: emailVerified,
                            photoUrl: photoURL,
                        });
                    }
                });

                return () => {
                    unsubscribeFirestore();
                };
            }
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);*/


    useEffect(() => {
        const rolesCollection = collection(db, 'roles');

        const unsubscribe = onSnapshot(rolesCollection, (snapshot) => {
            const rolesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
                color: doc.data().color,
                order: doc.data().order,
            }));
            setRoles(rolesData);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                // Things to do when user is authenticated
            } else {
                router.push('/')
            }
        }); // push to buy premium page

        if (user) {
            const userRef = collection(db, 'users');
            const q = query(userRef,
                where('email', '==', user.email),
                where('custom', '==', true)
            );

            const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
                if (!querySnapshot.empty) {

                    const userData = querySnapshot.docs[0].data();

                    /*          console.log(userData)

                              if (!userData.custom) {
                                console.log("Custom field not found for the user. You can add your logic here.");
                              } else {
                                console.log("Custom field is found")
                              }*/

                    const userRoles = userData.roles && userData.roles.map((roleName: string) => {
                        const role = roles.find((r) => r.name === roleName);
                        return role || {name: roleName, color: 'white'}; // Default color if role not found
                    });

                    setUserName(userData.name);
                    setUserEmail(userData.email);
                    setUserProfileBannerUrl(userData.bannerUrl);
                    setUserStatus(userData.status);
                    setUserRoles(userRoles || "User")
                    setUserId(querySnapshot.docs[0].id);
                    setUserProfileImageUrl(userData.photoUrl)
                    setGeneralLastCourse(userData.generalLastCourse);
                    setGeneralLastLesson(userData.generalLastLesson)
                    setUserStripeId(userData.stripe_customer_id)
                    setUserDescription(userData.description)
                    setUserSocial(userData.social)
                    setUserOnboarding(userData.onboarding)
                    setUserEmailVerified(userData.emailVerified)
                    setUserCreatedAt(userData.createdAt)
                    setUserUid(userData.uid)
                    setUserPassword(userData.password)

                    const newUserStatus = userData.status;
                    setUserStatus(newUserStatus);
                    /*          if (newUserStatus === "user") {
                                router.push('/upgrade');
                                } */
                }
            });

            return () => {
                unsubscribeAuth();
                if (unsubscribeFirestore) {
                    unsubscribeFirestore();
                }
            };
        }

        return unsubscribeAuth;
    }, [user, router, roles]);

    return {
        userEmailVerified,
        userCreatedAt,
        userOnboarding,
        userSocial,
        userDescription,
        userStripeId,
        userRoles,
        generalLastCourse,
        userEmail,
        generalLastLesson,
        userName,
        userStatus,
        user,
        userId,
        userUid,
        fetching,
        userProfileImageUrl,
        userProfileBannerUrl,
        userPassword
    };
}