import { useEffect, useRef } from 'react';

// Each dialog owns one lock. Nested cleanup and route unmount order must not
// restore the child's "hidden" value after the parent has already unlocked.
let lockCount = 0;
let originalOverflow = '';

function lockScroll() {
  if (lockCount === 0) {
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
  return () => {
    lockCount -= 1;
    if (lockCount === 0) document.body.style.overflow = originalOverflow;
  };
}

export default function useModalBoundary(suspended, opener, onClose, selector) {
  const suspendedRef = useRef(suspended);
  const closeRef = useRef(onClose);
  const openerRef = useRef(opener);
  suspendedRef.current = suspended;
  closeRef.current = onClose;

  useEffect(() => {
    const originalOpener = openerRef.current;
    const unlock = lockScroll();
    const root = () => document.querySelector(`${selector}:not([inert])`);
    const controls = () => [...(root()?.querySelectorAll('button:not(:disabled), a[href]') || [])];
    const timer = window.requestAnimationFrame(() => controls()[0]?.focus({ preventScroll: true }));
    const keydown = event => {
      if (suspendedRef.current) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key === 'Tab') {
        const items = controls();
        if (!items.length) return;
        const outside = !items.includes(document.activeElement);
        if (event.shiftKey && (outside || document.activeElement === items[0])) {
          event.preventDefault();
          items[items.length - 1].focus();
        } else if (!event.shiftKey && (outside || document.activeElement === items[items.length - 1])) {
          event.preventDefault();
          items[0].focus();
        }
      }
    };
    window.addEventListener('keydown', keydown);
    return () => {
      window.cancelAnimationFrame(timer);
      unlock();
      window.removeEventListener('keydown', keydown);
      // Wait for React to remove inert from the parent/page before returning focus.
      window.requestAnimationFrame(() => {
        const target = originalOpener;
        if (target?.isConnected && !target.closest('[inert]')) target.focus({ preventScroll: true });
        else document.querySelector('.v3-photo-viewer button, .v3-chapter-dialog:not([inert]) button, .universe-v3:not([inert]) .v3-wordmark')?.focus({ preventScroll: true });
      });
    };
  }, [selector]);
}
