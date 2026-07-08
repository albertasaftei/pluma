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
 * Returns true for phones AND tablets (including iPad landscape).
 * Uses `pointer: coarse` to distinguish touch tablets from desktops that happen
 * to share the same viewport width — an iPad in landscape reports 1024px, the
 * same as a narrow laptop, but its pointer is coarse (touch) not fine (mouse).
 */
export function isMobileOrTablet(): boolean {
  if (typeof window === "undefined") return false;
  if (window.innerWidth < 1280) return true;
  const isTouch =
    window.matchMedia?.("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0;
  // Treat touch devices up to 1400px (covers iPad Pro 12.9" landscape at 1366px)
  return isTouch && window.innerWidth < 1400;
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
