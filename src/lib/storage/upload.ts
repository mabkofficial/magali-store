import { createClient } from "@/lib/supabase/client";

const BUCKET = "magali-assets";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function validateMagicBytes(header: Uint8Array, mime: string): boolean {
  if (mime === "image/jpeg") return header[0] === 0xff && header[1] === 0xd8;
  if (mime === "image/png") {
    return (
      header[0] === 0x89 &&
      header[1] === 0x50 &&
      header[2] === 0x4e &&
      header[3] === 0x47
    );
  }
  if (mime === "image/gif") {
    return header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46;
  }
  if (mime === "image/webp") {
    return (
      header[0] === 0x52 &&
      header[1] === 0x49 &&
      header[2] === 0x46 &&
      header[3] === 0x46
    );
  }
  return false;
}

export function publicStorageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

export async function uploadProductImage(
  productId: string,
  file: File,
): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED.has(file.type)) {
    return { error: "Use JPEG, PNG, WebP, or GIF." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Image must be under 5 MB." };
  }

  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!validateMagicBytes(header, file.type)) {
    return { error: "File content does not match an allowed image type." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `products/${productId}/${crypto.randomUUID()}.${ext}`;

  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return { error: error.message };

  return { url: publicStorageUrl(fileName) };
}

export async function deleteStorageObjectByUrl(
  url: string,
): Promise<{ error?: string }> {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return {};

  const path = url.slice(index + marker.length);
  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) return { error: error.message };
  return {};
}
