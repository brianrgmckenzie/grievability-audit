'use client';

import { useEffect } from 'react';

export default function EmbedResizeReporter() {
  useEffect(() => {
    if (window.self === window.top) return;

    const report = () => {
      window.parent.postMessage(
        { type: 'grievability-audit:resize', height: document.body.scrollHeight },
        '*'
      );
    };

    const observer = new ResizeObserver(report);
    observer.observe(document.body);

    const raf = requestAnimationFrame(report);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return null;
}
