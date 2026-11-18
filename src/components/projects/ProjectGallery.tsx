"use client";

import { useState } from "react";
import type { ProjectImage as Img } from "@/types/portfolio";
import { ProjectImage } from "./ProjectImage";
import { cn } from "@/lib/utilities/cn";

/** Large picture plus thumbnails; every picture keeps its saved framing. */
export function ProjectGallery({ images, title }: { images: Img[]; title: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;
  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="mt-8">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-surface-2">
        <ProjectImage
          key={current.url}
          image={current}
          alt={`${title} screenshot ${active + 1} of ${images.length}`}
          sizes="(min-width: 768px) 768px, 100vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2" aria-label="Project pictures">
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show picture ${i + 1} of ${images.length}`}
                aria-current={i === active}
                className={cn(
                  "relative block aspect-[16/10] w-full overflow-hidden rounded-lg border bg-surface-2 transition",
                  i === active
                    ? "border-accent ring-2 ring-accent/40"
                    : "border-border opacity-70 hover:opacity-100",
                )}
              >
                <ProjectImage image={img} alt="" sizes="160px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
