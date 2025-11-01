import { useEffect, useState } from 'react';
import { GoogleAuthProvider, UserCredential, signInWithPopup } from 'firebase/auth';

import { auth } from '../../../firebase.config';
import { isUser, useFirebaseAuth } from '../../../contexts/FirebaseAuthContext';
import { getLocalStorageNamespace } from '../../../contexts/StoreContext';
import useComponentVisible from '../../../hooks/useComponentVisible';
import { createOrGetUser } from '../../../api/auth.api';

import Dialog from '../../../lib/Dialog';
import AuthDialogContent from './AuthDialog';

import { remove, set } from '../../../util/local-storage';

const provider = new GoogleAuthProvider();
auth.useDeviceLanguage();

function DefaultAvatar({ email }: { email?: string | null }) {
  const getInitials = () => {
    if (email) {
      const parts = email.split('@')[0].split(/[._-]/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="default-avatar">
      <span className="default-avatar__initials">{getInitials()}</span>
    </div>
  );
}

export default function UserAuth() {
  const user = useFirebaseAuth();
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  const [
    authDialogRef,
    isAuthDialogVisible,
    setIsAuthDialogVisible,
    linkRef,
  ] = useComponentVisible();

  useEffect(() => {
    if (isUser(user)) {
      setPhotoSrc(user.photoURL || null);
    } else {
      setPhotoSrc(null);
    }
  }, [user])

  const authDialogContentProps = {
    isCloseable: false,
    componentProps: {
      signOutUser: () => {
        auth.signOut()
          .then(() => {
            setPhotoSrc(null);
            remove(`${getLocalStorageNamespace()}_isUserAuthenticated`);
          })
      },
      userEmail: isUser(user) ? user?.email : null,
    },
    Component: AuthDialogContent,
    delta: { x: 0, y: 0 },
    isDraggable: false,
    isSelfAdjustable: false,
    hasInitTransition: false,
    positionOffset: { x: -180, y: 50 },
    isDialogVisible: isAuthDialogVisible,
    setIsDialogVisible: setIsAuthDialogVisible,
    stylePosition: 'absolute' as const,
  };

  async function handleSignInResult(result: UserCredential) {
    try {
      // Create or get user from backend
      await createOrGetUser(result.user.uid, {
        email: result.user.email || '',
        name: result.user.displayName || undefined,
        photoURL: result.user.photoURL || undefined,
      });
      setPhotoSrc(result.user.photoURL || null);
      set(`${getLocalStorageNamespace()}_authenticatedUserId`, result.user.uid);
    } catch (error: unknown) {
      console.error('Error during sign in:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error message: ', errorMessage);
    }
  }

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => handleSignInResult(result))
  }

  const handleClick = () => {
    if (user === null) {
      signInWithGoogle();
    } else {
      setIsAuthDialogVisible(prevVisibility => !prevVisibility);
    }
  }

  return <div style={{ position: 'relative' }}>
    <button
      className='clear-btn--no-effects user-image-wrapper row middle-xs center-xs'
      onClick={handleClick}
      ref={linkRef}
    >
      <span>
        {photoSrc ? (
          <img className='user-image' src={photoSrc} alt="User avatar" />
        ) : (
          <DefaultAvatar email={isUser(user) ? user?.email : null} />
        )}
      </span>
    </button>
    <Dialog ref={authDialogRef} {...authDialogContentProps} />
  </div>
}