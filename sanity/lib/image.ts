import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "@/sanity/lib/client";

const builder = imageUrlBuilder(sanityClient);

type ImageSource = Parameters<typeof builder.image>[0];

export const urlForImage = (source: ImageSource) => builder.image(source);
