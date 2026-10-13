/**
 * Resolves static asset paths (like images in /public) with absolute root URL support.
 * Ensures assets resolve correctly on all deep routes (e.g., /outstation-cabs/, /tours/ooty-coonoor-kotagiri/)
 * as well as on custom root domains (e.g., https://www.ctaxicab.com).
 */
export function assetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // Format path to ensure leading slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Handle subpath base if configured in environment (e.g., for GitHub Pages subfolders)
  const base = import.meta.env.BASE_URL || '/';
  if (base !== '/' && base !== './') {
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${cleanBase}${cleanPath}`;
  }
  
  return cleanPath;
}
