const MAX_SIZE = 1024; // longest side in pixels, keeps the upload small

// Turns a canvas into a plain base64 string (no "data:image/..." prefix).
export function canvasToBase64(canvas: HTMLCanvasElement) {
  return canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
}

// Shrinks a picture to a sensible size and returns it as base64.
export async function fileToBase64(file: Blob) {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    bitmap = await createImageBitmap(file); // older browsers don't support the option
  }
  const scale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvasToBase64(canvas);
}

export function videoFrameToBase64(video: HTMLVideoElement) {
  const scale = Math.min(1, MAX_SIZE / Math.max(video.videoWidth, video.videoHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(video.videoWidth * scale);
  canvas.height = Math.round(video.videoHeight * scale);
  canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvasToBase64(canvas);
}
