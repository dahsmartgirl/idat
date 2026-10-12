// Dribbble's CDN resizes on request, so mock images get a srcset and the browser picks the size the card
// actually needs (with sizes="auto" it uses the rendered width). Real uploads will want the same from
// whatever image CDN serves them.
const DRIBBBLE_IMAGE = /^(https:\/\/cdn\.dribbble\.com\/userupload\/\d+\/file\/[^?]+\.(?:png|jpe?g|webp|gif))/;
const WIDTHS = [480, 800, 1200, 1600];

export const responsiveImage = (src: string | undefined, width: number, height: number) => {
  const base = src?.match(DRIBBBLE_IMAGE)?.[1];
  if (!base) return {};
  const aspect = width / height || 4 / 3;
  return {
    srcSet: WIDTHS.map((w) => `${base}?format=webp&resize=${w}x${Math.round(w / aspect)}&vertical=center ${w}w`).join(', '),
    sizes: 'auto, 50vw',
  };
};
