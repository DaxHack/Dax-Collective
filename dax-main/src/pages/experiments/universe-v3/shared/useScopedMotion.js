import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';

// One controller per property. A future approved scroll scene owns only its
// own target subtree; Framer must not animate the same properties.
export default function useScopedMotion(scope, setup) {
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion || !scope.current) return undefined;
    const context = gsap.context(setup, scope);
    return () => context.revert();
  }, [scope, setup, reducedMotion]);
}
