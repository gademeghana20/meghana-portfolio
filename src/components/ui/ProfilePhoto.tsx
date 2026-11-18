import Image from "next/image";
import { cropStyles, type PhotoCrop } from "@/lib/utilities/photo-crop";

/** The photo inside the arch frame, framed with the saved crop settings. */
export function ProfilePhoto({
  src,
  alt,
  crop,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  crop: PhotoCrop;
  sizes: string;
  priority?: boolean;
}) {
  const { layer, image } = cropStyles(crop);
  return (
    <div style={layer}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={image}
      />
    </div>
  );
}
