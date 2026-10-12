import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Query selection does not move focus or scroll; actual world navigation does.
export default function useRouteFocus(ref) {
  const { pathname } = useLocation();
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, ref]);
}
