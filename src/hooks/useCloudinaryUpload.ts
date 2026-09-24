import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import {
  uploadImageToCloudinary,
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from '@/services/cloudinaryService';

export function useCloudinaryUpload() {
  const { showToast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      if (
        !ACCEPTED_IMAGE_TYPES.includes(
          file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]
        )
      ) {
        const msg =
          'Invalid file type. Please upload a JPG, PNG or WEBP image.';
        setError(msg);
        showToast(msg, 'error');
        return null;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        const msg = `Image exceeds the ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB size limit.`;
        setError(msg);
        showToast(msg, 'error');
        return null;
      }

      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const { secureUrl } = await uploadImageToCloudinary(file, (percent) =>
          setUploadProgress(percent)
        );
        setUploadProgress(100);
        return secureUrl;
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Image upload failed. Please try again.';
        setError(msg);
        showToast(msg, 'error');
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [showToast]
  );

  const reset = useCallback(() => {
    setUploadProgress(0);
    setIsUploading(false);
    setError(null);
  }, []);

  return { uploadProgress, isUploading, error, uploadImage, reset };
}
