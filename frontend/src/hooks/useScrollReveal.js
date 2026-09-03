import { useEffect } from 'react';

/**
 * Attaches IntersectionObserver to all `.reveal` elements inside a container ref.
 * Mirrors the IntersectionObserver logic in script.js.
 */
export function useScrollReveal(containerRef) {
  useEffect(() => {
    const container = containerRef?.current ?? document;
    const items = container.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerRef]);
}
