/**
 * Returns the basePath for assets (images, docs, etc.)
 * In production on GitHub Pages this will be "/AIBAPT",
 * locally it will be "".
 */
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

/**
 * Prefixes a local asset path with the basePath.
 * Example: assetPath('/images/logo.png') => '/AIBAPT/images/logo.png' on GH Pages
 */
export function assetPath(path: string): string {
  if (!path) return path;
  // Don't prefix absolute URLs (http/https/data)
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const base = getBasePath();
  // Avoid double-prefixing
  if (base && path.startsWith(base)) {
    return path;
  }
  return `${base}${path}`;
}
