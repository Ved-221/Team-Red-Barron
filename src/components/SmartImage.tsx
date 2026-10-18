import Image, { type ImageProps, type StaticImageData } from "next/image";

// Allowed hosts from next.config.ts remotePatterns
const ALLOWED_REMOTE_HOSTS = new Set([
  "axzwucvnrjtenvvrxfew.supabase.co",
  "images.unsplash.com",
  "lh3.googleusercontent.com",
]);

export interface SmartImageProps extends Omit<ImageProps, "src"> {
  src?: string | StaticImageData | null;
  fallbackSrc?: string;
}

/**
 * Normalizes and URL-encodes a path or URL.
 * Handles paths with unencoded spaces (e.g. `/team/SAMARTH_MORE_SECOND YEAR.jpg`).
 */
function normalizeSrc(src: string): string {
  if (!src) return "";

  // Data or blob URLs
  if (src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  // Local relative paths
  if (src.startsWith("/")) {
    if (src.includes(" ")) {
      return encodeURI(src);
    }
    return src;
  }

  // Absolute http/https URLs
  if (src.startsWith("http://") || src.startsWith("https://")) {
    try {
      const url = new URL(src);
      return url.toString();
    } catch {
      return encodeURI(src);
    }
  }

  return src;
}

/**
 * Determines whether Next.js optimizer can safely process the image.
 * Returns true (force unoptimized) for:
 * 1. Data or blob URLs
 * 2. SVGs (vector graphics)
 * 3. External hosts not in remotePatterns (prevents runtime crashes)
 */
function shouldForceUnoptimized(src: string): boolean {
  if (!src) return true;

  const lower = src.toLowerCase();

  // Blob or Data URLs
  if (lower.startsWith("blob:") || lower.startsWith("data:")) {
    return true;
  }

  // SVGs
  if (lower.endsWith(".svg") || lower.includes(".svg?") || lower.includes(".svg#")) {
    return true;
  }

  // Local paths are safely optimizable by Next.js
  if (src.startsWith("/")) {
    return false;
  }

  // Remote URLs
  if (src.startsWith("http://") || src.startsWith("https://")) {
    try {
      const url = new URL(src);
      if (ALLOWED_REMOTE_HOSTS.has(url.hostname)) {
        return false;
      }
      // Untrusted or non-whitelisted domain -> unoptimized to avoid fatal error
      return true;
    } catch {
      return true;
    }
  }

  return false;
}

export function SmartImage({
  src,
  fallbackSrc = "/team_person.webp",
  alt = "",
  unoptimized,
  ...rest
}: SmartImageProps) {
  const rawStringSrc = typeof src === "string" ? src : (src as StaticImageData | undefined)?.src || "";
  const effectiveRaw = rawStringSrc.trim() || fallbackSrc;
  const normalized = normalizeSrc(effectiveRaw);

  const forceUnoptimized = unoptimized ?? shouldForceUnoptimized(normalized);

  return (
    <Image
      {...rest}
      src={normalized}
      alt={alt}
      unoptimized={forceUnoptimized}
    />
  );
}
