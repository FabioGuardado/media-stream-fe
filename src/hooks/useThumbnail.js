import { useState, useEffect } from 'react'
import { generateThumbnailFromUrl } from '../utils/generateThumbnail'

/**
 * Lazily generates a video thumbnail from a stream URL when the component mounts.
 * Returns null for audio items (no streamUrl passed) and on any error.
 *
 * @param {string|null} streamUrl - Full URL to the video stream endpoint, or null for audio
 * @returns {{ thumbnail: string|null, loading: boolean }}
 */
export function useThumbnail(streamUrl) {
  const [thumbnail, setThumbnail] = useState(null)
  const [loading, setLoading]     = useState(!!streamUrl)

  useEffect(() => {
    if (!streamUrl) return

    let cancelled = false
    setLoading(true)

    generateThumbnailFromUrl(streamUrl).then((dataUrl) => {
      if (!cancelled) {
        setThumbnail(dataUrl)
        setLoading(false)
      }
    })

    return () => { cancelled = true }
  }, [streamUrl])

  return { thumbnail, loading }
}
