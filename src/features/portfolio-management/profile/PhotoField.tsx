"use client";

import { useContext, useEffect, useRef, useState, type PointerEvent } from "react";
import { FieldErrorsContext, MarkDirtyContext } from "@/components/ui/form";
import { DEFAULT_CROP, clamp, cropStyles, type PhotoCrop } from "@/lib/utilities/photo-crop";

/**
 * Photo picker with a live arch preview. Zoom with the slider, then drag the
 * photo (or use the position sliders) to choose what shows. The preview uses
 * the same framing math as the public hero, so it matches exactly.
 */
export function PhotoField({
  currentUrl,
  crop: savedCrop,
}: {
  currentUrl: string | null;
  crop: PhotoCrop;
}) {
  const error = useContext(FieldErrorsContext).photo;
  const markDirty = useContext(MarkDirtyContext);

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [crop, setCrop] = useState<PhotoCrop>(savedCrop);
  const frame = useRef<HTMLDivElement>(null);
  const drag = useRef(false);

  const src = removed ? null : (fileUrl ?? currentUrl);
  const { layer, image } = cropStyles(crop);

  // Free the temporary preview URL when it is replaced or the page closes.
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const update = (patch: Partial<PhotoCrop>) => {
    setCrop((c) => ({ ...c, ...patch }));
    markDirty();
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!src) return;
    drag.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !frame.current) return;
    const { width, height } = frame.current.getBoundingClientRect();
    // Dragging right moves the picture right, i.e. shows more of its left side.
    const travel = Math.max(crop.zoom - 1, 0.35);
    update({
      x: clamp(crop.x - (e.movementX / width) * (100 / travel), 0, 100),
      y: clamp(crop.y - (e.movementY / height) * (100 / travel), 0, 100),
    });
  };
  const endDrag = () => {
    drag.current = false;
  };

  const slider = "w-full accent-[var(--accent)]";

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="photo" className="text-sm font-medium">
          {currentUrl ? "Replace photo" : "Profile photo"}
        </label>
        <p className="mt-0.5 text-xs text-muted">
          PNG, JPG or WebP, up to 4 MB. Choose a file, then frame it below.
        </p>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          aria-invalid={!!error}
          onChange={(e) => {
            const f = e.target.files?.[0];
            setFileUrl(f ? URL.createObjectURL(f) : null);
            setRemoved(false);
            setCrop(DEFAULT_CROP);
          }}
          className="mt-1.5 block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border file:border-border file:bg-surface-2 file:px-4 file:py-2 file:text-sm file:text-foreground hover:file:border-accent"
        />
        {error && (
          <p role="alert" className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      {src ? (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div>
            <div
              ref={frame}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="relative aspect-[3/4] w-48 cursor-grab touch-none select-none overflow-hidden rounded-t-full rounded-b-[2rem] border border-border bg-rose-soft active:cursor-grabbing"
              aria-label="Photo preview. Drag to reposition."
            >
              {/* A plain img is used because the preview can be a not-yet-uploaded file. */}
              <div style={layer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="Photo preview"
                  draggable={false}
                  className="absolute inset-0 h-full w-full"
                  style={image}
                />
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-muted">Drag the photo to move it</p>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <label className="block text-sm">
              <span className="flex justify-between font-medium">
                Zoom <span className="text-muted">{crop.zoom.toFixed(2)}×</span>
              </span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={crop.zoom}
                onChange={(e) => update({ zoom: Number(e.target.value) })}
                className={slider}
              />
            </label>
            <label className="block text-sm">
              <span className="flex justify-between font-medium">
                Left / right <span className="text-muted">{Math.round(crop.x)}%</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(crop.x)}
                onChange={(e) => update({ x: Number(e.target.value) })}
                className={slider}
              />
            </label>
            <label className="block text-sm">
              <span className="flex justify-between font-medium">
                Up / down <span className="text-muted">{Math.round(crop.y)}%</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(crop.y)}
                onChange={(e) => update({ y: Number(e.target.value) })}
                className={slider}
              />
            </label>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setCrop(DEFAULT_CROP);
                  markDirty();
                }}
                className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-accent hover:text-accent"
              >
                Reset framing
              </button>
              {currentUrl && !fileUrl && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="remove_photo"
                    checked={removed}
                    onChange={(e) => {
                      setRemoved(e.target.checked);
                      markDirty();
                    }}
                    className="size-4 accent-[var(--accent)]"
                  />
                  Remove the current photo
                </label>
              )}
            </div>
          </div>
        </div>
      ) : (
        currentUrl && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="remove_photo"
              checked={removed}
              onChange={(e) => {
                setRemoved(e.target.checked);
                markDirty();
              }}
              className="size-4 accent-[var(--accent)]"
            />
            Remove the current photo (untick to keep it)
          </label>
        )
      )}

      <input type="hidden" name="photo_zoom" value={crop.zoom} />
      <input type="hidden" name="photo_x" value={Math.round(crop.x)} />
      <input type="hidden" name="photo_y" value={Math.round(crop.y)} />
    </div>
  );
}
