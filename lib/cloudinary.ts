const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL;

export function getCloudinaryUrl(fileName: string, fileType: string) {
  if (!CLOUDINARY_URL) {
    console.error("NEXT_PUBLIC_CLOUDINARY_URL is not defined");
    return "";
  }
  return `${CLOUDINARY_URL}/${fileType}/upload/${fileName}`;
}
