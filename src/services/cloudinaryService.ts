import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/** Accepted image MIME types for uploads. */
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const MAX_IMAGE_SIZE_MB = 2;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

interface CloudinaryUploadResponse {
  secure_url: string;
  url?: string;
  public_id?: string;
}

export interface CloudinaryImage {
  secureUrl: string;
  publicId?: string;
}

/**
 * Upload an image file to Cloudinary.
 *
 * @param file The image file to upload.
 * @param onProgress Optional callback receiving an integer percentage (0–100).
 * @returns The Secure (HTTPS) URL of the uploaded image.
 *
 * @throws Error if the Cloudinary env vars are missing, or if the upload fails.
 */
export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryImage> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const { data } = await axios.post<CloudinaryUploadResponse>(
    UPLOAD_URL,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
      onUploadProgress: (progressEvent) => {
        if (!onProgress || typeof progressEvent.total !== 'number') return;
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(Math.min(percent, 100));
      },
    }
  );

  if (!data?.secure_url) {
    throw new Error('Cloudinary did not return an image URL.');
  }

  return { secureUrl: data.secure_url, publicId: data.public_id };
}
