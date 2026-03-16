import { useEffect } from 'react';

export default function useReveal() {
  useEffect(() => {
    const doReveal = () => {
      document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
          el.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', doReveal);
    // run once on mount
    doReveal();
    return () => window.removeEventListener('scroll', doReveal);
  }, []);
}
