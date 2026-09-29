/**
 * Compresses an image file before upload using browser Canvas API.
 * Reduces multi-megabyte camera/phone uploads to clean ~50-100KB web-ready images.
 *
 * @param {File} file - The file selected by the user
 * @param {number} maxWidth - Max width in pixels (default 1200)
 * @param {number} maxHeight - Max height in pixels (default 1200)
 * @param {number} quality - Output JPEG quality 0.0 to 1.0 (default 0.78)
 * @returns {Promise<string>} - Resolves to Base64 data URL
 */
export async function compressImageFile(file, maxWidth = 1200, maxHeight = 1200, quality = 0.78) {
  if (!file) return null;

  // If not an image, fallback to standard FileReader
  if (!file.type || !file.type.startsWith("image/")) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // Keep aspect ratio within maxWidth / maxHeight bounds
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.max(1, Math.round(width * ratio));
        height = Math.max(1, Math.round(height * ratio));
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { alpha: false });

      if (!ctx) {
        // Fallback
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      // Fill white background (useful for transparent PNG conversion)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      } catch (err) {
        // Safe fallback if canvas export throws
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}
