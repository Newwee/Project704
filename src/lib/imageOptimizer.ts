'use client';

/**
 * Compresses an image File using HTML5 Canvas.
 * Produces an optimized JPEG data URL (typically 30KB - 60KB).
 * Prevents mobile memory crashes and eliminates localStorage QuotaExceededError.
 */
export async function compressImage(
  file: File,
  maxWidth = 720,
  maxHeight = 720,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not in browser, fallback to empty
    if (typeof window === 'undefined') {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onerror = (e) => reject(e);
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = (e) => reject(e);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio-preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // If canvas context unavailable, fallback to original data url
          resolve(event.target?.result as string);
          return;
        }

        // High quality smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
