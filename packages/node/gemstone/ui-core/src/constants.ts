/**
 * Number of pixels (in canvas space) per foot of world space.
 * 12 is equivalent to one pixel per inch.
 */
export const RENDER_SCALE = 12

export const feetToPixels = (feet: number) => feet * RENDER_SCALE
export const pixelsToFeet = (pixels: number) => pixels / RENDER_SCALE
