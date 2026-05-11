export function generateThumbnailFromUrl(url, quality = 0.75) {
  return new Promise((resolve) => {
    const video = document.createElement('video');

    video.crossOrigin = 'anonymous'; // needed for canvas.toDataURL across origins
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration * 0.1);
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 480 / video.videoWidth);
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);

        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch {
        resolve(null);
      }
    };

    video.onerror = () => resolve(null);

    video.src = url;
  });
}
