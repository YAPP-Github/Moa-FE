import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router';
import { useProfile } from '../../api/auth.queries';
import { GlobalLoading } from '@/shared/ui/global-loading/GlobalLoading';

const MIN_LOADING_MS = 500;

export function RouteGuard() {
  const { isLoading } = useProfile();
  const isInitialCheckDone = useRef(false);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), MIN_LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  const isReady = !isLoading && minTimePassed;

  if (isReady && !isInitialCheckDone.current) {
    isInitialCheckDone.current = true;
    setIsFadingOut(true);
  }

  if (!isInitialCheckDone.current) {
    return <GlobalLoading />;
  }

  return (
    <>
      {isFadingOut && (
        <GlobalLoading
          className="pointer-events-none opacity-0"
          onTransitionEnd={() => setIsFadingOut(false)}
        />
      )}
      <Outlet />
    </>
  );
}
