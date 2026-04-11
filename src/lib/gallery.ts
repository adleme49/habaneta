// Static gallery pictures shown in the visualization module's "Gallery"
// modal. Paths normalized to absolute /assets/... so they resolve from
// any route.

export const galleryPictures: { imgUrl: string }[] = Array.from(
  { length: 21 },
  (_, i) => ({ imgUrl: `/assets/Gallery/f${i + 1}.jpeg` })
);
