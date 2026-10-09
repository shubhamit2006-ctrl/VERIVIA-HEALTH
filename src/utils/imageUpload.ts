import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Fast helper to race a promise with a timeout in milliseconds.
 * Prevents network calls from hanging the UI when Firebase Storage
 * bucket rules or CORS cause prolonged retry delays.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([
    promise.then(res => {
      clearTimeout(timer);
      return res;
    }).catch(() => {
      clearTimeout(timer);
      return fallback;
    }),
    timeoutPromise
  ]);
}

/**
 * Compresses an image file client-side to ensure optimal web performance
 * and fits safely within Firestore document limits (if stored as Data URL).
 */
export async function compressImage(file: File, maxDimension = 1400, quality = 0.82): Promise<{ dataUrl: string; blob: Blob }> {
  // If file is already small (< 150KB), just read directly for maximum speed
  if (file.size < 150 * 1024 && !file.type.includes('png')) {
    const dataUrl = await fileToDataUrl(file);
    return { dataUrl, blob: file };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image format'));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Draw with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ dataUrl, blob });
            } else {
              resolve({ dataUrl, blob: new Blob() });
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image to Firebase.
 * Tries Firebase Storage first with a fast timeout; if Storage bucket or rules are unavailable,
 * falls back to compressed high-fidelity Data URL which saves directly in Firestore.
 */
export async function uploadImageToFirebase(file: File, folder = 'hotels'): Promise<string> {
  const { dataUrl, blob } = await compressImage(file);

  try {
    if (storage && storage.app) {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${Date.now()}_${cleanName}`;
      const storageRef = ref(storage, `${folder}/${filename}`);

      const uploadOp = uploadBytes(storageRef, blob, {
        contentType: 'image/jpeg',
      }).then(snapshot => getDownloadURL(snapshot.ref));

      const downloadUrl = await withTimeout<string | null>(uploadOp, 1500, null);
      if (downloadUrl) {
        return downloadUrl;
      }
    }
  } catch (storageErr) {
    console.warn('Firebase Storage upload failed or restricted, using compressed Firestore payload:', storageErr);
  }

  // Fallback: return the optimized data URL so it gets saved in Firestore
  return dataUrl;
}

/**
 * Converts any file to a Base64 data URL
 */
export async function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file into data URL'));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads medical reports, scans, and clinical documents to Firebase.
 * Rapidly captures and converts the document client-side.
 * Attempts Firebase Storage with a strict 1200ms timeout so the user never experiences delays;
 * seamlessly ensures high-fidelity payload persistence directly in the Firestore Lead document.
 */
export async function uploadMedicalDocumentToFirebase(file: File): Promise<{
  url: string;
  dataBase64?: string;
  name: string;
  size: number;
  type: string;
}> {
  let uploadBlob: Blob = file;
  let dataUrl = '';

  if (file.type.startsWith('image/')) {
    try {
      const compressed = await compressImage(file, 1400, 0.82);
      uploadBlob = compressed.blob;
      dataUrl = compressed.dataUrl;
    } catch {
      dataUrl = await fileToDataUrl(file);
    }
  } else {
    dataUrl = await fileToDataUrl(file);
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${Date.now()}_${cleanName}`;

  try {
    if (storage && storage.app) {
      const storageRef = ref(storage, `medical-reports/${filename}`);
      const uploadOp = uploadBytes(storageRef, uploadBlob, {
        contentType: file.type || 'application/octet-stream'
      }).then(snap => getDownloadURL(snap.ref));

      // Fast 1200ms timeout prevents user waiting if Storage rules/CORS retry
      const downloadUrl = await withTimeout<string | null>(uploadOp, 1200, null);
      if (downloadUrl) {
        return {
          url: downloadUrl,
          dataBase64: dataUrl,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream'
        };
      }
    }
  } catch (storageErr) {
    console.warn('Firebase Storage attempt bypassed, storing document payload in Firestore:', storageErr);
  }

  // Instant fallback: return the high-fidelity data URL for direct persistence in Firestore
  return {
    url: dataUrl,
    dataBase64: dataUrl,
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream'
  };
}

/**
 * Downloads a medical document or scan to the user's computer.
 * Supports both Firebase Storage URLs and Data URLs with original file naming.
 */
export function downloadMedicalDocument(doc: { url?: string; dataBase64?: string; name: string }) {
  const fileData = doc.url || doc.dataBase64;
  if (!fileData) {
    console.warn('Document file data is not available for download:', doc.name);
    return;
  }

  // If it's a data URL
  if (fileData.startsWith('data:')) {
    const a = document.createElement('a');
    a.href = fileData;
    a.download = doc.name || 'medical_report';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  // If it's an HTTP/HTTPS URL
  fetch(fileData)
    .then(res => res.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = doc.name || 'medical_report';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(() => {
      // Fallback: open in new tab with download attribute
      const a = document.createElement('a');
      a.href = fileData;
      a.target = '_blank';
      a.download = doc.name || 'medical_report';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
}
