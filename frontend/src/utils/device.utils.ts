/**
 * Detects if the current device is a mobile device based on screen width
 * @param breakpoint - The maximum width in pixels to consider as mobile (default: 768px)
 * @returns true if the device is considered mobile, false otherwise
 */
export function isMobile(breakpoint: number = 768): boolean {
  if (typeof window === "undefined") {
    return false; // SSR fallback
  }
  return window.innerWidth < breakpoint;
}

/**
 * Detects if the current device is a tablet based on screen width
 * @returns true if the device is considered a tablet
 */
export function isTablet(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Detects if the current device is a desktop based on screen width
 * @returns true if the device is considered a desktop
 */
export function isDesktop(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.innerWidth >= 1024;
}
