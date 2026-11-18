import Image from "next/image";
import { cropStyles } from "@/lib/utilities/photo-crop";
import type { ProjectImage as Img } from "@/types/portfolio";

/**
 * A project picture inside a 16:10 frame, framed with the saved crop. The
 * parent decides the size; the admin preview uses the same proportions.
 */
export function ProjectImage({
  image,
  alt,
  sizes,
  priority,
}: {
  image: Img;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  const { layer, image: style } = cropStyles(image.crop);
  return (
    <div style={layer}>
      <Image src={image.url} alt={alt} fill sizes={sizes} priority={priority} style={style} />
    </div>
  );
}
