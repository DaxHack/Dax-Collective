import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

export default function TravelerPhotoViewer({ photos, index, onClose, onStep, triggerRef }) {
  const photo = photos[index];
  const reduceMotion = useReducedMotion();
  const touchStart = useRef(null);
  useEffect(() => {
    const returnFocus = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = event => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onStep(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onStep(1);
      }
      if (event.key === 'Tab') {
        const controls = document.querySelectorAll('.traveler-viewer button');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
      if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
    };
  }, [onClose, onStep, triggerRef]);

  const onTouchStart = event => {
    if (event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = event => {
    if (event.touches.length > 0) {
      touchStart.current = null;
      return;
    }
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current.x;
    const dy = event.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(delta) > 45 && Math.abs(delta) > Math.abs(dy) * 1.35) onStep(delta < 0 ? 1 : -1);
    touchStart.current = null;
  };
  const transition = reduceMotion ? { duration: 0.01 } : { duration: 0.24 };

  if (!photo) return null;
  return createPortal(
        <motion.div
          className="traveler-viewer"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={() => { touchStart.current = null; }}
          data-testid="photo-viewer"
        >
          <button className="tv-close" onClick={onClose} aria-label="Close photo viewer" autoFocus><X /></button>
          <button className="tv-prev" onClick={event => { event.stopPropagation(); onStep(-1); }} aria-label="Previous photo"><ArrowLeft /></button>
          <figure onClick={event => event.stopPropagation()}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={transition}
              />
            </AnimatePresence>
            <figcaption><span>{photo.location}</span>{photo.caption}</figcaption>
          </figure>
          <button className="tv-next" onClick={event => { event.stopPropagation(); onStep(1); }} aria-label="Next photo"><ArrowRight /></button>
          <p className="tv-count">{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')} <span>· swipe or use arrow keys</span></p>
        </motion.div>
    , document.body
  );
}
