import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const PLACEHOLDER = "/placeholder.svg";

/**
 * Normalize an image src for use with next/image.
 * - keeps http(s) URLs as-is
 * - keeps paths already starting with "/"
 * - strips leading "public/" prefix
 * - falls back to a placeholder when src is empty/invalid
 */
export function normalizeImageSrc(src: string | undefined | null): string {
  if (!src || typeof src !== "string" || src.trim() === "") return PLACEHOLDER;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/")) return src;
  if (src.startsWith("public/")) return "/" + src.replace(/^public\//, "");
  return "/" + src;
}
