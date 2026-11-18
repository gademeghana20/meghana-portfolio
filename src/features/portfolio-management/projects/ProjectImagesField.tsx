"use client";

import { useContext, useEffect, useRef, useState, type PointerEvent } from "react";
import { FieldErrorsContext, MarkDirtyContext } from "@/components/ui/form";
import {
  DEFAULT_PROJECT_CROP,
  clamp,
  cropStyles,
  type PhotoCrop,
} from "@/lib/utilities/photo-crop";
import { MAX_PROJECT_IMAGES } from "@/lib/validation/projects";

export interface ExistingImage {
  path: string;
  url: string;
  crop: PhotoCrop;
}

interface Slot {
  key: string;
  /** Stored path for a saved picture; undefined for a new one. */
  path?: string;
  /** Saved picture URL, or a temporary preview of a newly chosen file. */
  src: string | null;
  crop: PhotoCrop;
}

let counter = 0;
const newKey = () => `n${Date.now().toString(36)}${counter++}`;

/**
 * Up to five pictures per project. The first one is shown on the project
 * card; all of them appear when someone opens "View details". Each picture is
 * framed with the same zoom/drag controls, using a preview with the same
 * proportions as the public site so what you see is what visitors get.
 */
export function ProjectImagesField({ initial }: { initial: ExistingImage[] }) {
  const error = useContext(FieldErrorsContext).images;
  const markDirty = useContext(MarkDirtyContext);

  const [slots, setSlots] = useState<Slot[]>(() =>
    initial.map((i) => ({ key: newKey(), path: i.path, src: i.url, crop: i.crop })),
  );

  // Free temporary preview URLs when the page closes.
  const blobs = useRef<string[]>([]);
  useEffect(() => {
    const urls = blobs.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const change = (next: Slot[]) => {
    setSlots(next);
    markDirty();
  };
  const patch = (key: string, p: Partial<Slot>) =>
    change(slots.map((s) => (s.key === key ? { ...s, ...p } : s)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= slots.length) return;
    const next = [...slots];
    [next[i], next[j]] = [next[j], next[i]];
    change(next);
  };

  const meta = JSON.stringify(
    slots
      .filter((s) => s.path || s.src)
      .map((s) => ({
        kind: s.path ? "existing" : "new",
        ref: s.path ?? s.key,
        zoom: s.crop.zoom,
        x: Math.round(s.crop.x),
        y: Math.round(s.crop.y),
      })),
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium">
          Pictures{" "}
          <span className="font-normal text-muted">(optional, up to {MAX_PROJECT_IMAGES})</span>
        </p>
        <p className="mt-0.5 text-xs text-muted">
          The first picture is shown on the project card. All pictures appear when someone opens
          &ldquo;View details&rdquo;. PNG, JPG or WebP, up to 4 MB each. Do not upload anything
          confidential.
        </p>
      </div>

      <ul className="space-y-5">
        {slots.map((slot, i) => (
          <SlotEditor
            key={slot.key}
            slot={slot}
            index={i}
            count={slots.length}
            onChange={(p) => patch(slot.key, p)}
            onPick={(file) => {
              const url = URL.createObjectURL(file);
              blobs.current.push(url);
              patch(slot.key, { src: url, crop: DEFAULT_PROJECT_CROP });
            }}
            onMove={(d) => move(i, d)}
            onRemove={() => change(slots.filter((s) => s.key !== slot.key))}
            markDirty={markDirty}
          />
        ))}
      </ul>

      {slots.length < MAX_PROJECT_IMAGES && (
        <button
          type="button"
          onClick={() =>
            change([...slots, { key: newKey(), src: null, crop: DEFAULT_PROJECT_CROP }])
          }
          className="rounded-lg border border-dashed border-border px-4 py-2 text-sm hover:border-accent hover:text-accent"
        >
          + Add picture ({slots.length}/{MAX_PROJECT_IMAGES})
        </button>
      )}

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <input type="hidden" name="images_meta" value={meta} />
    </div>
  );
}

function SlotEditor({
  slot,
  index,
  count,
  onChange,
  onPick,
  onMove,
  onRemove,
  markDirty,
}: {
  slot: Slot;
  index: number;
  count: number;
  onChange: (p: Partial<Slot>) => void;
  onPick: (file: File) => void;
  onMove: (d: -1 | 1) => void;
  onRemove: () => void;
  markDirty: () => void;
}) {
  const { crop, src } = slot;
  const frame = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const { layer, image } = cropStyles(crop);
  const setCrop = (p: Partial<PhotoCrop>) => onChange({ crop: { ...crop, ...p } });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !frame.current) return;
    const { width, height } = frame.current.getBoundingClientRect();
    const travel = Math.max(crop.zoom - 1, 0.35);
    setCrop({
      x: clamp(crop.x - (e.movementX / width) * (100 / travel), 0, 100),
      y: clamp(crop.y - (e.movementY / height) * (100 / travel), 0, 100),
    });
  };
  const endDrag = () => {
    drag.current = false;
  };

  const slider = "w-full accent-[var(--accent)]";
  const btn =
    "rounded-md border border-border px-3 py-1.5 text-xs hover:border-accent hover:text-accent disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground";

  return (
    <li className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">
          {index === 0 ? "Main picture (shown on the card)" : `Picture ${index + 1}`}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className={btn}
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label={`Move picture ${index + 1} earlier`}
          >
            ↑
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => onMove(1)}
            disabled={index === count - 1}
            aria-label={`Move picture ${index + 1} later`}
          >
            ↓
          </button>
          <button type="button" className={btn} onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>

      {!slot.path && (
        <input
          name={`image_${slot.key}`}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          aria-label={`Choose picture ${index + 1}`}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
          }}
          className="mb-3 block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border file:border-border file:bg-surface-2 file:px-4 file:py-2 file:text-sm file:text-foreground hover:file:border-accent"
        />
      )}

      {src ? (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="sm:w-64 sm:shrink-0">
            <div
              ref={frame}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="relative aspect-[16/10] w-full cursor-grab touch-none select-none overflow-hidden rounded-lg border border-border bg-surface-2 active:cursor-grabbing"
              aria-label="Picture preview. Drag to reposition."
            >
              <div style={layer}>
                {/* A plain img is used because the preview can be a not-yet-uploaded file. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="Picture preview"
                  draggable={false}
                  className="absolute inset-0 h-full w-full"
                  style={image}
                />
              </div>
            </div>
            <p className="mt-1.5 text-center text-xs text-muted">Drag the picture to move it</p>
          </div>

          <div className="min-w-0 flex-1 space-y-3">
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
                onChange={(e) => setCrop({ zoom: Number(e.target.value) })}
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
                onChange={(e) => setCrop({ x: Number(e.target.value) })}
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
                onChange={(e) => setCrop({ y: Number(e.target.value) })}
                className={slider}
              />
            </label>
            <button
              type="button"
              className={btn}
              onClick={() => {
                onChange({ crop: DEFAULT_PROJECT_CROP });
                markDirty();
              }}
            >
              Reset framing
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted">Choose a file above to see and frame it here.</p>
      )}
    </li>
  );
}
