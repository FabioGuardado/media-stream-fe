import { useState, useEffect } from 'react';
import { generateThumbnailFromUrl } from '../utils/generateThumbnail';

export function useThumbnail(streamUrl) {
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(!!streamUrl);

  useEffect(() => {
    if (!streamUrl) return;

    let cancelled = false;
    setLoading(true);

    generateThumbnailFromUrl(streamUrl).then((dataUrl) => {
      if (!cancelled) {
        setThumbnail(dataUrl);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [streamUrl]);

  return { thumbnail, loading };
}
