import type { CSSProperties } from "react";

export interface PhotoCrop {
  /** 1 = fit the frame, up to 3 = zoomed in. */
  zoom: number;
  /** Horizontal focus, 0 (left edge) to 100 (right edge). */
  x: number;
  /** Vertical focus, 0 (top edge) to 100 (bottom edge). */
  y: number;
}

export const DEFAULT_CROP: PhotoCrop = { zoom: 1, x: 50, y: 20 };

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * One definition of the framing, used by both the public hero and the admin
 * preview so what you see while editing is exactly what visitors get.
 *
 * The photo layer is `zoom` times the frame size and slid so the focus point
 * (x%, y%) lines up with the same point of the frame; object-position handles
 * photos whose shape differs from the 3:4 frame.
 */
export function cropStyles({ zoom, x, y }: PhotoCrop): {
  layer: CSSProperties;
  image: CSSProperties;
} {
  return {
    layer: {
      position: "absolute",
      width: `${zoom * 100}%`,
      height: `${zoom * 100}%`,
      left: `${-(zoom - 1) * x}%`,
      top: `${-(zoom - 1) * y}%`,
    },
    image: {
      objectFit: "cover",
      objectPosition: `${x}% ${y}%`,
    },
  };
}
